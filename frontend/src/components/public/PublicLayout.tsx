import React, { useState, useEffect } from 'react';
import { PublicHeader } from './PublicHeader';
import { SearchModal, SearchResultItem } from './SearchModal';
import { DesignStudioWidget } from '../ui/DesignStudioWidget';
import { AppFooter } from '../ui/AppFooter';
import { PublicNavigationPage } from '../../services/routerService';
import { Course, Topic } from '../../types';
import { UserResponse } from '../../services/api/authApi';
import {
  Cpu,
  GraduationCap,
  ShieldCheck,
  GitBranch,
  Mail,
  MapPin,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface PublicLayoutProps {
  currentPage: PublicNavigationPage;
  onNavigate: (page: PublicNavigationPage, params?: Record<string, string>) => void;
  onEnterPortal: () => void;
  courses: Course[];
  topics: Topic[];
  currentUser?: UserResponse | null;
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({
  currentPage,
  onNavigate,
  onEnterPortal,
  courses,
  topics,
  currentUser,
  children,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [designStudioOpen, setDesignStudioOpen] = useState(false);

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectSearchResult = (item: SearchResultItem) => {
    setSearchOpen(false);
    if (item.targetPage === 'course_details' && item.courseId) {
      onNavigate('course_details', { courseId: item.courseId });
    } else if (item.targetPage === 'courses') {
      onNavigate('courses');
    } else if (item.targetPage === 'about') {
      onNavigate('about');
    } else {
      onNavigate('landing');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F19] text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Sticky Header */}
      <PublicHeader
        currentPage={currentPage}
        onNavigate={onNavigate}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenDesignStudio={() => setDesignStudioOpen(true)}
        onEnterPortal={onEnterPortal}
        currentUser={currentUser}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">{children}</main>

      {/* Rich Academic Footer */}
      <footer className="w-full bg-white dark:bg-[#0E131F] border-t border-gray-200 dark:border-gray-800 pt-12 pb-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                  Learnova
                </span>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                  INSTITUTE
                </span>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed max-w-sm">
                Enterprise-grade adaptive educational platform merging Bayesian Knowledge Tracing,
                directed acyclic prerequisite trees, server-authoritative grading, and faculty-governed
                AI question generation.
              </p>

              <div className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>All Core Systems Operational · 99.99% Availability</span>
              </div>
            </div>

            {/* Curriculum Column */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white block">
                Curriculum
              </span>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('courses')}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    All Sequences &amp; Courses
                  </button>
                </li>
                {courses.slice(0, 3).map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate('course_details', { courseId: c.id })}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate max-w-[180px] text-left"
                    >
                      {c.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Architecture & Science Column */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white block">
                Cognitive Science
              </span>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('about')}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                  >
                    Bayesian Knowledge Tracing
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('about')}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                  >
                    DAG Prerequisite Topology
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('about')}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                  >
                    SSD-08 Teacher AI Governance
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('about')}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                  >
                    Transactional Outbox Engine
                  </button>
                </li>
              </ul>
            </div>

            {/* Institutional Operations Column */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white block">
                Campus &amp; Legal
              </span>
              <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('contact')}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                  >
                    Institutional Partnerships
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('contact')}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                  >
                    System Health &amp; Telemetry
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onEnterPortal()}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400"
                  >
                    <span>Academic Portals</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </li>
                <li className="pt-1 text-[11px] text-gray-400 dark:text-gray-500">
                  FERPA &amp; GDPR Compliant
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Design Studio strip */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Learnova Academic Platform. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setDesignStudioOpen(true)}
                className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Theme Factory Studio</span>
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Security &amp; Vulnerability Disclosure
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Global Modals & Drawers */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        courses={courses}
        topics={topics}
        onSelectResult={handleSelectSearchResult}
      />

      <DesignStudioWidget
        isOpen={designStudioOpen}
        onClose={() => setDesignStudioOpen(false)}
        showFloatingTrigger={false}
      />
    </div>
  );
};
