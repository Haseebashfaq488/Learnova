import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Brain,
  ShieldCheck,
  GitMerge,
  Award,
  Zap,
  CheckCircle,
  Clock,
  Sparkles,
  Lock,
  ChevronRight,
  Database,
  Terminal,
  Activity,
} from 'lucide-react';
import { Course, Topic, Lesson } from '../../types';
import { CourseCarousel } from '../../components/public/CourseCarousel';
import { BKTSimulator } from '../../components/public/BKTSimulator';
import { DAGVisualizer } from '../../components/public/DAGVisualizer';
import { PublicNavigationPage } from '../../services/routerService';

interface LandingPageProps {
  courses: Course[];
  topics: Topic[];
  lessons: Lesson[];
  onNavigate: (page: PublicNavigationPage, params?: Record<string, string>) => void;
  onEnterPortal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  courses,
  topics,
  lessons,
  onNavigate,
  onEnterPortal,
}) => {
  return (
    <div className="w-full space-y-20 sm:space-y-28 py-6 sm:py-10">
      {/* =========================================================================
          HERO BANNER & BKT SIMULATOR
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6 pt-4 pb-10">
          {/* Telemetry Status Strip */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#131826] border border-gray-200 dark:border-gray-800 shadow-2xs text-xs text-gray-600 dark:text-gray-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">Learnova Engine v2.4</span>
            <span className="text-gray-300 dark:text-gray-700">·</span>
            <span className="font-mono text-gray-500 dark:text-gray-400">REST API 18ms</span>
            <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">·</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 hidden sm:inline">99.99% Availability</span>
          </div>

          {/* Primary Headline (High Craft: No gradient text, disciplined tracking) */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-950 dark:text-white leading-[1.12]">
            Where Cognitive Science Meets Computational Mastery.
          </h1>

          {/* Subtitle (< 80ch measure) */}
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Learnova integrates Bayesian Knowledge Tracing, directed prerequisite graphs,
            and faculty-governed AI question generation to deliver university-grade computer
            science education.
          </p>

          {/* Professional Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('courses')}
              className="w-full sm:w-auto group flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold text-sm shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-98 transition-all cursor-pointer"
            >
              <span>Explore Curriculum Sequences</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              type="button"
              onClick={onEnterPortal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#141A28] hover:bg-gray-50 dark:hover:bg-[#1A2234] text-gray-800 dark:text-gray-200 font-bold text-sm shadow-2xs hover:shadow-sm active:scale-98 transition-all cursor-pointer"
            >
              <span>Access Learner Portal</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Live Interactive Hero Sandbox: BKT Engine */}
        <div className="mt-8">
          <BKTSimulator />
        </div>
      </section>

      {/* =========================================================================
          COURSES CAROUSEL SECTION
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CourseCarousel
          courses={courses}
          topics={topics}
          lessons={lessons}
          onSelectCourse={(courseId) => onNavigate('course_details', { courseId })}
        />
      </section>

      {/* =========================================================================
          ASYMMETRIC SECTION 1: DAG PREREQUISITE TOPOLOGY
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Prerequisite graphs that guarantee mathematical mastery.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
            No learner advances to functions without proving mastery in syntax and control logic.
            Learnova verifies curriculum topology as a Directed Acyclic Graph with cycle prevention.
          </p>
        </div>

        <DAGVisualizer topics={topics} lessons={lessons} />
      </section>

      {/* =========================================================================
          ASYMMETRIC SECTION 2: TEACHER-GOVERNED AI QUARANTINE (SSD-08)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-indigo-900 text-white shadow-2xl relative overflow-hidden">
          {/* Subtle geometric background accent */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-indigo-800/40 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/80 border border-indigo-700/80 text-xs font-mono font-semibold text-indigo-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SSD-08 Faculty Quarantine Protocol</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
                AI question generation quarantined under faculty authority.
              </h2>

              <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
                Generative AI crafts multi-format diagnostic items, but zero unverified questions
                ever reach a student. Every candidate enters strict quarantine until reviewed, modified,
                and approved by assigned professors.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 shadow-sm transition-all cursor-pointer"
                >
                  <span>Read Governance Architecture</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quarantine Pipeline Architecture Cards */}
            <div className="lg:col-span-6 space-y-3 font-mono text-xs">
              <div className="p-4 rounded-xl bg-indigo-950/80 border border-indigo-700/60 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-indigo-800 text-indigo-200 shrink-0">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <span className="font-bold text-white block">Step 1: LLM Candidate Generation</span>
                  <span className="text-indigo-200/80 text-[11px] block mt-0.5">
                    Scoped strictly to lesson resources with SHA-256 fingerprint caching.
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/80 border border-amber-500/50 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-300 shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-amber-200 block">Step 2: Quarantined State (status: pending_review)</span>
                  <span className="text-indigo-200/80 text-[11px] block mt-0.5">
                    Segregated in candidates table; excluded from all live student assessments.
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-indigo-950/80 border border-emerald-500/50 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-emerald-200 block">Step 3: Faculty Atomic Promotion</span>
                  <span className="text-indigo-200/80 text-[11px] block mt-0.5">
                    Row-level lock (with_for_update), audit log entry, and official Question Bank publish.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ASYMMETRIC SECTION 3: GAMIFICATION & VERIFIED COMPETENCE
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Gamification grounded in empirical learning science.
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              Experience points, tiered badges, and cognitive streak mechanics motivate continuous
              deliberate practice without frivolous distractions.
            </p>

            <ul className="space-y-2.5 text-xs font-medium text-gray-700 dark:text-gray-300">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Immutable XP transaction ledger with event sourcing audit</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Cognitive fatigue protection &amp; daily streak multipliers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Privacy-preserving academic leaderboards with avatar anonymization</span>
              </li>
            </ul>
          </div>

          {/* Gamification Interactive Showcase Cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#131826] border border-gray-200 dark:border-gray-800 shadow-sm interactive-card">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black font-mono text-gray-900 dark:text-white block">
                5 Days
              </span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block mt-1">
                Active Streak
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 block">
                1.2x XP multiplier awarded for consistent daily study.
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#131826] border border-gray-200 dark:border-gray-800 shadow-sm interactive-card">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black font-mono text-gray-900 dark:text-white block">
                Level 4
              </span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block mt-1">
                DAG Navigator
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 block">
                Awarded upon traversing 5 prerequisite sequences.
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#131826] border border-gray-200 dark:border-gray-800 shadow-sm interactive-card">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mb-3">
                <Activity className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black font-mono text-gray-900 dark:text-white block">
                +150 XP
              </span>
              <span className="text-xs font-bold text-gray-800 dark:text-gray-200 block mt-1">
                Mastery Bonus
              </span>
              <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 block">
                Written synchronously to transactional outbox.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FACULTY & INSTITUTIONAL LEADERSHIP
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Curriculum directed by university faculty.
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Every course syllabus, question rationale, and mastery rubric is authored and monitored by educators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#121724] border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                ER
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Dr. Elena Rostova</h4>
                <p className="text-xs text-indigo-600 dark:text-indigo-400">Faculty of Computer Science</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              &ldquo;Bayesian Knowledge Tracing eliminates superficial test prep. Students must demonstrate
              true latent cognitive mastery before unlocking complex algorithmic concepts.&rdquo;
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#121724] border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                AT
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Prof. Alan Turing</h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400">Applied Mathematics &amp; Algorithms</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              &ldquo;Structuring curriculum as a Directed Acyclic Graph mirrors the logical structure of
              mathematics itself. There are no shortcuts in computational thinking.&rdquo;
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#121724] border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                AL
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white">Dr. Ada Lovelace</h4>
                <p className="text-xs text-purple-600 dark:text-purple-400">Software Architecture &amp; ML</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              &ldquo;Learnova proves that AI assistance in higher education works best when faculty
              maintain absolute editorial quarantine and governance over questions.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL CALL TO ACTION BANNER
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gray-900 dark:bg-[#121724] border border-gray-800 text-center space-y-6 shadow-2xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
            Ready to experience rigorous, adaptive computational mastery?
          </h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
            Enroll in our canonical computer science sequences or access the student learning map.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onEnterPortal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 active:scale-95 transition-all cursor-pointer"
            >
              <span>Access Student Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-sm active:scale-95 transition-all cursor-pointer"
            >
              <span>Institutional Partnerships</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
