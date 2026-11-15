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
  User,
  GraduationCap,
} from 'lucide-react';
import { Course, Topic, Lesson, Enrollment, UserAccount } from '../../types';
import { UserResponse } from '../../services/api/authApi';
import { PublicNavigationPage } from '../../services/routerService';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="max-w-3xl space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          University Computing Curriculum
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          Canonical higher-education sequences sequenced by Bayesian Knowledge Tracing and
          Directed Acyclic Graphs. Explore syllabi, prerequisites, and competency criteria.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#121724] border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
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
              <option value="threshold">Highest Mastery Target</option>
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
      {filteredCourses.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-[#121724] rounded-2xl border border-gray-200 dark:border-gray-800">
          <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">
            No matching courses found
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or clearing the department filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedDepartment('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => {
            const courseTopics = topics.filter((t) => t.courseId === course.id);
            const courseLessons = lessons.filter((l) => l.courseId === course.id);
            const avgThreshold =
              courseTopics.length > 0
                ? Math.round(
                    courseTopics.reduce((acc, t) => acc + (t.masteryThreshold || 75), 0) /
                      courseTopics.length
                  )
                : 80;

            const isEnrolled = enrollments.some((e) => e.courseId === course.id);

            return (
              <div
                key={course.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#121724] border border-gray-200/90 dark:border-gray-800 shadow-sm interactive-card flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-800/50">
                      {course.id.replace('course-', '').toUpperCase()}
                    </span>
                    {isEnrolled ? (
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">
                        Enrolled
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {course.creatorDepartment}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{courseTopics.length} DAG Topics</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{courseLessons.length} Lessons</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>{avgThreshold}% BKT Target</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                        {course.creatorAvatar || 'FC'}
                      </div>
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate">
                        {course.creatorName}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelectCourse(course.id)}
                      className="group flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs hover:shadow-sm active:scale-95 transition-all cursor-pointer shrink-0"
                    >
                      <span>Inspect Syllabus</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          {filteredCourses.map((course) => {
            const courseTopics = topics.filter((t) => t.courseId === course.id);
            const courseLessons = lessons.filter((l) => l.courseId === course.id);

            return (
              <div
                key={course.id}
                className="p-5 rounded-2xl bg-white dark:bg-[#121724] border border-gray-200/90 dark:border-gray-800 shadow-sm interactive-card flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {course.id.replace('course-', '').toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {course.creatorDepartment}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-1">
                    {course.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0 self-end sm:self-auto">
                  <div className="text-right hidden md:block">
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 block">
                      {course.creatorName}
                    </span>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      {courseTopics.length} Topics · {courseLessons.length} Lessons
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectCourse(course.id)}
                    className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold active:scale-95 transition-all cursor-pointer"
                  >
                    <span>View Syllabus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
