import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Layers,
  Award,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Course, Topic, Lesson } from '../../types';

interface CourseCarouselProps {
  courses: Course[];
  topics: Topic[];
  lessons: Lesson[];
  onSelectCourse: (courseId: string) => void;
}

export const CourseCarousel: React.FC<CourseCarouselProps> = ({
  courses,
  topics,
  lessons,
  onSelectCourse,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const totalCourses = courses.length;

  // Auto-advance every 5.5 seconds unless paused
  useEffect(() => {
    if (isPaused || totalCourses <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalCourses);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, totalCourses]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalCourses) % totalCourses);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalCourses);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Academic Courses Carousel"
    >
      {/* Navigation Controls Bar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Canonical Academic Curriculum
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Explore university-level computer science sequences structured by Directed Acyclic Graphs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151B28] text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-2xs hover:shadow-sm active:scale-95 transition-all cursor-pointer"
            aria-label="Previous course"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151B28] text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-2xs hover:shadow-sm active:scale-95 transition-all cursor-pointer"
            aria-label="Next course"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slide Container with Smooth Translation */}
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {courses.map((course, idx) => {
            const courseTopics = topics.filter((t) => t.courseId === course.id);
            const courseLessons = lessons.filter((l) => l.courseId === course.id);
            const avgThreshold =
              courseTopics.length > 0
                ? Math.round(
                    courseTopics.reduce((acc, t) => acc + (t.masteryThreshold || 75), 0) /
                      courseTopics.length
                  )
                : 80;

            const isCurrent = idx === activeIndex;

            return (
              <div
                key={course.id}
                className="w-full shrink-0 px-1"
                aria-hidden={!isCurrent}
              >
                <div className="relative p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#121724] border border-gray-200/90 dark:border-gray-800 shadow-lg interactive-card transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Course Information Column */}
                    <div className="lg:col-span-8 space-y-4">
                      {/* Department and Course ID Badge */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                          {course.id.replace('course-', '').toUpperCase()}
                        </span>
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {course.creatorDepartment || 'Faculty of Computer Science'}
                        </span>
                        <span className="text-gray-300 dark:text-gray-700">·</span>
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Authoritative Syllabus
                        </span>
                      </div>

                      {/* Course Title */}
                      <h4 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-snug">
                        {course.title}
                      </h4>

                      {/* Course Description */}
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">
                        {course.description}
                      </p>

                      {/* Meaningful Metrics and Badges */}
                      <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-gray-600 dark:text-gray-300 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-indigo-500" />
                          <span>{courseTopics.length || 5} DAG Topics</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-emerald-500" />
                          <span>{courseLessons.length || 15} Practical Lessons</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-amber-500" />
                          <span>{avgThreshold}% Mastery Target</span>
                        </div>
                      </div>
                    </div>

                    {/* Instructor & CTA Action Column */}
                    <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-xl bg-gray-50 dark:bg-[#171E2D] border border-gray-200/70 dark:border-gray-800 space-y-5">
                      {/* Instructor Profile */}
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 block mb-2">
                          Course Director
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-sm shadow-sm">
                            {course.creatorAvatar ||
                              course.creatorName
                                ?.split(' ')
                                .map((n) => n[0])
                                .join('') ||
                              'FC'}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-gray-900 dark:text-white block">
                              {course.creatorName}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 block truncate max-w-[180px]">
                              {course.creatorEmail || 'faculty@learnova.edu'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Professional Action Button */}
                      <button
                        type="button"
                        onClick={() => onSelectCourse(course.id)}
                        className="w-full group/btn flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-95 transition-all duration-150 cursor-pointer"
                      >
                        <span>Inspect Course Syllabus</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Indicator Dots */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {courses.map((_, dotIdx) => {
          const isActive = dotIdx === activeIndex;
          return (
            <button
              key={dotIdx}
              type="button"
              onClick={() => setActiveIndex(dotIdx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'w-8 bg-indigo-600 dark:bg-indigo-400'
                  : 'w-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
              }`}
              aria-label={`Go to course slide ${dotIdx + 1}`}
              aria-current={isActive}
            />
          );
        })}
      </div>
    </div>
  );
};
