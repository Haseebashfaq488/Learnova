import React, { useState } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  ListChecks,
  Sparkles,
  ClipboardCheck,
  BarChart3,
  Menu,
  X,
  LogOut,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Palette,
  Sun,
  Moon,
  ChevronRight,
} from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { DesignStudioWidget } from '../ui/DesignStudioWidget';
import { AppFooter } from '../ui/AppFooter';
import { useTheme } from '../../context/ThemeContext';

export type NavigationPage =
  | 'overview'
  | 'courses'
  | 'course_overview'
  | 'curriculum'
  | 'prerequisites'
  | 'resources'
  | 'questions'
  | 'question_editor'
  | 'ai_review'
  | 'assessments'
  | 'assessment_editor'
  | 'analytics';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface BreadcrumbItem {
  label: string;
  page?: NavigationPage;
  params?: Record<string, string>;
}

interface TeacherLayoutProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage, params?: Record<string, string>) => void;
  selectedCourseId?: string;
  selectedCourseTitle?: string;
  teacherUser?: { name: string; email: string; department?: string };
  onSignOut?: () => void;
  onSwitchPortal?: (portal: 'student' | 'admin' | 'public') => void;
  onSwitchToPublic?: () => void;
  breadcrumbs?: BreadcrumbItem[];
  toasts: ToastMessage[];
  onDismissToast: (id: string) => void;
  children?: React.ReactNode;
}

