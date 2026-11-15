import React, { useState } from 'react';
import {
  Brain,
  GitMerge,
  ShieldCheck,
  Database,
  Cpu,
  Layers,
  Award,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { PublicNavigationPage } from '../../services/routerService';
import { ThreeArchitectureCanvas } from '../../components/public/ThreeArchitectureCanvas';

interface AboutPageProps {
  onNavigate: (page: PublicNavigationPage, params?: Record<string, string>) => void;
  onEnterPortal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onEnterPortal }) => {
  const [activeTab, setActiveTab] = useState<'bkt' | 'dag' | 'quarantine' | 'outbox'>('bkt');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12 sm:space-y-16">
      {/* =========================================================================
          HERO WITH 3D ARCHITECTURE CANVAS
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300">
            <Cpu className="w-3.5 h-3.5" />
            <span>Learnova Architectural Manifesto</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
            Competency-based education demands mathematical proof, not completion checkboxes.
          </h1>

          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
            Bayesian Knowledge Tracing, Directed Acyclic Graph prerequisites, and faculty-governed AI question quarantine.
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('courses')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Explore Curriculum</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onEnterPortal}
              className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#141A28] text-gray-700 dark:text-gray-300 font-bold text-xs active:scale-95 transition-all cursor-pointer"
            >
              Access Portal
            </button>
          </div>
        </div>

        {/* 3D Modular Monolith Canvas */}
        <div className="lg:col-span-5 relative w-full h-[320px] sm:h-[380px] rounded-3xl bg-gradient-to-br from-indigo-500/5 via-emerald-500/5 to-cyan-500/5 border border-indigo-200/50 dark:border-indigo-900/40 p-2 shadow-xl flex items-center justify-center overflow-hidden">
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/80 dark:bg-[#0E131F]/80 backdrop-blur-md border border-gray-200/60 dark:border-gray-800 text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Three.js 3D Architecture Knot</span>
          </div>
          <ThreeArchitectureCanvas className="w-full h-full" />
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE ARCHITECTURE EXPLORER (OPTION B MODULAR MONOLITH)
          ========================================================================= */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Option B Modular Monolith Architecture
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            FastAPI single-process engine with PostgreSQL 17 persistence and React 19 client.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('bkt')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'bkt'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-[#151B28] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Bayesian Knowledge Tracing</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dag')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'dag'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-[#151B28] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <GitMerge className="w-4 h-4" />
            <span>DAG Prerequisite Topology</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quarantine')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'quarantine'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-[#151B28] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>SSD-08 Faculty Quarantine</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('outbox')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'outbox'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-[#151B28] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Durable Transactional Outbox</span>
          </button>
        </div>

        {/* Tab Content Cards - Minimal Text & Punchy Visuals */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121724] border border-gray-200/90 dark:border-gray-800 shadow-sm">
          {activeTab === 'bkt' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Probabilistic Latent State Modeling
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  Four statistically validated parameters update after every answer observation:
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#182030] border border-gray-200/70 dark:border-gray-800">
                    <span className="text-gray-400 block text-[10px]">P(L_0) Prior</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs">20% baseline</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#182030] border border-gray-200/70 dark:border-gray-800">
                    <span className="text-gray-400 block text-[10px]">P(T) Transit</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">15% rate</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#182030] border border-gray-200/70 dark:border-gray-800">
                    <span className="text-gray-400 block text-[10px]">P(S) Slip</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 text-xs">10% careless</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#182030] border border-gray-200/70 dark:border-gray-800">
                    <span className="text-gray-400 block text-[10px]">P(G) Guess</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400 text-xs">20% guess</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 p-4 rounded-2xl bg-gray-50 dark:bg-[#182030] border border-gray-200 dark:border-gray-800 space-y-2 font-mono text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                  Bayes Posterior Update Formula
                </span>
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#111520] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 text-[11px]">
                  P(L_n | obs) = (P(L)·(1-P(S))) / [P(L)·(1-P(S)) + (1-P(L))·P(G)]
                </div>
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#111520] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 text-[11px]">
                  P(L_n) = P(L_n | obs) + (1 - P(L_n | obs))·P(T)
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dag' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Cycle-Free Directed Acyclic Graph Engine
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  Curriculum units form a verified graph with Depth-First Search cycle prevention:
                </p>

                <div className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Topological sort generates verified sequential learning paths</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Prerequisite guards prevent circular and self-dependencies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Depth-First Search (DFS) validation runs on every syllabus edit</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 p-4 rounded-2xl bg-gray-50 dark:bg-[#182030] border border-gray-200 dark:border-gray-800 space-y-2 font-mono text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                  DFS Cycle Prevention
                </span>
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#111520] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 text-[11px] space-y-0.5">
                  <p>def detect_cycle(graph, node, visited, rec_stack):</p>
                  <p className="pl-3">visited.add(node); rec_stack.add(node)</p>
                  <p className="pl-3">for nb in graph[node]: if nb in rec_stack: return True</p>
                  <p className="pl-3">rec_stack.remove(node); return False</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quarantine' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Teacher Governance &amp; SSD-08 Quarantine
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  AI questions are strictly quarantined in staging tables until approved by verified faculty.
                </p>

                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200">
                  <span className="font-bold">Atomic Row-Level Promotion: </span>
                  <span>Locks record with SELECT FOR UPDATE, writes Question Bank, and updates status in 1 ACID transaction.</span>
                </div>
              </div>

              <div className="lg:col-span-5 p-4 rounded-2xl bg-gray-50 dark:bg-[#182030] border border-gray-200 dark:border-gray-800 space-y-2 font-mono text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                  Quarantine Invariants
                </span>
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#111520] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 space-y-1 text-[11px]">
                  <p>✓ Status defaults to &quot;pending_review&quot;</p>
                  <p>✓ Zero query paths from student API to quarantine</p>
                  <p>✓ Immutable audit events logged with correlation IDs</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'outbox' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  In-Process Durable Outbox Processor
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  FastAPI lifespan worker delivers asynchronous gamification and mastery events with guaranteed at-least-once delivery.
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#182030] border border-gray-200/70 dark:border-gray-800">
                    <span className="text-gray-400 block text-[10px]">Advisory Lock</span>
                    <span className="font-bold text-gray-900 dark:text-white text-xs">PostgreSQL Concurrency</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#182030] border border-gray-200/70 dark:border-gray-800">
                    <span className="text-gray-400 block text-[10px]">Retry Queue</span>
                    <span className="font-bold text-gray-900 dark:text-white text-xs">Exponential Backoff</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 p-4 rounded-2xl bg-gray-50 dark:bg-[#182030] border border-gray-200 dark:border-gray-800 space-y-2 font-mono text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                  Outbox Entity Schema
                </span>
                <div className="p-2.5 rounded-lg bg-white dark:bg-[#111520] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 space-y-1 text-[11px]">
                  <p>table: domain_outbox_events</p>
                  <p>columns: id, event_type, payload, status</p>
                  <p>index: [status, next_retry_at]</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          FACULTY GOVERNANCE & ACADEMIC DIRECTORS
          ========================================================================= */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Academic Governance &amp; Faculty Leadership
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Curriculum oversight by university researchers and educators.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121724] border border-gray-200 dark:border-gray-800 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
              ER
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">Dr. Elena Rostova</h4>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Dean of Computer Science</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">PhD MIT · BKT &amp; CS Pedagogy</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#121724] border border-gray-200 dark:border-gray-800 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
              AT
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">Prof. Alan Turing</h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Chair of Applied Mathematics</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Cambridge DPhil · Graph Theory</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#121724] border border-gray-200 dark:border-gray-800 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
              AL
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">Dr. Ada Lovelace</h4>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Systems Architecture</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Oxford ScD · ML Optimization</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#121724] border border-gray-200 dark:border-gray-800 shadow-2xs space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-xs shadow-sm">
              SC
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">Sarah Connor</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Governance &amp; Security</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">MSc Stanford · RBAC Security</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
