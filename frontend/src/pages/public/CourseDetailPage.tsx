import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Layers,
  Award,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  FileText,
  Brain,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Play,
} from 'lucide-react';
import { Course, Topic, Lesson, LearningResource, Enrollment, UserAccount } from '../../types';
import { UserResponse } from '../../services/api/authApi';
import { PublicNavigationPage } from '../../services/routerService';

export type SessionUser =
  | UserResponse
  | UserAccount
  | { name?: string; full_name?: string; email: string; role: string; [key: string]: any };

interface CourseDetailPageProps {
  courseId: string;
  courses: Course[];
  topics: Topic[];
  lessons: Lesson[];
  resources: LearningResource[];
  enrollments?: Enrollment[];
  currentUser?: SessionUser | null;
  onEnroll: (courseId: string) => Promise<void> | void;
  onContinueLearning?: (courseId: string) => void;
  onNavigate: (page: PublicNavigationPage, params?: Record<string, string>) => void;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({
  courseId,
  courses,
  topics,
  lessons,
  resources,
  enrollments = [],
  currentUser,
  onEnroll,
  onContinueLearning,
  onNavigate,
}) => {
  const [isEnrolling, setIsEnrolling] = useState(false);

  const course = courses.find((c) => c.id === courseId) || courses[0];
  const courseTopics = topics.filter((t) => t.courseId === course?.id);
  const courseLessons = lessons.filter((l) => l.courseId === course?.id);
  const courseResources = resources.filter((r) => r.courseId === course?.id);

  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(
    courseTopics[0]?.id || null
  );

  const userName = currentUser
    ? ('full_name' in currentUser && (currentUser as any).full_name
        ? (currentUser as any).full_name
        : 'name' in currentUser && (currentUser as any).name
        ? (currentUser as any).name
        : currentUser.email)
    : '';

  const isEnrolled = enrollments.some((e) => e.courseId === course?.id);
  const enrollment = enrollments.find((e) => e.courseId === course?.id);
  const progressPercent = enrollment?.progressPercent ?? 0;

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Course Not Found</h2>
        <button
          type="button"
          onClick={() => onNavigate('courses')}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
        >
          Back to Courses
        </button>
      </div>
    );
  }

  const toggleTopicExpand = (tId: string) => {
    setExpandedTopicId((prev) => (prev === tId ? null : tId));
  };

  const handleEnrollClick = async () => {
    if (isEnrolled || isEnrolling) return;
    setIsEnrolling(true);
    try {
      await onEnroll(course.id);
    } catch (err) {
      console.error('Enrollment error:', err);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleContinueClick = () => {
    if (onContinueLearning) {
      onContinueLearning(course.id);
    } else {
      onNavigate('courses');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <button
            type="button"
            onClick={() => onNavigate('courses')}
            className="flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Curriculum Catalog</span>
          </button>
          <span>/</span>
          <span className="font-mono text-gray-700 dark:text-gray-300">
            {course.id.replace('course-', '').toUpperCase()}
          </span>
        </div>

        {/* Live Session Status Pill */}
        {currentUser && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{`Session: ${userName}`}</span>
            <span className="text-gray-400">({currentUser.role})</span>
          </div>
        )}
      </div>

      {/* Course Hero Banner */}
      <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#121724] border border-gray-200/90 dark:border-gray-800 shadow-sm space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                {course.id.replace('course-', '').toUpperCase()}
              </span>
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {course.creatorDepartment}
              </span>
              <span className="text-gray-300 dark:text-gray-700">·</span>
              {isEnrolled ? (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Already Enrolled ({progressPercent}% Mastered)
                </span>
              ) : (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Published &amp; Authoritative
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
              {course.title}
            </h1>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
              {course.description}
            </p>

            {/* Quick Metrics */}
            <div className="flex flex-wrap items-center gap-5 pt-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-500" />
                <span>{courseTopics.length} DAG Topics</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span>{courseLessons.length} Lessons</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-500" />
                <span>{courseResources.length} Resources</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>80% BKT Passing Threshold</span>
              </div>
            </div>
          </div>

          {/* Instructor & Session Enrollment Action Card */}
          <div className="lg:col-span-4 p-6 rounded-2xl bg-gray-50 dark:bg-[#171E2D] border border-gray-200/70 dark:border-gray-800 space-y-5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-2">
                Faculty Director
              </span>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                  {course.creatorAvatar || 'FC'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    {course.creatorName}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {course.creatorDepartment}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 font-mono">
                    {course.creatorEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Enrollment Status Indicator */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#121724] border border-gray-200/60 dark:border-gray-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400 font-medium">Session Status</span>
                {isEnrolled ? (
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Already Enrolled
                  </span>
                ) : (
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    Available to Enroll
                  </span>
                )}
              </div>

              {isEnrolled && (
                <div className="space-y-1.5 pt-1 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500 dark:text-gray-400">Student Progress</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, progressPercent)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button Connected to Database Session */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700/60 space-y-3">
              {isEnrolled ? (
                <button
                  type="button"
                  onClick={handleContinueClick}
                  className="w-full group flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Continue Learning →</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleEnrollClick}
                  disabled={isEnrolling}
                  className="w-full group flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-70"
                >
                  {isEnrolling ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Connecting Database...</span>
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-4 h-4" />
                      <span>Enroll in Course &amp; Start Learning</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              )}

              <p className="text-[11px] text-center text-gray-400 dark:text-gray-500">
                {isEnrolled
                  ? 'Your progress is synchronized with the live PostgreSQL 17 database.'
                  : 'Includes diagnostic exam, adaptive practice sessions & final certification.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SYLLABUS & DAG TOPICS BREAKDOWN
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Syllabus &amp; Directed Acyclic Graph (DAG) Structure
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Sequential mastery enforced with cycle-free topology.
            </p>
          </div>
          <div className="text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full border border-indigo-200/50 dark:border-indigo-800/50 self-start sm:self-auto">
            Cycle-Free DFS Enforced
          </div>
        </div>

        <div className="space-y-3">
          {courseTopics.map((topic) => {
            const isExpanded = expandedTopicId === topic.id;
            const topicLessons = lessons.filter((l) => l.topicId === topic.id);
            const hasPrereqs = topic.prerequisiteTopicIds.length > 0;
            const prereqNames = topic.prerequisiteTopicIds
              .map((pid) => courseTopics.find((t) => t.id === pid)?.title)
              .filter(Boolean)
              .join(', ');

            return (
              <div
                key={topic.id}
                className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-[#121724] overflow-hidden shadow-2xs"
              >
                {/* Topic Header Row */}
                <button
                  type="button"
                  onClick={() => toggleTopicExpand(topic.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-gray-50 dark:hover:bg-[#182030] transition-colors cursor-pointer"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-mono font-bold text-xs shrink-0">
                      0{topic.order}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                          {topic.title}
                        </h3>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          {topic.masteryThreshold}% BKT Target
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>{topicLessons.length} Lessons</span>
                        <span>·</span>
                        {hasPrereqs ? (
                          <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium">
                            <Lock className="w-3 h-3" />
                            Requires: {prereqNames}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                            <CheckCircle2 className="w-3 h-3" />
                            Foundational Node
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Lessons Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-[#161D2B]/40 space-y-3">
                    {topic.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-300">
                        {topic.description}
                      </p>
                    )}

                    <div className="space-y-2 pt-1">
                      {topicLessons.length === 0 ? (
                        <p className="text-xs text-gray-400 italic">No lessons assigned yet.</p>
                      ) : (
                        topicLessons.map((lesson) => {
                          const lessonRes = resources.filter((r) => r.lessonId === lesson.id);
                          return (
                            <div
                              key={lesson.id}
                              className="p-3 rounded-xl bg-white dark:bg-[#121724] border border-gray-200/60 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2.5">
                                <BookOpen className="w-4 h-4 text-indigo-500 shrink-0" />
                                <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                                  {lesson.order}. {lesson.title}
                                </h4>
                              </div>

                              <div className="flex items-center gap-2">
                                {lessonRes.length > 0 && (
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                                    {lessonRes.length} Resources
                                  </span>
                                )}
                                {isEnrolled && (
                                  <button
                                    type="button"
                                    onClick={handleContinueClick}
                                    className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <Play className="w-3 h-3 fill-current" />
                                    <span>Learn</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          COGNITIVE MASTERY & ASSESSMENT ARCHITECTURE
          ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-[#121724] border border-gray-200 dark:border-gray-800 space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Brain className="w-5 h-5" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Bayesian Knowledge Tracing (BKT) Criteria
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-gray-700 dark:text-gray-300">
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#182030] border border-gray-200/60 dark:border-gray-800">
              <span className="text-gray-400 block text-[10px]">Prior P(L_0)</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">20%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#182030] border border-gray-200/60 dark:border-gray-800">
              <span className="text-gray-400 block text-[10px]">Transit P(T)</span>
              <span className="font-bold text-gray-900 dark:text-white">15%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#182030] border border-gray-200/60 dark:border-gray-800">
              <span className="text-gray-400 block text-[10px]">Slip P(S)</span>
              <span className="font-bold text-gray-900 dark:text-white">10%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-gray-50 dark:bg-[#182030] border border-gray-200/60 dark:border-gray-800">
              <span className="text-gray-400 block text-[10px]">Guess P(G)</span>
              <span className="font-bold text-gray-900 dark:text-white">20%</span>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-[#121724] border border-gray-200 dark:border-gray-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Assessment Evaluation Sequence
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-gray-50 dark:bg-[#182030]">
              <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 font-mono font-bold text-[10px]">
                01
              </span>
              <span className="font-bold text-gray-900 dark:text-white">Diagnostic Entrance Exam</span>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-gray-50 dark:bg-[#182030]">
              <span className="px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 font-mono font-bold text-[10px]">
                02
              </span>
              <span className="font-bold text-gray-900 dark:text-white">Adaptive Deliberate Practice</span>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-gray-50 dark:bg-[#182030]">
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-[10px]">
                03
              </span>
              <span className="font-bold text-gray-900 dark:text-white">Server-Authoritative Final Exam</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
