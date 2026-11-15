import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Copy, Check, Eye, AlertCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface MermaidDiagramProps {
  chart: string;
  className?: string;
}

let diagramIdCounter = 0;

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const chartId = useRef(`mermaid-${Date.now()}-${++diagramIdCounter}`).current;

  // Determine diagram type from syntax
  const getDiagramTypeLabel = (code: string): string => {
    const trimmed = code.trim().toLowerCase();
    if (trimmed.startsWith('flowchart') || trimmed.startsWith('graph')) return 'Flowchart';
    if (trimmed.startsWith('sequencediagram')) return 'Sequence Diagram';
    if (trimmed.startsWith('statediagram')) return 'State Diagram';
    if (trimmed.startsWith('classdiagram')) return 'Class Diagram';
    if (trimmed.startsWith('erdiagram')) return 'ER Diagram';
    if (trimmed.startsWith('mindmap')) return 'Mindmap';
    return 'Architecture Diagram';
  };

  useEffect(() => {
    let isCancelled = false;

    const renderChart = async () => {
      if (!chart.trim()) return;

      try {
        setError(null);
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'default',
          securityLevel: 'loose',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          themeVariables: isDark
            ? {
                primaryColor: '#3156D3',
                primaryTextColor: '#F3F4F6',
                primaryBorderColor: '#4368E8',
                lineColor: '#6B7280',
                secondaryColor: '#1F2937',
                tertiaryColor: '#111827',
                background: '#181C24',
                mainBkg: '#1E232E',
                nodeBorder: '#374151',
                clusterBkg: '#141820',
              }
            : {
                primaryColor: '#E8EEFF',
                primaryTextColor: '#1E293B',
                primaryBorderColor: '#3156D3',
                lineColor: '#64748B',
                secondaryColor: '#F8FAFC',
                tertiaryColor: '#F1F5F9',
                background: '#FFFFFF',
                mainBkg: '#FFFFFF',
                nodeBorder: '#CBD5E1',
                clusterBkg: '#F8FAFC',
              },
        });

        // Clean any stray markdown fences or html entities
        let cleanChart = chart.trim().replace(/^```mermaid\s*/i, '').replace(/```$/i, '').trim();

        // Sanitize edge labels enclosed in pipes: |"something"| or |"=" (points to)| -> remove quotes inside pipes to prevent syntax errors
        cleanChart = cleanChart.replace(/\|([^|\r\n]+)\|/g, (_match, inner) => {
          return `|${inner.replace(/["']/g, '')}|`;
        });

        // Render diagram to SVG
        const renderId = `render-${chartId}`;
        const { svg } = await mermaid.render(renderId, cleanChart);

        if (!isCancelled) {
          setSvgContent(svg);
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.warn('Mermaid rendering notice:', err);
          setError(err?.message || 'Could not compile visual diagram');
        }
      }
    };

    renderChart();

    return () => {
      isCancelled = true;
    };
  }, [chart, isDark, chartId]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(chart.trim());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className={`my-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151921] overflow-hidden shadow-xs ${className}`}
    >
      {/* Diagram Header Bar */}
      <div className="px-3.5 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50/75 dark:bg-[#1A1F29] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-indigo-500" />
            {getDiagramTypeLabel(chart)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyCode}
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
          title="Copy Mermaid code"
          aria-label="Copy Mermaid diagram source"
        >
          {isCopied ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy Source</span>
            </>
          )}
        </button>
      </div>

      {/* SVG Canvas / Error Fallback */}
      <div className="p-4 overflow-x-auto flex justify-center items-center min-h-[140px]">
        {error ? (
          <div className="text-left w-full space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Visual diagram rendering preview:</span>
            </div>
            <pre className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 font-mono text-xs text-gray-700 dark:text-gray-300 overflow-x-auto whitespace-pre">
              {chart}
            </pre>
          </div>
        ) : svgContent ? (
          <div
            ref={containerRef}
            className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto [&>svg]:transition-all"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        ) : (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <span>Compiling diagram vector...</span>
          </div>
        )}
      </div>
    </div>
  );
};
