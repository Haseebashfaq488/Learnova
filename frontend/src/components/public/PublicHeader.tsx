import React, { useState, useEffect } from 'react';
import {
  Search,
  Palette,
  ArrowRight,
  Menu,
  X,
  Compass,
  Cpu,
  GraduationCap,
} from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { PublicNavigationPage } from '../../services/routerService';
import { UserResponse } from '../../services/api/authApi';

interface PublicHeaderProps {
  currentPage: PublicNavigationPage;
  onNavigate: (page: PublicNavigationPage, params?: Record<string, string>) => void;
  onOpenSearch: () => void;
  onOpenDesignStudio: () => void;
  onEnterPortal: () => void;
  currentUser?: UserResponse | null;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenSearch,
  onOpenDesignStudio,
  onEnterPortal,
  currentUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { id: PublicNavigationPage; label: string; description: string }[] = [
    { id: 'landing', label: 'Overview', description: 'Platform core & BKT engine' },
    { id: 'courses', label: 'Courses', description: 'Explore DAG sequences' },
    { id: 'about', label: 'About Us', description: 'Cognitive science & architecture' },
    { id: 'contact', label: 'Contact Us', description: 'Campus & institutional ops' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? 'bg-white/90 dark:bg-[#0E131F]/90 backdrop-blur-md shadow-sm border-b border-gray-200/80 dark:border-gray-800/80 py-2.5'
          : 'bg-white/80 dark:bg-[#0E131F]/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800/60 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* LEFT: LOGO */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className="group flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
              aria-label="Learnova Homepage"
            >
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-200">
                <Cpu className="w-5 h-5 text-white transform group-hover:rotate-12 transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white font-sans">
                    Learnova
                  </span>
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                    ACADEMIC
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 hidden sm:inline-block leading-none">
                  Cognitive Science &amp; Mastery
                </span>
              </div>
            </button>
          </div>

          {/* CENTER: MENU (Desktop) */}
          <nav
            className="hidden md:flex items-center p-1 bg-gray-100/80 dark:bg-gray-900/60 rounded-full border border-gray-200/60 dark:border-gray-800/60 shadow-inner"
            aria-label="Main Navigation"
          >
            {navItems.map((item) => {
              const isActive =
                currentPage === item.id ||
                (item.id === 'courses' && currentPage === 'course_details');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-[#1A2234] text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-800/40'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* RIGHT: ACTIONS (Search, Theme, Palette, Dashboard) */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Search Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-[#151B28] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700 transition-all text-xs font-medium cursor-pointer"
              title="Search curriculum and concepts (Cmd+K)"
              aria-label="Open search dialog"
            >
              <Search className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle compact={false} />

            {/* Design Studio Palette Button */}
            <button
              type="button"
              onClick={onOpenDesignStudio}
              className="hidden sm:flex items-center justify-center p-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1E232E] text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors cursor-pointer"
              title="Open Design Studio & Color Themes"
              aria-label="Theme Palette Studio"
            >
              <Palette className="w-4 h-4" />
            </button>

            {/* Dashboard / Access Portal Button */}
            <button
              type="button"
              onClick={onEnterPortal}
              className="group relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-95 transition-all duration-150 cursor-pointer"
              aria-label={currentUser ? 'Open Student Dashboard' : 'Access Learnova Portal'}
            >
              <GraduationCap className="w-3.5 h-3.5 text-white/90" />
              <span>{currentUser ? 'Dashboard' : 'Portal'}</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-3 pb-5 bg-white dark:bg-[#0E131F] border-b border-gray-200 dark:border-gray-800 shadow-xl animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-1.5 mb-4">
            {navItems.map((item) => {
              const isActive =
                currentPage === item.id ||
                (item.id === 'courses' && currentPage === 'course_details');
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl text-left text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    <span className="text-[11px] font-normal text-gray-500 dark:text-gray-400">
                      {item.description}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                onOpenDesignStudio();
                setMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-xs font-semibold text-gray-700 dark:text-gray-300"
            >
              <Palette className="w-4 h-4 text-indigo-500" />
              <span>Theme Studio</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onEnterPortal();
                setMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 text-white text-xs font-bold"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{currentUser ? 'Dashboard' : 'Sign In'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