export const TeacherLayout: React.FC<TeacherLayoutProps> = ({
  currentPage,
  onNavigate,
  selectedCourseId,
  selectedCourseTitle,
  teacherUser,
  onSignOut,
  breadcrumbs = [],
  toasts,
  onDismissToast,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [designStudioOpen, setDesignStudioOpen] = useState(false);
  const { actualTheme, setTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const navItems = [
    {
      id: 'overview' as NavigationPage,
      label: 'Overview',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
      activeMatches: ['overview'],
    },
    {
      id: 'courses' as NavigationPage,
      label: 'Courses',
      icon: <BookOpen className="w-4 h-4 shrink-0" />,
      activeMatches: ['courses', 'course_overview', 'curriculum', 'prerequisites', 'resources'],
    },
    {
      id: 'questions' as NavigationPage,
      label: 'Question Bank',
      icon: <ListChecks className="w-4 h-4 shrink-0" />,
      activeMatches: ['questions', 'question_editor'],
    },
    {
      id: 'ai_review' as NavigationPage,
      label: 'AI Review',
      icon: <Sparkles className="w-4 h-4 shrink-0" />,
      activeMatches: ['ai_review'],
      badge: 'Review',
    },
    {
      id: 'assessments' as NavigationPage,
      label: 'Assessments',
      icon: <ClipboardCheck className="w-4 h-4 shrink-0" />,
      activeMatches: ['assessments', 'assessment_editor'],
    },
    {
      id: 'analytics' as NavigationPage,
      label: 'Analytics',
      icon: <BarChart3 className="w-4 h-4 shrink-0" />,
      activeMatches: ['analytics'],
    },
  ];

  const handleNavClick = (page: NavigationPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0F1218] text-[#1F2937] dark:text-[#F3F4F6] flex flex-col font-sans">
      {/* Toast Notification Stack */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl border shadow-md text-sm animate-in slide-in-from-top duration-150 ${
              t.type === 'success'
                ? 'bg-[#EAF7F0] text-[#18794E] border-[#18794E]/30'
                : t.type === 'error'
                ? 'bg-[#FEF0EF] text-[#B42318] border-[#B42318]/30'
                : 'bg-[#EFF8FF] text-[#175CD3] border-[#175CD3]/30'
            }`}
          >
            <div className="flex items-center gap-2">
              {t.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span className="font-medium">{t.message}</span>
            </div>
            <button
              onClick={() => onDismissToast(t.id)}
              className="text-current opacity-70 hover:opacity-100 p-0.5 cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Global Sticky Top Navigation Bar (Header-Only Routing) */}
      <header className="h-[72px] frosted-header px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 border-b border-[#D9DEE7] dark:border-[#2D3545]">
        <div className="flex items-center gap-4 lg:gap-8 min-w-0">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg text-[#5B6472] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer shrink-0"
            aria-label="Open mobile navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand Header with Official Logo */}
          <div
            onClick={() => onNavigate('overview')}
            className="flex items-center gap-3 shrink-0 cursor-pointer group"
          >
            <img
              src="/learnova-logo.png"
              alt="Learnova"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-base tracking-tight text-[#1F2937] dark:text-white leading-none">
                Learnova
              </span>
              <span className="text-[10px] font-bold text-[#3156D3] dark:text-indigo-400 uppercase tracking-wider mt-0.5">
                Teacher Portal
              </span>
            </div>
          </div>

          {/* Desktop Top Header Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5" aria-label="Faculty Navigation">
            {navItems.map((item) => {
              const isActive = item.activeMatches.includes(currentPage);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#E8EEFF] dark:bg-indigo-950/60 text-[#2646B8] dark:text-indigo-300 font-bold shadow-2xs'
                      : 'text-[#5B6472] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#1F2937] dark:hover:text-white'
                  }`}
                >
                  <span className={isActive ? 'text-[#2646B8] dark:text-indigo-300' : 'text-[#5B6472] dark:text-gray-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-bold bg-[#FFF5D6] text-[#946200] px-1.5 py-0.2 rounded border border-[#946200]/20 ml-0.5">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Header Controls Dock */}
        <div className="flex items-center gap-3">
          {/* Breadcrumb Path Tree (Faculty Workspace Context) */}
          {breadcrumbs.length > 0 && (
            <nav className="hidden xl:flex items-center text-xs text-gray-500 dark:text-gray-400 mr-2 max-w-xs truncate" aria-label="Breadcrumb">
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <ChevronRight className="w-3 h-3 mx-1 text-gray-400 shrink-0" />}
                  {crumb.page ? (
                    <button
                      type="button"
                      onClick={() => onNavigate(crumb.page!, crumb.params)}
                      className="hover:text-[#3156D3] dark:hover:text-indigo-400 truncate transition cursor-pointer font-medium"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="font-semibold text-gray-900 dark:text-white truncate">
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}

          {/* Consolidated Header Command Dock */}
          <div className="command-dock">
            {/* 1-Click Appearance Mode Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-800 transition cursor-pointer"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title="Toggle appearance mode"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            <button
              type="button"
              data-design-studio-trigger="true"
              onClick={() => setDesignStudioOpen((prev) => !prev)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                designStudioOpen
                  ? 'bg-[#E8EEFF] dark:bg-indigo-950/60 text-[#2646B8] dark:text-indigo-300 shadow-xs'
                  : 'text-[#5B6472] dark:text-gray-300 hover:text-[#3156D3] dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-800'
              }`}
              title="Design Studio (Palettes & Fonts)"
              aria-label="Toggle Design Studio"
              aria-expanded={designStudioOpen}
              aria-controls="design-studio-dialog"
            >
              <Palette className="w-4 h-4 text-[#3156D3] dark:text-indigo-400 pointer-events-none" />
            </button>

            <button
              onClick={() => setHelpModalOpen(true)}
              className="p-1.5 text-[#5B6472] dark:text-gray-300 hover:text-[#3156D3] dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer hidden sm:flex items-center gap-1 text-xs font-medium"
              title="Teacher Guide"
              aria-label="Teacher Guide"
            >
              <HelpCircle className="w-4 h-4" />
              <span className="text-[11px] pr-1">Guide</span>
            </button>
          </div>

          <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 hidden sm:block mx-0.5" />

          {/* User Profile Quick Menu */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
              aria-haspopup="true"
              aria-expanded={userMenuOpen}
            >
              <div className="w-8 h-8 rounded-full bg-[#E8EEFF] dark:bg-indigo-950/60 text-[#2646B8] dark:text-indigo-300 flex items-center justify-center font-bold text-xs border border-[#2646B8]/20 dark:border-indigo-700/40 shadow-xs">
                {teacherUser?.name ? teacherUser.name.slice(0, 2).toUpperCase() : 'T'}
              </div>
              <span className="text-xs font-semibold text-[#1F2937] dark:text-white hidden sm:inline max-w-[120px] truncate">
                {teacherUser?.name || 'Faculty Instructor'}
              </span>
            </button>

            {userMenuOpen && (
              <div className="absolute top-11 right-0 w-64 bg-white dark:bg-[#181C24] border border-[#D9DEE7] dark:border-[#2D3545] rounded-xl shadow-xl p-2 z-40 flex flex-col gap-1 text-xs animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                  <p className="font-bold text-sm text-[#1F2937] dark:text-white">{teacherUser?.name || 'Faculty Instructor'}</p>
                  <p className="text-[#5B6472] dark:text-gray-400 text-xs mt-0.5">{teacherUser?.email || ''}</p>
                  {teacherUser?.department && (
                    <p className="text-[11px] text-[#3156D3] dark:text-indigo-400 font-medium mt-1">
                      {teacherUser.department}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    setHelpModalOpen(true);
                    setUserMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#5B6472] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#1F2937] dark:hover:text-white transition cursor-pointer w-full text-left"
                >
                  <HelpCircle className="w-4 h-4 text-[#3156D3] dark:text-indigo-400" />
                  <span>Documentation & Guide</span>
                </button>
                <button
                  onClick={() => {
                    setUserMenuOpen(false);
                    onSignOut?.();
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#B42318] dark:text-rose-400 hover:bg-[#FEF0EF] dark:hover:bg-rose-950/40 transition cursor-pointer w-full text-left font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/15 dark:bg-black/25 backdrop-blur-md lg:hidden flex"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-72 bg-white dark:bg-[#181C24] h-full shadow-2xl flex flex-col p-4 animate-in slide-in-from-left duration-200 border-r border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <img src="/learnova-logo.png" alt="Learnova" className="h-7 w-auto object-contain" />
                <div>
                  <p className="font-bold text-sm text-[#1F2937] dark:text-white">Learnova</p>
                  <p className="text-[11px] text-[#3156D3] dark:text-indigo-400 font-semibold">Teacher Portal</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-[#5B6472] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = item.activeMatches.includes(currentPage);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      isActive
                        ? 'bg-[#E8EEFF] dark:bg-indigo-950/60 text-[#2646B8] dark:text-indigo-300'
                        : 'text-[#5B6472] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold bg-[#FFF5D6] text-[#946200] px-1.5 py-0.5 rounded border border-[#946200]/20">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#1C212B] border border-gray-200 dark:border-gray-800">
                <p className="font-bold text-xs text-gray-900 dark:text-white">{teacherUser?.name || 'Faculty Instructor'}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{teacherUser?.email || ''}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignOut?.();
                }}
                className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main content viewport - Full Width Without Sidebar Constraints */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1440px] w-full mx-auto overflow-x-hidden">
        <div className="view-enter-animation">
          {children}
        </div>
      </main>

      {/* Quiet Studio-Grade Utility Footer */}
      <AppFooter onOpenDesignStudio={() => setDesignStudioOpen(true)} />

      {/* Design Studio Customizer Widget */}
      <DesignStudioWidget
        isOpen={designStudioOpen}
        onClose={() => setDesignStudioOpen(false)}
        onToggle={() => setDesignStudioOpen((prev) => !prev)}
      />

      {/* Teacher Portal Documentation Modal */}
      {helpModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/15 dark:bg-black/25 flex items-center justify-center p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white dark:bg-[#181C24] rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-[#D9DEE7] dark:border-[#2D3545] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9DEE7] dark:border-[#2D3545]">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#3156D3]" />
                <h3 className="text-base font-bold text-[#1F2937] dark:text-white">
                  Learnova Teacher Portal - System Guide
                </h3>
              </div>
              <button
                onClick={() => setHelpModalOpen(false)}
                className="p-1 text-[#5B6472] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer"
                aria-label="Close help modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 overflow-y-auto space-y-4 text-xs text-[#5B6472] dark:text-gray-300 leading-relaxed">
              <div className="p-3 rounded-lg bg-[#EFF8FF] dark:bg-indigo-950/40 border border-[#175CD3]/20 dark:border-indigo-700/30">
                <p className="font-semibold text-[#175CD3] dark:text-indigo-300 mb-1">Teacher-in-the-Loop Principle</p>
                <p>
                  AI generates candidate questions based on your curriculum topics and learning
                  resources. Every question requires manual teacher review, edit, and explicit
                  approval before it enters the Question Bank or Assessments.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-[#1F2937] dark:text-white text-sm mb-1">
                  Prerequisite Graph (DAG Rules)
                </h4>
                <p>
                  Topics form a Directed Acyclic Graph. The prerequisite manager mathematically
                  prevents self-dependencies and circular chains. Downstream topics cannot unlock
                  until foundational prerequisites are completed by students.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-[#1F2937] dark:text-white text-sm mb-1">
                  Academic Mastery vs Gamification
                </h4>
                <p>
                  Academic mastery percentages are computed strictly from completed assessment
                  submissions. Gamification XP and badges are asynchronous rewards that are never
                  factored into grade metrics or topic mastery calculations.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-[#D9DEE7] dark:border-[#2D3545] flex justify-end">
              <button
                onClick={() => setHelpModalOpen(false)}
                className="bg-[#3156D3] text-white px-4 py-2 rounded-lg font-medium text-xs hover:bg-[#2646B8] cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
