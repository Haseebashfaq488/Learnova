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
  Terminal,
  Activity,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { PublicNavigationPage } from '../../services/routerService';

interface AboutPageProps {
  onNavigate: (page: PublicNavigationPage, params?: Record<string, string>) => void;
  onEnterPortal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onEnterPortal }) => {
  const [activeTab, setActiveTab] = useState<'bkt' | 'dag' | 'quarantine' | 'outbox'>('bkt');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16 sm:space-y-24">
      {/* =========================================================================
          HERO & MISSION STATEMENT
          ========================================================================= */}
      <section className="max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-xs font-mono font-bold text-indigo-700 dark:text-indigo-300">
          <Cpu className="w-3.5 h-3.5" />
          <span>Learnova Architectural Manifesto</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
          Competency-based education demands mathematical proof, not completion checkboxes.
        </h1>

        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Modern higher education has been degraded by superficial video-completion metrics.
          Learnova replaces passive watching with Bayesian Knowledge Tracing, directed acyclic
          prerequisite graphs, and faculty-governed AI question generation.
        </p>
      </section>

      {/* =========================================================================
          INTERACTIVE ARCHITECTURE EXPLORER (OPTION B MODULAR MONOLITH)
          ========================================================================= */}
      <section className="space-y-8">
        <div className="max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Option B Modular Monolith Architecture
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
            A high-performance, single-process FastAPI engine with an in-process durable outbox
            processor, PostgreSQL 17 relational persistence, and a React 19 client.
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

        {/* Tab Content Cards */}
        <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#121724] border border-gray-200/90 dark:border-gray-800 shadow-sm">
          {activeTab === 'bkt' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Probabilistic Latent State Modeling
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Instead of assuming a correct answer proves mastery or an incorrect answer proves
                  ignorance, Bayesian Knowledge Tracing models latent cognitive states with four
                  statistically validated parameters:
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2">
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#182030] border border-gray-200/70 dark:border-gray-800">
                    <span className="text-gray-400 block text-[10px]">P(L_0) Prior Knowledge</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">20% baseline</span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#182030] border border-gray-200/70 dark:border-gray-800">
                    <span className="text-gray-400 block text-[10px]">P(T) Transit Rate</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">15% per attempt</span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#182030] border border-gray-200/70 dark:border-gray-800">
                    <span className="text-gray-400 block text-[10px]">P(S) Slip Probability</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">10% careless error</span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#182030] border border-gray-200/70 dark:border-gray-800">
                    <span className="text-gray-400 block text-[10px]">P(G) Guess Probability</span>
                    <span className="font-bold text-purple-600 dark:text-purple-400 text-sm">20% lucky guess</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 p-5 rounded-2xl bg-gray-50 dark:bg-[#182030] border border-gray-200 dark:border-gray-800 space-y-3 font-mono text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                  Bayes Posterior Update Formula
                </span>
                <div className="p-3 rounded-lg bg-white dark:bg-[#111520] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200">
                  P(L_n | obs) = (P(L) · (1 - P(S))) / [P(L) · (1 - P(S)) + (1 - P(L)) · P(G)]
                </div>
                <div className="p-3 rounded-lg bg-white dark:bg-[#111520] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200">
                  P(L_n) = P(L_n | obs) + (1 - P(L_n | obs)) · P(T)
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dag' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Cycle-Free Directed Acyclic Graph Engine
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Academic curriculum is verified as a directed graph where nodes represent conceptual
                  units and edges represent prerequisites. Depth-First Search (DFS) algorithms run on
                  every syllabus edit to detect and prevent circular dependencies before persistence.
                </p>

                <ul className="space-y-2 text-xs text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Topological sort generates optimal individual learning paths</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Prerequisite validation prevents accidental self-dependencies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Transitive cycle prevention across multi-course dependencies</span>
                  </li>
                </ul>
              </div>

              <div className="lg:col-span-5 p-5 rounded-2xl bg-gray-50 dark:bg-[#182030] border border-gray-200 dark:border-gray-800 space-y-3 font-mono text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                  DFS Cycle Prevention Algorithm
                </span>
                <div className="p-3 rounded-lg bg-white dark:bg-[#111520] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 space-y-1 text-[11px]">
                  <p>def detect_cycle(graph, node, visited, rec_stack):</p>
                  <p className="pl-4">visited.add(node)</p>
                  <p className="pl-4">rec_stack.add(node)</p>
                  <p className="pl-4">for neighbor in graph[node]:</p>
                  <p className="pl-8">if neighbor not in visited and detect_cycle(...): return True</p>
                  <p className="pl-8">elif neighbor in rec_stack: return True</p>
                  <p className="pl-4">rec_stack.remove(node); return False</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'quarantine' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Teacher Governance &amp; SSD-08 Quarantine
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Generative models are outstanding at proposing creative distractors, but prone to subtle
                  factual hallucinations. Learnova enforces a strict cryptographic quarantine: AI candidates
                  are saved in a staging table with status &ldquo;pending_review&rdquo; and can never be
                  presented to learners without human faculty approval.
                </p>

                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
                  <span className="font-bold block">Atomic Row-Level Promotion:</span>
                  <p>
                    When a professor clicks &ldquo;Approve Candidate&rdquo;, the backend locks the row with
                    SELECT ... FOR UPDATE, writes the immutable Question Bank record, links the audit log,
                    and updates candidate status in one atomic ACID database transaction.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-5 p-5 rounded-2xl bg-gray-50 dark:bg-[#182030] border border-gray-200 dark:border-gray-800 space-y-3 font-mono text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                  Quarantine Security Invariants
                </span>
                <div className="p-3 rounded-lg bg-white dark:bg-[#111520] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 space-y-2 text-[11px]">
                  <p>✓ ai_question_candidates.status == &quot;pending_review&quot;</p>
                  <p>✓ Zero query paths from Student API to candidates table</p>
                  <p>✓ Answer keys stripped from all client payloads</p>
                  <p>✓ Immutable audit events logged with correlation IDs</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'outbox' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  In-Process Durable Outbox Processor
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  To eliminate standalone broker complexity, Learnova implements an in-process
                  transactional outbox processor inside the FastAPI application lifespan. Asynchronous
                  gamification events, streak recalibrations, and mastery audits are guaranteed at-least-once
                  delivery using PostgreSQL advisory locks.
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-2">
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#182030] border border-gray-200/70 dark:border-gray-800">
                    <span className="text-gray-400 block text-[10px]">Advisory Lock</span>
                    <span className="font-bold text-gray-900 dark:text-white text-xs">Multi-worker concurrency</span>
                  </div>
                  <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#182030] border border-gray-200/70 dark:border-gray-800">
                    <span className="text-gray-400 block text-[10px]">Backoff Strategy</span>
                    <span className="font-bold text-gray-900 dark:text-white text-xs">Exponential retry queue</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 p-5 rounded-2xl bg-gray-50 dark:bg-[#182030] border border-gray-200 dark:border-gray-800 space-y-3 font-mono text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                  Outbox Event Entity Topology
                </span>
                <div className="p-3 rounded-lg bg-white dark:bg-[#111520] border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 space-y-1.5 text-[11px]">
                  <p>table: domain_outbox_events</p>
                  <p>columns: id, event_type, payload, status,</p>
                  <p className="pl-8">retry_count, next_retry_at, correlation_id</p>
                  <p>indexes: [status, next_retry_at]</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          FACULTY GOVERNANCE & ACADEMIC DIRECTORS
          ========================================================================= */}
      <section className="space-y-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Academic Governance &amp; Faculty Leadership
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Learnova is built by educators, computer scientists, and cognitive psychologists.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121724] border border-gray-200 dark:border-gray-800 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              ER
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">Dr. Elena Rostova</h4>
              <p className="text-xs text-indigo-600 dark:text-indigo-400">Dean of Computer Science</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                PhD MIT. Specializes in introductory computational thinking, Python paradigms, and BKT.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#121724] border border-gray-200 dark:border-gray-800 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              AT
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">Prof. Alan Turing</h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">Chair of Applied Mathematics</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                Cambridge DPhil. Computational complexity, algorithmic graph theory, and Big-O verification.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#121724] border border-gray-200 dark:border-gray-800 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              AL
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">Dr. Ada Lovelace</h4>
              <p className="text-xs text-purple-600 dark:text-purple-400">Director of Systems Architecture</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                Oxford ScD. Machine learning foundations, neural optimization, and gradient descent.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#121724] border border-gray-200 dark:border-gray-800 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              SC
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">Sarah Connor</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">Governance &amp; Security Director</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                MSc Stanford. RBAC security enforcement, FERPA/GDPR compliance, and cryptographic audit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          GLOBAL CTA STRIP
          ========================================================================= */}
      <section className="p-8 sm:p-12 rounded-3xl bg-indigo-900 text-white text-center space-y-5 shadow-xl">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight max-w-xl mx-auto">
          Explore the canonical curriculum or discuss academic integration.
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('courses')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 transition-all cursor-pointer"
          >
            Explore Courses
          </button>
          <button
            type="button"
            onClick={() => onNavigate('contact')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-indigo-400/60 text-white font-bold text-xs hover:bg-indigo-800/60 transition-all cursor-pointer"
          >
            Contact Campus Operations
          </button>
        </div>
      </section>
    </div>
  );
};
