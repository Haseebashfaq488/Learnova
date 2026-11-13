"""Adapter interfacing with the local Antigravity Agent CLI (agy / agentapi)."""

import json
import logging
import os
import re
import shutil
import subprocess
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

# Default brain base path on Windows / current system
DEFAULT_BRAIN_DIR = Path(os.environ.get("USERPROFILE", "C:/Users/PMYLS")) / ".gemini" / "antigravity" / "brain"
DEFAULT_BIN_DIR = Path(os.environ.get("USERPROFILE", "C:/Users/PMYLS")) / ".gemini" / "antigravity" / "bin"


class AgyCliAdapter:
    """Subprocess adapter executing agy / agentapi terminal commands and reading transcript logs."""

    def __init__(
        self,
        cli_command: Optional[str] = None,
        brain_dir: Optional[Path] = None,
        default_model: str = "flash",
        poll_timeout_seconds: float = 25.0,
    ):
        self.cli_command = cli_command or self._discover_cli()
        self.brain_dir = brain_dir or DEFAULT_BRAIN_DIR
        self.default_model = default_model
        self.poll_timeout_seconds = poll_timeout_seconds

    @staticmethod
    def _discover_cli() -> str:
        """Locate agy or agentapi executable on system PATH or default directory."""
        if shutil.which("agy"):
            return "agy"
        if shutil.which("agentapi"):
            return "agentapi"

        candidate_bat = DEFAULT_BIN_DIR / "agentapi.bat"
        if candidate_bat.exists():
            return str(candidate_bat)

        candidate_cmd = DEFAULT_BIN_DIR / "agy.cmd"
        if candidate_cmd.exists():
            return str(candidate_cmd)

        return "agentapi"

    def new_conversation(
        self,
        prompt: str,
        title: Optional[str] = None,
        model: Optional[str] = None,
    ) -> Optional[str]:
        """Start a new agent conversation via agy new-conversation and return the conversation_id."""
        cmd = [self.cli_command, "new-conversation"]
        chosen_model = model or self.default_model
        if chosen_model:
            cmd.append(f"--model={chosen_model}")
        if title:
            clean_title = re.sub(r'[\r\n"]', " ", title)[:80].strip()
            cmd.append(f'--title="{clean_title}"')
        cmd.append(prompt)

        try:
            logger.info("Starting AGY conversation with command: %s", " ".join(cmd[:3]))
            proc = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                shell=True,
                timeout=20,
            )
            if proc.returncode == 0 and proc.stdout:
                data = json.loads(proc.stdout)
                conv_id = data.get("response", {}).get("newConversation", {}).get("conversationId")
                if conv_id:
                    logger.info("Successfully initiated AGY conversation %s", conv_id)
                    return str(conv_id)
            logger.warning("agy new-conversation failed (%d): %s", proc.returncode, proc.stderr)
        except Exception as exc:
            logger.warning("Failed to invoke agy new-conversation: %s", exc)

        return None

    def send_message(
        self,
        conversation_id: str,
        content: str,
        title: Optional[str] = None,
    ) -> bool:
        """Send follow-up message into an existing conversation session."""
        cmd = [self.cli_command, "send-message"]
        if title:
            clean_title = re.sub(r'[\r\n"]', " ", title)[:80].strip()
            cmd.append(f'--title="{clean_title}"')
        cmd.extend([conversation_id, content])

        try:
            logger.info("Sending message to AGY conversation %s", conversation_id)
            proc = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                shell=True,
                timeout=15,
            )
            return proc.returncode == 0
        except Exception as exc:
            logger.warning("Failed to send message to agy conversation %s: %s", conversation_id, exc)
            return False

    def wait_for_latest_response(
        self,
        conversation_id: str,
        previous_step_count: int = 0,
        timeout_seconds: Optional[float] = None,
    ) -> Tuple[Optional[str], int]:
        """Poll the conversation's transcript.jsonl until a new response is written."""
        timeout = timeout_seconds or self.poll_timeout_seconds
        transcript_path = self.brain_dir / conversation_id / ".system_generated" / "logs" / "transcript.jsonl"
        start_time = time.time()

        last_content = None
        new_step_count = previous_step_count

        while time.time() - start_time < timeout:
            if transcript_path.exists():
                try:
                    lines = transcript_path.read_text(encoding="utf-8", errors="replace").strip().splitlines()
                    if len(lines) > previous_step_count:
                        new_step_count = len(lines)
                        # Scan backward for the most recent MODEL response
                        for line in reversed(lines):
                            try:
                                record = json.loads(line)
                                if record.get("source") == "MODEL" and record.get("status") == "DONE":
                                    content = record.get("content")
                                    if content:
                                        return content.strip(), new_step_count
                                    # Fallback to thinking or tool calls if pure text content is blank
                                    thinking = record.get("thinking")
                                    if thinking and not last_content:
                                        last_content = thinking.strip()
                            except Exception:
                                continue
                        if last_content:
                            return last_content, new_step_count
                except Exception as exc:
                    logger.debug("Error reading transcript: %s", exc)

            time.sleep(0.75)

        return last_content, new_step_count

    @staticmethod
    def extract_json_array(text: str) -> List[Dict[str, Any]]:
        """Extract JSON array from agent response text (handling code blocks or raw JSON)."""
        if not text:
            return []

        # Try regex search for ```json [...] ``` or ``` [...] ```
        match = re.search(r"```(?:json)?\s*(\[\s*\{.*?\}\s*\])\s*```", text, re.DOTALL)
        if match:
            try:
                parsed = json.loads(match.group(1))
                if isinstance(parsed, list):
                    return parsed
            except Exception:
                pass

        # Try finding standalone [ ... ]
        start = text.find("[")
        end = text.rfind("]")
        if start != -1 and end != -1 and end > start:
            try:
                parsed = json.loads(text[start : end + 1])
                if isinstance(parsed, list):
                    return parsed
            except Exception:
                pass

        return []
