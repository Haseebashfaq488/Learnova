import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Brain,
  ShieldCheck,
  Award,
  Zap,
  CheckCircle,
  Sparkles,
  Lock,
  ChevronRight,
  Activity,
} from 'lucide-react';
import { Course, Topic, Lesson, Enrollment, UserAccount } from '../../types';
import { UserResponse } from '../../services/api/authApi';
import { CourseCarousel } from '../../components/public/CourseCarousel';
import { BKTSimulator } from '../../components/public/BKTSimulator';
import { DAGVisualizer } from '../../components/public/DAGVisualizer';
import { ThreeHeroCanvas } from '../../components/public/ThreeHeroCanvas';
import { PublicNavigationPage } from '../../services/routerService';

export type LandingSessionUser =
  | UserResponse
  | UserAccount
  | { name?: string; full_name?: string; email: string; role: string; [key: string]: any };

interface LandingPageProps {
  courses: Course[];
  topics: Topic[];
  lessons: Lesson[];
  enrollments?: Enrollment[];
  currentUser?: LandingSessionUser | null;
  onNavigate: (page: PublicNavigationPage, params?: Record<string, string>) => void;
  onEnterPortal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  courses,
  topics,
  lessons,
  enrollments = [],
  currentUser,
  onNavigate,
  onEnterPortal,
}) => {
  return (
    <div className="w-full space-y-16 sm:space-y-24 py-4 sm:py-8">
      {/* =========================================================================
          HERO SECTION WITH THREE.JS 3D KNOWLEDGE CONSTELLATION
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Minimal Punchy Typography & Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Live Telemetry Status Strip */}
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

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-950 dark:text-white leading-[1.1]">
              Where Cognitive Science Meets Computational Mastery.
            </h1>

            {/* Subtitle - Ultra Concise (< 80ch) */}
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl leading-relaxed">
              Bayesian Knowledge Tracing and Directed Acyclic Graphs engineered for rigorous computer science education.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('courses')}
                className="group flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-98 transition-all cursor-pointer"
              >
                <span>Explore Curriculum</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onEnterPortal}
                className="flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#141A28] hover:bg-gray-50 dark:hover:bg-[#1A2234] text-gray-800 dark:text-gray-200 font-bold text-xs sm:text-sm shadow-2xs hover:shadow-sm active:scale-98 transition-all cursor-pointer"
              >
                <span>{currentUser ? 'Open Workspace' : 'Access Portal'}</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Right Column: Three.js Interactive 3D Canvas */}
          <div className="lg:col-span-5 relative w-full h-[360px] sm:h-[440px] rounded-3xl bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-cyan-500/5 border border-indigo-200/50 dark:border-indigo-900/40 p-2 shadow-xl flex items-center justify-center overflow-hidden">
            {/* Visual Header Pill inside 3D canvas viewport */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/80 dark:bg-[#0E131F]/80 backdrop-blur-md border border-gray-200/60 dark:border-gray-800 text-[11px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span>Three.js 3D Knowledge Network</span>
            </div>

            <ThreeHeroCanvas className="w-full h-full" />
          </div>
        </div>

        {/* Live Interactive Hero Sandbox: BKT Engine */}
        <div className="mt-12 sm:mt-16">
          <BKTSimulator />
        </div>
      </section>

      {/* =========================================================================
          COURSES CAROUSEL SECTION (3 CARDS PER GRID ROW ON DESKTOP)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CourseCarousel
          courses={courses}
          topics={topics}
          lessons={lessons}
          enrollments={enrollments}
          onSelectCourse={(courseId) => onNavigate('course_details', { courseId })}
        />
      </section>

      {/* =========================================================================
          DAG PREREQUISITE TOPOLOGY (Cycle-Free)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white">
            Prerequisite Graph Topology
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Directed Acyclic Graphs with depth-first search cycle prevention.
          </p>
        </div>

        <DAGVisualizer topics={topics} lessons={lessons} />
      </section>

      {/* =========================================================================
          TEACHER-GOVERNED AI QUARANTINE (SSD-08)
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-10 rounded-3xl bg-indigo-950 text-white shadow-2xl relative overflow-hidden border border-indigo-800/80">
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/80 border border-indigo-700/80 text-xs font-mono font-semibold text-indigo-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SSD-08 Faculty Quarantine Protocol</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-white">
                  Quarantined AI Question Pipeline
                </h2>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-indigo-50 shadow-sm transition-all self-start sm:self-auto cursor-pointer"
              >
                <span>Architecture</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Pipeline Visual Cards (Minimal Words) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-indigo-900/50 border border-indigo-700/60 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-mono font-bold text-white">01. LLM Generation</span>
                </div>
                <p className="text-[11px] text-indigo-200/80">
                  Fingerprinted prompt cache against lesson source documents.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-900/50 border border-amber-500/50 space-y-2">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-amber-300">02. Segregated Quarantine</span>
                </div>
                <p className="text-[11px] text-indigo-200/80">
                  Excluded from student assessments pending faculty audit.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-900/50 border border-emerald-500/50 space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-emerald-300">03. Atomic Promotion</span>
                </div>
                <p className="text-[11px] text-indigo-200/80">
                  Row-level locked commit to official institutional question bank.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FACULTY & INSTITUTIONAL DIRECTORS
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900 dark:text-white">
            Faculty Leadership
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Academic oversight across computer science curriculums.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121724] border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
              ER
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">Dr. Elena Rostova</h4>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Faculty Dean</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Computer Science</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#121724] border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
              AT
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">Prof. Alan Turing</h4>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Program Chair</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Algorithms &amp; Complexity</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#121724] border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
              AL
            </div>
            <div>
              <h4 className="font-bold text-sm text-gray-900 dark:text-white">Dr. Ada Lovelace</h4>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Research Director</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Machine Learning</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          FINAL VISUAL CTA
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-gray-900 dark:bg-[#121724] border border-gray-800 text-center space-y-4 shadow-xl">
          <h2 className="text-xl sm:text-3xl font-black text-white">
            Start Your Computational Mastery
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
            Enroll in self-paced canonical sequences or access the student learning map.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onEnterPortal}
              className="flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 active:scale-95 transition-all cursor-pointer"
            >
              <span>{currentUser ? 'Go to Student Dashboard' : 'Enter Student Portal'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl border border-gray-700 bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-xs active:scale-95 transition-all cursor-pointer"
            >
              <span>Contact Campus</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
