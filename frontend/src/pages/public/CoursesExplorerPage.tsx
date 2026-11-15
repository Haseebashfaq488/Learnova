import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  Layers,
  Award,
  ArrowRight,
  Filter,
  Grid,
  List,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { Course, Topic, Lesson, Enrollment, UserAccount } from '../../types';
import { UserResponse } from '../../services/api/authApi';
import { PublicNavigationPage } from '../../services/routerService';
import { ThreeConstellationBanner } from '../../components/public/ThreeConstellationBanner';

export type ExplorerSessionUser =
  | UserResponse
  | UserAccount
  | { name?: string; full_name?: string; email: string; role: string; [key: string]: any };

interface CoursesExplorerPageProps {
  courses: Course[];
  topics: Topic[];
  lessons: Lesson[];
  enrollments?: Enrollment[];
  currentUser?: ExplorerSessionUser | null;
  onSelectCourse: (courseId: string) => void;
  onEnrollCourse?: (courseId: string) => void;
  onContinueLearning?: (courseId: string) => void;
  onNavigate: (page: PublicNavigationPage, params?: Record<string, string>) => void;
}

export const CoursesExplorerPage: React.FC<CoursesExplorerPageProps> = ({
  courses,
  topics,
  lessons,
  enrollments = [],
  currentUser,
  onSelectCourse,
  onEnrollCourse,
  onContinueLearning,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'default' | 'topics' | 'threshold'>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));

  // Extract unique departments from real courses
  const departments = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.creatorDepartment) set.add(c.creatorDepartment);
    });
    return Array.from(set);
  }, [courses]);

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let result = courses.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.creatorName?.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q);

      const matchesDept =
        selectedDepartment === 'all' || c.creatorDepartment === selectedDepartment;

      return matchesQuery && matchesDept;
    });

    if (sortBy === 'topics') {
      result.sort((a, b) => {
        const aCount = topics.filter((t) => t.courseId === a.id).length;
        const bCount = topics.filter((t) => t.courseId === b.id).length;
        return bCount - aCount;
      });
    } else if (sortBy === 'threshold') {
      result.sort((a, b) => {
        const aTopics = topics.filter((t) => t.courseId === a.id);
        const bTopics = topics.filter((t) => t.courseId === b.id);
        const aAvg = aTopics.length ? aTopics[0].masteryThreshold || 75 : 75;
        const bAvg = bTopics.length ? bTopics[0].masteryThreshold || 75 : 75;
        return bAvg - aAvg;
      });
    }

    return result;
  }, [courses, topics, searchQuery, selectedDepartment, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
      {/* Header with Three.js 3D Constellation Wave */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 p-6 sm:p-8 overflow-hidden text-white border border-indigo-800/60 shadow-xl">
        <div className="absolute inset-0 opacity-40">
          <ThreeConstellationBanner className="w-full h-full" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-mono font-bold text-indigo-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Curriculum Explorer</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            University Computing Curriculum
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200/80 leading-relaxed">
            Curriculums mapped with Bayesian Knowledge Tracing and Directed Acyclic Graphs.
          </p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#121724] border border-gray-200 dark:border-gray-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter courses by title, instructor, or topic..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/70 dark:bg-[#182030] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Sort Selector & View Toggle */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#182030] text-gray-700 dark:text-gray-300 focus:outline-none font-medium cursor-pointer"
              aria-label="Sort courses by"
            >
              <option value="default">Default Order</option>
              <option value="topics">Most Topics</option>
              <option value="threshold">Highest Target</option>
            </select>

            <div className="flex items-center p-1 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-[#1A2234] text-indigo-600 dark:text-indigo-400 shadow-2xs font-semibold'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
                aria-label="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-[#1A2234] text-indigo-600 dark:text-indigo-400 shadow-2xs font-semibold'
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                }`}
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Department Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mr-1">
            Department:
          </span>
          <button
            type="button"
            onClick={() => setSelectedDepartment('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              selectedDepartment === 'all'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            All Disciplines ({courses.length})
          </button>
          {departments.map((dept) => {
            const isSelected = selectedDepartment === dept;
            return (
              <button
                key={dept}
                type="button"
                onClick={() => setSelectedDepartment(dept)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {dept}
              </button>
            );
          })}
        </div>
      </div>

      {/* Courses Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => {
            const courseTopics = topics.filter((t) => t.courseId === course.id);
            const isEnrolled = enrolledCourseIds.has(course.id);
            const enr = enrollments.find((e) => e.courseId === course.id);

            return (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course.id)}
                className="group p-5 rounded-2xl bg-white dark:bg-[#121724] border border-gray-200 dark:border-gray-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                      {course.id.replace('course-', '').toUpperCase()}
                    </span>
                    {isEnrolled ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                        <CheckCircle className="w-3 h-3" />
                        <span>Enrolled ({enr?.progressPercent || 0}%)</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400">
                        {course.creatorDepartment}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{courseTopics.length} Topics</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>80% BKT Target</span>
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {course.creatorName}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCourse(course.id);
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer"
                  >
                    <span>Inspect Syllabus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCourses.map((course) => {
            const courseTopics = topics.filter((t) => t.courseId === course.id);
            const isEnrolled = enrolledCourseIds.has(course.id);

            return (
              <div
                key={course.id}
                onClick={() => onSelectCourse(course.id)}
                className="p-4 rounded-xl bg-white dark:bg-[#121724] border border-gray-200 dark:border-gray-800 hover:border-indigo-400 dark:hover:border-indigo-600 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {course.id.replace('course-', '').toUpperCase()}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {course.title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {course.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs text-gray-500">{courseTopics.length} Topics</span>
                  {isEnrolled && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Enrolled
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectCourse(course.id);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
                  >
                    Inspect Syllabus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
