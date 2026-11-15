import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowLeft,
  Send,
  BookOpen,
  Lightbulb,
  Code2,
  Paperclip,
  Check,
  Bot,
  User as UserIcon,
  Clock,
  Eye,
  HelpCircle,
  HelpCircle as QuestionIcon,
  Smile,
  ShieldCheck,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Course, Topic, Lesson, LearningResource } from '../../types';
import { aiApi, AISessionMessageItem, AIAttachmentItem } from '../../services/api/aiApi';
import { RichMarkdownRenderer } from '../../components/common/RichMarkdownRenderer';
import { StudentNavigationPage } from '../../components/student/StudentLayout';

interface SimplificationStudioPageProps {
  courseId: string;
  topicId: string;
  lessonId: string;
  courses: Course[];
  topics: Topic[];
  lessons: Lesson[];
  resources: LearningResource[];
  onNavigate: (page: StudentNavigationPage, params?: Record<string, string>) => void;
}

export const SimplificationStudioPage: React.FC<SimplificationStudioPageProps> = ({
  courseId,
  topicId,
  lessonId,
  courses,
  topics,
  lessons,
  resources,
  onNavigate,
}) => {
  const course = courses.find((c) => c.id === courseId) || courses[0];
  const topic = topics.find((t) => t.id === topicId) || topics[0];
  const lesson = lessons.find((l) => l.id === lessonId) || lessons[0];

  const lessonResources = resources.filter((r) => r.lessonId === lesson?.id);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AISessionMessageItem[]>([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Attachments state
  const [selectedAttachmentIds, setSelectedAttachmentIds] = useState<string[]>([]);
  const [isAttachmentsTrayOpen, setIsAttachmentsTrayOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Connect to persistent session on mount
  useEffect(() => {
    if (!course?.id) return;

    let isMounted = true;
    const initSession = async () => {
      setIsInitializing(true);
      setError(null);
      try {
        const session = await aiApi.getOrCreateSession({
          session_type: 'lesson_tutoring',
          course_id: course.id,
          topic_id: topic?.id,
          lesson_id: lesson?.id,
          title: `Tutoring: ${lesson?.title || 'Lesson'}`,
        });

        if (!isMounted) return;
        setSessionId(session.id);

        const history = await aiApi.getSessionMessages(session.id);
        if (isMounted) {
          setMessages(history);
        }
      } catch (err: any) {
        console.error('Studio session init error:', err);
        if (isMounted) {
          setError(err?.message || 'Could not connect to persistent AI session.');
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    initSession();
    return () => {
      isMounted = false;
    };
  }, [course?.id, topic?.id, lesson?.id]);

  const toggleAttachment = (id: string) => {
    setSelectedAttachmentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getSelectedAttachmentsPayload = (): AIAttachmentItem[] => {
    return lessonResources
      .filter((r) => selectedAttachmentIds.includes(r.id))
      .map((r) => ({
        id: r.id,
        title: r.title,
        type: r.type,
        content: r.contentOrUrl,
      }));
  };

  const handleSendMessage = async (
    text: string,
    mode: 'simplify' | 'analogy' | 'example' | 'diagram' | 'custom' = 'custom'
  ) => {
    if (!text.trim() || isLoading) return;

    const attachedPayload = getSelectedAttachmentsPayload();
    setIsLoading(true);
    setError(null);

    // Optimistic user message
    const tempUserMsg: AISessionMessageItem = {
      id: `temp-${Date.now()}`,
      session_id: sessionId || 'temp',
      sender: 'user',
      content: text,
      attachments: attachedPayload,
      raw_metadata: { mode },
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setCustomPrompt('');

    try {
      if (sessionId) {
        const agentMsg = await aiApi.sendSessionMessage(sessionId, {
          content: text,
          mode,
          attachments: attachedPayload,
        });
        setMessages((prev) => [...prev, agentMsg]);
      } else {
        const fallbackRes = await aiApi.simplifyLesson({
          lessonId: lesson?.id,
          lessonTitle: lesson?.title,
          topicTitle: topic?.title,
          courseTitle: course?.title,
          lessonContent: lesson?.description,
          mode,
          customPrompt: text,
        });
        const fallbackAgentMsg: AISessionMessageItem = {
          id: `agent-${Date.now()}`,
          session_id: 'legacy',
          sender: 'agent',
          content: fallbackRes.explanation,
          attachments: [],
          raw_metadata: { source: fallbackRes.source },
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, fallbackAgentMsg]);
      }
    } catch (err: any) {
      console.error('Studio send message error:', err);
      setError(err?.message || 'Could not complete message exchange with AGY agent.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetAction = (actionKey: string) => {
    if (actionKey === 'diagram') {
      handleSendMessage(
        `Generate a visual architecture diagram (Mermaid.js flowchart or sequence diagram) explaining the flow and invariants of "${lesson?.title}".`,
        'diagram'
      );
    } else if (actionKey === 'simplify') {
      handleSendMessage(
        `Please simplify the core concepts in "${lesson?.title}" into plain, intuitive language with the 5-second mental model.`,
        'simplify'
      );
    } else if (actionKey === 'analogy') {
      handleSendMessage(
        `Can you give me a memorable real-world analogy to understand "${lesson?.title}"?`,
        'analogy'
      );
    } else if (actionKey === 'example') {
      handleSendMessage(
        `Show me a concrete step-by-step worked code example demonstrating "${lesson?.title}".`,
        'example'
      );
    } else if (actionKey === 'eli5') {
      handleSendMessage(
        `Explain "${lesson?.title}" like I'm 5 years old. Use a playful analogy and zero technical jargon.`,
        'custom'
      );
    } else if (actionKey === 'test_me') {
      handleSendMessage(
        `Ask me 1 challenging multiple-choice or conceptual question to test my understanding of "${lesson?.title}". Don't reveal the answer until I respond.`,
        'custom'
      );
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-10 view-enter-animation">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200 dark:border-gray-800">
        <button
          type="button"
          onClick={() =>
            onNavigate('lesson', {
              courseId: course.id,
              topicId: topic.id,
              lessonId: lesson.id,
            })
          }
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Lesson Workspace</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>AI Simplification Studio</span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>Persistent Session</span>
          </div>
        </div>
      </div>

      {/* Main Studio 2-Column Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Sidebar: Lesson Context, Presets & Attachments (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Lesson Meta Card */}
          <div className="bg-white dark:bg-[#181C24] border border-[#D9DEE7] dark:border-[#2D3545] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                Unit {lesson?.order || 1}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {topic?.title}
              </span>
            </div>
            <h2 className="text-base font-extrabold text-gray-900 dark:text-white leading-snug">
              {lesson?.title}
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
              {lesson?.description || 'Foundational curriculum concept'}
            </p>
          </div>

          {/* Quick-Action Pedagogical Presets */}
          <div className="bg-white dark:bg-[#181C24] border border-[#D9DEE7] dark:border-[#2D3545] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Pedagogical Prompt Presets</span>
            </h3>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handlePresetAction('diagram')}
                disabled={isLoading || isInitializing}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-purple-500 dark:hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 text-xs font-semibold text-gray-800 dark:text-gray-200 transition text-left cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Eye className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-900 dark:text-white">Visual Architecture Diagram</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">Mermaid.js vector flowchart</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handlePresetAction('simplify')}
                disabled={isLoading || isInitializing}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-xs font-semibold text-gray-800 dark:text-gray-200 transition text-left cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-900 dark:text-white">5-Second Mental Model</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">Plain language core intuition</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handlePresetAction('analogy')}
                disabled={isLoading || isInitializing}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-amber-500 dark:hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 text-xs font-semibold text-gray-800 dark:text-gray-200 transition text-left cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-900 dark:text-white">Real-World Analogy</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">Everyday physical comparison</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handlePresetAction('example')}
                disabled={isLoading || isInitializing}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-xs font-semibold text-gray-800 dark:text-gray-200 transition text-left cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Code2 className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-900 dark:text-white">Worked Code Walkthrough</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">Step-by-step logic trace</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handlePresetAction('eli5')}
                disabled={isLoading || isInitializing}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-pink-500 dark:hover:border-pink-400 hover:bg-pink-50/50 dark:hover:bg-pink-950/20 text-xs font-semibold text-gray-800 dark:text-gray-200 transition text-left cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 flex items-center justify-center shrink-0">
                  <Smile className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-900 dark:text-white">Explain Like I'm 5</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">Zero jargon playful breakdown</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handlePresetAction('test_me')}
                disabled={isLoading || isInitializing}
                className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-cyan-500 dark:hover:border-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/20 text-xs font-semibold text-gray-800 dark:text-gray-200 transition text-left cursor-pointer"
              >
                <div className="w-6 h-6 rounded-lg bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <QuestionIcon className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-900 dark:text-white">Test My Understanding</div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">Socratic 1-question check</div>
                </div>
              </button>
            </div>
          </div>

          {/* Attached Syllabus Resources Panel */}
          {lessonResources.length > 0 && (
            <div className="bg-white dark:bg-[#181C24] border border-[#D9DEE7] dark:border-[#2D3545] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
              <button
                type="button"
                onClick={() => setIsAttachmentsTrayOpen((prev) => !prev)}
                className="w-full flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Attach Lesson Media ({selectedAttachmentIds.length}/{lessonResources.length})</span>
                </div>
                {isAttachmentsTrayOpen ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {isAttachmentsTrayOpen && (
                <div className="space-y-1.5 pt-1">
                  {lessonResources.map((res) => {
                    const isChecked = selectedAttachmentIds.includes(res.id);
                    return (
                      <label
                        key={res.id}
                        className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition ${
                          isChecked
                            ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200'
                            : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAttachment(res.id)}
                            className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                          />
                          <span className="font-medium truncate">{res.title}</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 shrink-0">
                          {res.type}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right / Center Canvas: ChatGPT-grade Conversation Stream (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#181C24] border border-[#D9DEE7] dark:border-[#2D3545] rounded-2xl shadow-xs flex flex-col h-[740px] overflow-hidden">
          {/* Chat Stream Header */}
          <div className="px-5 py-3.5 border-b border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-[#1C212B] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                AI
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white">
                  AGY Academic Tutor Studio
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  {course.title} • Grounded in master syllabus
                </p>
              </div>
            </div>

            <span className="text-[11px] text-gray-500 dark:text-gray-400 hidden sm:inline-block">
              Supports Mermaid.js, code annotations, & analogies
            </span>
          </div>

          {/* Conversation Messages Scrollport */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            {isInitializing && (
              <div className="p-10 text-center space-y-3">
                <div className="w-8 h-8 mx-auto border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Connecting to persistent AI tutoring session...
                </p>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold">Error exchanging with tutor agent</p>
                  <p className="mt-0.5 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender !== 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[90%] rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-xs'
                      : 'bg-gray-50 dark:bg-[#1C212B] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-xs'
                  }`}
                >
                  {/* Attachments pills in message */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mb-2.5 flex flex-wrap gap-1.5">
                      {msg.attachments.map((att: any, i: number) => (
                        <span
                          key={i}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold ${
                            msg.sender === 'user'
                              ? 'bg-indigo-700/80 text-indigo-100'
                              : 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                          }`}
                        >
                          <Paperclip className="w-3 h-3" />
                          <span>{att.title || 'Attached Resource'}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {msg.sender === 'user' ? (
                    <div className="whitespace-pre-wrap font-sans text-white text-xs sm:text-sm">
                      {msg.content}
                    </div>
                  ) : (
                    <RichMarkdownRenderer content={msg.content} />
                  )}

                  {/* Message timestamp and telemetry */}
                  <div
                    className={`mt-2.5 pt-2 border-t flex items-center gap-2 text-[10px] ${
                      msg.sender === 'user'
                        ? 'border-indigo-500/50 text-indigo-200 justify-end'
                        : 'border-gray-200 dark:border-gray-800 text-gray-400 justify-start'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>
                      {msg.created_at
                        ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : 'Just now'}
                    </span>
                    {msg.raw_metadata?.source && (
                      <span>• {msg.raw_metadata.source === 'agy_cli' ? 'AGY Terminal' : 'Curriculum Grounded'}</span>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3.5 justify-start">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-2xs">
                  <Bot className="w-4 h-4 animate-pulse" />
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-[#1C212B] border border-gray-200 dark:border-gray-800 text-xs text-gray-500 flex items-center gap-2.5 shadow-xs">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
                  <span>AGY Academic Tutor is formulating explanation & diagram...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Floating Composer Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#181C24] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(customPrompt, 'custom');
              }}
              className="space-y-2.5"
            >
              <div className="relative">
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Ask a question about this lesson, request a diagram, or clarify an attached resource..."
                  disabled={isLoading || isInitializing}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs sm:text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
                <button
                  type="submit"
                  disabled={!customPrompt.trim() || isLoading || isInitializing}
                  className={`absolute right-2 top-2 p-2 rounded-lg transition ${
                    customPrompt.trim() && !isLoading
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer shadow-xs'
                      : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  }`}
                  aria-label="Send message to AGY tutor"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-400 dark:text-gray-500 px-1">
                <span>Session memory persisted in PostgreSQL • AGY CLI Engine</span>
                {selectedAttachmentIds.length > 0 && (
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                    {selectedAttachmentIds.length} resource(s) attached
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
