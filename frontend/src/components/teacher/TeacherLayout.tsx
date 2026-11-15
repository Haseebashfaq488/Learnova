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
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  GraduationCap,
  Bell,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Palette,
  Sun,
  Moon,
  ArrowRightLeft,
  Globe,
} from 'lucide-react';
import { CURRENT_TEACHER } from '../../services/storageService';
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
  onSwitchPortal,
  onSwitchToPublic,
  breadcrumbs = [],
  toasts,
  onDismissToast,
  children,
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
      activeMatches: ['overview'],
    },
    {
      id: 'courses' as NavigationPage,
      label: 'Courses',
      icon: <BookOpen className="w-5 h-5 shrink-0" />,
      activeMatches: ['courses', 'course_overview', 'curriculum', 'prerequisites', 'resources'],
    },
    {
      id: 'questions' as NavigationPage,
      label: 'Question Bank',
      icon: <ListChecks className="w-5 h-5 shrink-0" />,
      activeMatches: ['questions', 'question_editor'],
    },
    {
      id: 'ai_review' as NavigationPage,
      label: 'AI Review',
      icon: <Sparkles className="w-5 h-5 shrink-0" />,
      activeMatches: ['ai_review'],
      badge: 'Review',
    },
    {
      id: 'assessments' as NavigationPage,
      label: 'Assessments',
      icon: <ClipboardCheck className="w-5 h-5 shrink-0" />,
      activeMatches: ['assessments', 'assessment_editor'],
    },
    {
      id: 'analytics' as NavigationPage,
      label: 'Analytics',
      icon: <BarChart3 className="w-5 h-5 shrink-0" />,
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

      <div className="flex flex-1">
        {/* Desktop Sidebar (248px or 72px collapsed) - Sticky & Never moves on scroll */}
        <aside
          className={`hidden md:flex flex-col border-r border-[#D9DEE7] dark:border-[#2D3545] bg-white dark:bg-[#181C24] transition-all duration-200 select-none z-20 shrink-0 sticky top-0 h-screen self-start ${
            sidebarCollapsed ? 'w-[72px]' : 'w-[248px]'
          }`}
          aria-label="Main Navigation"
        >
          {/* Brand header */}
          <div
            className={`h-[72px] border-b border-[#D9DEE7] dark:border-[#2D3545] flex items-center justify-between transition-all duration-200 ${
              sidebarCollapsed ? 'px-2' : 'px-5'
            }`}
          >
            {sidebarCollapsed ? (
              <div className="w-full flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSidebarCollapsed(false)}
                  className="w-7 h-7 rounded-lg bg-[#3156D3] text-white flex items-center justify-center shrink-0 shadow-xs hover:opacity-90 transition cursor-pointer"
                  title="Learnova Teacher Portal - Click to expand"
                  aria-label="Learnova Teacher Portal"
                >
                  <GraduationCap className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarCollapsed(false)}
                  className="p-1 rounded-md text-[#5B6472] hover:bg-gray-100 hover:text-[#1F2937] transition cursor-pointer"
                  aria-label="Expand sidebar"
                  title="Expand sidebar"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 overflow-hidden min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#3156D3] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-base tracking-tight text-[#1F2937] dark:text-white leading-none truncate">
                      Learnova
                    </span>
                    <span className="text-[11px] font-semibold text-[#3156D3] dark:text-indigo-400 uppercase tracking-wider mt-1 truncate">
                      Teacher Portal
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarCollapsed(true)}
                  className="p-1 rounded-md text-[#5B6472] hover:bg-gray-100 hover:text-[#1F2937] transition-colors cursor-pointer shrink-0"
                  aria-label="Collapse sidebar"
                  title="Collapse sidebar"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Navigation links */}
          <nav className="flex-1 py-4 px-3 flex flex-col gap-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = item.activeMatches.includes(currentPage);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative cursor-pointer group ${
                    isActive
                      ? 'bg-[#E8EEFF] dark:bg-indigo-950/40 text-[#2646B8] dark:text-indigo-300 font-semibold shadow-2xs'
                      : 'text-[#5B6472] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#1F2937] hover:translate-x-0.5'
                  } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
                >
                  {/* Left edge indicator */}
                  {isActive && <span className="nav-indicator-pill" aria-hidden="true" />}
                  <span
                    className={
                      isActive
                        ? 'text-[#2646B8]'
                        : 'text-[#5B6472] group-hover:text-[#1F2937]'
                    }
                  >
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && (
                    <span className="flex-1 text-left truncate">{item.label}</span>
                  )}
                  {!sidebarCollapsed && item.badge && (
                    <span className="text-[10px] font-semibold bg-[#FFF5D6] text-[#946200] px-1.5 py-0.5 rounded border border-[#946200]/20">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Workspace Quick-Switch Actions */}
          {(onSwitchPortal || onSwitchToPublic) && (
            <div className="p-3 border-t border-[#D9DEE7] dark:border-[#2D3545] space-y-1.5">
              {onSwitchPortal && (
                <button
                  type="button"
                  onClick={() => onSwitchPortal('student')}
                  title="Switch to Student Portal"
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition cursor-pointer ${
                    sidebarCollapsed ? 'justify-center px-0' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    {!sidebarCollapsed && <span>Student Portal</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium">
                      Student
                    </span>
                  )}
                </button>
              )}

              {onSwitchToPublic && (
                <button
                  type="button"
                  onClick={onSwitchToPublic}
                  title="Return to Public Site"
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition cursor-pointer ${
                    sidebarCollapsed ? 'justify-center px-0' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    {!sidebarCollapsed && <span>Public Overview</span>}
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium">
                      Home
                    </span>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Bottom user utility area */}
          <div className="p-3 border-t border-[#D9DEE7] dark:border-[#2D3545]">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left cursor-pointer ${
                  sidebarCollapsed ? 'justify-center p-1.5' : ''
                }`}
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
              >
                <div className="w-8 h-8 rounded-full bg-[#E8EEFF] dark:bg-indigo-950/60 text-[#2646B8] dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0 border border-[#2646B8]/20 dark:border-indigo-700/40">
                  {teacherUser?.name ? teacherUser.name.slice(0, 2).toUpperCase() : 'ER'}
                </div>
                {!sidebarCollapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#1F2937] dark:text-white truncate">
                      {teacherUser?.name || CURRENT_TEACHER.name}
                    </p>
                    <p className="text-[11px] text-[#5B6472] dark:text-gray-400 truncate">
                      {teacherUser?.department || CURRENT_TEACHER.department}
                    </p>
                  </div>
                )}
              </button>

              {userMenuOpen && (
                <div
                  className={`absolute bottom-12 bg-white dark:bg-[#181C24] border border-[#D9DEE7] dark:border-[#2D3545] rounded-xl shadow-lg p-2 z-30 flex flex-col gap-1 text-xs animate-in fade-in duration-100 ${
                    sidebarCollapsed ? 'left-0 w-60 shadow-xl' : 'left-0 right-0'
                  }`}
                >
                  <div className="px-2 py-1.5 border-b border-gray-100 dark:border-gray-800">
                    <p className="font-semibold text-[#1F2937] dark:text-white">{teacherUser?.name || CURRENT_TEACHER.name}</p>
                    <p className="text-[#5B6472] dark:text-gray-400 text-[11px]">{teacherUser?.email || CURRENT_TEACHER.email}</p>
                    <span className="inline-block mt-1 bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-300 text-[10px] px-1.5 py-0.2 rounded font-medium">
                      Role: Instructor
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setHelpModalOpen(true);
                      setUserMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded text-[#5B6472] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#1F2937] dark:hover:text-white transition-colors cursor-pointer w-full text-left"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-[#3156D3] dark:text-indigo-400" />
                    <span>Documentation & Help</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      onSignOut?.();
                    }}
                    className="flex items-center gap-2 px-2 py-1.5 rounded text-[#B42318] dark:text-rose-400 hover:bg-[#FEF0EF] dark:hover:bg-rose-950/40 transition-colors cursor-pointer w-full text-left font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Header and Drawer */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-[72px] frosted-header px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 rounded-lg text-[#5B6472] dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer shrink-0"
                aria-label="Open mobile navigation"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 md:hidden shrink-0">
                <div className="w-7 h-7 rounded-lg bg-[#3156D3] text-white flex items-center justify-center font-bold text-xs">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm tracking-tight text-[#1F2937] dark:text-white">Learnova</span>
              </div>

              {/* Breadcrumb Path Tree (Faculty Workspace) */}
              <nav className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate" aria-label="Breadcrumb">
                <button
                  type="button"
                  onClick={() => onNavigate('overview')}
                  className="hover:text-[#3156D3] dark:hover:text-indigo-400 font-medium transition cursor-pointer shrink-0"
                >
                  Faculty
                </button>
                {breadcrumbs.map((crumb, idx) => (
                  <React.Fragment key={idx}>
                    <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-gray-400 shrink-0" />
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
            </div>

            <div className="flex items-center gap-2">
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

              <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 hidden sm:block mx-1" />

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#E8EEFF] dark:bg-indigo-950/60 text-[#2646B8] dark:text-indigo-300 flex items-center justify-center font-bold text-xs border border-[#2646B8]/20 dark:border-indigo-700/40">
                  ER
                </div>
                <span className="text-xs font-semibold text-[#1F2937] dark:text-white hidden sm:inline">
                  {CURRENT_TEACHER.name}
                </span>
              </div>
            </div>
          </header>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 z-50 bg-black/45 md:hidden backdrop-blur-xs flex"
              role="dialog"
              aria-modal="true"
            >
              <div className="w-72 bg-white dark:bg-[#181C24] h-full shadow-2xl flex flex-col p-4 animate-in slide-in-from-left duration-200 border-r border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#3156D3] text-white flex items-center justify-center">
                      <GraduationCap className="w-5 h-5" />
                    </div>
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
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#E8EEFF] dark:bg-indigo-950/50 text-[#2646B8] dark:text-indigo-300 font-semibold'
                            : 'text-[#5B6472] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-[#1F2937] dark:hover:text-white text-left'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {item.icon}
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] font-semibold bg-[#FFF5D6] dark:bg-amber-950/50 text-[#946200] dark:text-amber-300 px-1.5 py-0.5 rounded border border-[#946200]/20 dark:border-amber-700/40">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                  {(onSwitchPortal || onSwitchToPublic) && (
                    <div className="flex flex-col gap-1.5 mb-3">
                      {onSwitchPortal && (
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            onSwitchPortal('student');
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex items-center gap-2">
                            <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>Student Portal</span>
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                            Student
                          </span>
                        </button>
                      )}
                      {onSwitchToPublic && (
                        <button
                          type="button"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            onSwitchToPublic();
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex items-center gap-2">
                            <Globe className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span>Public Site</span>
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                            Home
                          </span>
                        </button>
                      )}
                    </div>
                  )}

                  <div className="mb-3">
                    <span className="text-[10px] font-semibold uppercase text-[#737D8C] dark:text-[#828B99] block mb-1.5">
                      Theme Mode
                    </span>
                    <ThemeToggle compact />
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#F5F7FA] dark:bg-[#1C212B] border border-[#D9DEE7] dark:border-[#2D3545] mb-3">
                    <p className="text-xs font-semibold text-[#1F2937] dark:text-white">{CURRENT_TEACHER.name}</p>
                    <p className="text-[11px] text-[#5B6472] dark:text-gray-400">{CURRENT_TEACHER.email}</p>
                    <p className="text-[10px] text-[#3156D3] dark:text-indigo-400 font-medium mt-1">
                      {CURRENT_TEACHER.department}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
            </div>
          )}

          {/* Main content viewport */}
          <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1440px] w-full mx-auto overflow-x-hidden">
            <div className="view-enter-animation">
              {children}
            </div>
          </main>

          {/* Quiet Studio-Grade Utility Footer */}
          <AppFooter onOpenDesignStudio={() => setDesignStudioOpen(true)} />
        </div>
      </div>

      {/* Design Studio Customizer Widget */}
      <DesignStudioWidget
        isOpen={designStudioOpen}
        onClose={() => setDesignStudioOpen(false)}
        onToggle={() => setDesignStudioOpen((prev) => !prev)}
      />

      {/* Teacher Portal Documentation Modal */}
      {helpModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-[#D9DEE7] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9DEE7]">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#3156D3]" />
                <h3 className="text-base font-bold text-[#1F2937]">
                  Learnova Teacher Portal - System Guide
                </h3>
              </div>
              <button
                onClick={() => setHelpModalOpen(false)}
                className="p-1 text-[#5B6472] hover:bg-gray-100 rounded-lg cursor-pointer"
                aria-label="Close help modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 overflow-y-auto space-y-4 text-xs text-[#5B6472] leading-relaxed">
              <div className="p-3 rounded-lg bg-[#EFF8FF] border border-[#175CD3]/20">
                <p className="font-semibold text-[#175CD3] mb-1">Teacher-in-the-Loop Principle</p>
                <p>
                  AI generates candidate questions based on your curriculum topics and learning
                  resources. Every question requires manual teacher review, edit, and explicit
                  approval before it enters the Question Bank or Assessments.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-[#1F2937] text-sm mb-1">
                  Prerequisite Graph (DAG Rules)
                </h4>
                <p>
                  Topics form a Directed Acyclic Graph. The prerequisite manager mathematically
                  prevents self-dependencies and circular chains. Downstream topics cannot unlock
                  until foundational prerequisites are completed by students.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-[#1F2937] text-sm mb-1">
                  Academic Mastery vs Gamification
                </h4>
                <p>
                  Academic mastery percentages are computed strictly from completed assessment
                  submissions. Gamification XP and badges are asynchronous rewards that are never
                  factored into grade metrics or topic mastery calculations.
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-[#D9DEE7] flex justify-end">
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
