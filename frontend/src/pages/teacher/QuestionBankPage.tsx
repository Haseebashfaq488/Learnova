import React, { useState, useMemo } from 'react';
import {
  ListChecks,
  Plus,
  Sparkles,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  Check,
  HelpCircle,
  X,
  FileCheck,
  BookOpen,
  Layers,
  Compass,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '../../components/ui/PageHeader';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { SearchFilterBar, ActiveChip, FilterOption } from '../../components/ui/SearchFilterBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { QuestionData, Course, Topic, Lesson, QuestionType, Difficulty } from '../../types';
import { CURRENT_TEACHER } from '../../services/storageService';

interface QuestionBankPageProps {
  questions: QuestionData[];
  courses: Course[];
  topics: Topic[];
  lessons: Lesson[];
  initialCourseId?: string;
  initialTopicId?: string;
  initialLessonId?: string;
  onNavigate: (page: string, params?: Record<string, string>) => void;
  onDeleteQuestion: (id: string) => void;
  onNotify: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export const QuestionBankPage: React.FC<QuestionBankPageProps> = ({
  questions,
  courses,
  topics,
  lessons,
  initialCourseId,
  initialTopicId,
  initialLessonId,
  onNavigate,
  onDeleteQuestion,
  onNotify,
}) => {
  // ==========================================
  // HIERARCHY LEVEL 1: Select Course
  // ==========================================
  const teacherCourses = useMemo(() => {
    const assigned = courses.filter((c) => c.creatorId === CURRENT_TEACHER.id);
    return assigned.length > 0 ? assigned : courses;
  }, [courses]);

  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    initialCourseId || teacherCourses[0]?.id || courses[0]?.id || ''
  );

  const activeCourse = useMemo(() => {
    return courses.find((c) => c.id === selectedCourseId) || courses[0];
  }, [courses, selectedCourseId]);

  // ==========================================
  // HIERARCHY LEVEL 2: Select Topic (within Course)
  // ==========================================
  const courseTopics = useMemo(() => {
    return topics
      .filter((t) => t.courseId === selectedCourseId)
      .sort((a, b) => a.order - b.order);
  }, [topics, selectedCourseId]);

  // 'all' represents viewing all topics, or a specific topic ID
  const [selectedTopicId, setSelectedTopicId] = useState<string>(() => {
    if (initialTopicId && courseTopics.some((t) => t.id === initialTopicId)) {
      return initialTopicId;
    }
    return courseTopics[0]?.id || 'all';
  });

  // When Course changes, update active topic
  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    const newTopics = topics
      .filter((t) => t.courseId === courseId)
      .sort((a, b) => a.order - b.order);
    setSelectedTopicId(newTopics[0]?.id || 'all');
  };

  // Search & Filter controls
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Expand/collapse state for lesson categories (default: all expanded)
  const [collapsedLessonIds, setCollapsedLessonIds] = useState<Record<string, boolean>>({});

  const [previewQuestion, setPreviewQuestion] = useState<QuestionData | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Filter questions for the selected course
  const courseQuestions = useMemo(() => {
    return questions.filter((q) => q.courseId === selectedCourseId);
  }, [questions, selectedCourseId]);

  // Apply search query, question type, difficulty, and status filters
  const filteredQuestions = useMemo(() => {
    return courseQuestions.filter((q) => {
      const matchesSearch =
        !searchQuery ||
        q.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (q.explanation && q.explanation.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = !typeFilter || q.type === typeFilter;
      const matchesDifficulty = !difficultyFilter || q.difficulty === difficultyFilter;
      const matchesStatus = !statusFilter || q.status === statusFilter;
      return matchesSearch && matchesType && matchesDifficulty && matchesStatus;
    });
  }, [courseQuestions, searchQuery, typeFilter, difficultyFilter, statusFilter]);

  // Active topics to display based on topic selection ('all' or specific topic)
  const displayedTopics = useMemo(() => {
    if (selectedTopicId === 'all') {
      return courseTopics;
    }
    const single = courseTopics.filter((t) => t.id === selectedTopicId);
    return single.length > 0 ? single : courseTopics;
  }, [courseTopics, selectedTopicId]);

  // Toggle category collapse
  const toggleLessonCollapse = (key: string) => {
    setCollapsedLessonIds((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const expandAllCategories = () => {
    setCollapsedLessonIds({});
  };

  const collapseAllCategories = () => {
    const allCollapsed: Record<string, boolean> = {};
    for (const t of courseTopics) {
      allCollapsed[`topic-${t.id}`] = true;
      const tLessons = lessons.filter((l) => l.topicId === t.id && l.courseId === selectedCourseId);
      for (const l of tLessons) {
        allCollapsed[`lesson-${l.id}`] = true;
      }
    }
    allCollapsed['general'] = true;
    setCollapsedLessonIds(allCollapsed);
  };

  const activeChips: ActiveChip[] = [];
  if (typeFilter) {
    activeChips.push({
      id: 'type',
      label: `Type: ${typeFilter.replace('_', ' ')}`,
      onRemove: () => setTypeFilter(''),
    });
  }
  if (difficultyFilter) {
    activeChips.push({
      id: 'difficulty',
      label: `Difficulty: ${difficultyFilter}`,
      onRemove: () => setDifficultyFilter(''),
    });
  }
  if (statusFilter) {
    activeChips.push({
      id: 'status',
      label: `Status: ${statusFilter}`,
      onRemove: () => setStatusFilter(''),
    });
  }

  const filters: FilterOption[] = [
    {
      id: 'type',
      label: 'Question Type',
      value: typeFilter,
      onChange: setTypeFilter,
      options: [
        { value: 'multiple_choice', label: 'Multiple Choice' },
        { value: 'true_false', label: 'True / False' },
        { value: 'fill_blank', label: 'Fill in the Blank' },
        { value: 'matching', label: 'Matching Pairs' },
        { value: 'short_answer', label: 'Short Answer' },
      ],
    },
    {
      id: 'difficulty',
      label: 'Difficulty',
      value: difficultyFilter,
      onChange: setDifficultyFilter,
      options: [
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' },
      ],
    },
    {
      id: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: 'approved', label: 'Approved' },
        { value: 'pending_review', label: 'Pending Review' },
        { value: 'draft', label: 'Draft' },
      ],
    },
  ];

  const handleDeleteConfirm = () => {
    if (confirmDeleteId) {
      onDeleteQuestion(confirmDeleteId);
      setConfirmDeleteId(null);
      onNotify('info', 'Question removed from question bank.');
    }
  };

  const formatTypeLabel = (type: QuestionType) => {
    switch (type) {
      case 'multiple_choice':
        return 'Multiple Choice';
      case 'true_false':
        return 'True / False';
      case 'fill_blank':
        return 'Fill in the Blank';
      case 'matching':
        return 'Matching';
      case 'short_answer':
        return 'Short Answer';
      default:
        return type;
    }
  };

  const getDifficultyBadge = (diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return (
          <span className="text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
            Easy
          </span>
        );
      case 'medium':
        return (
          <span className="text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
            Medium
          </span>
        );
      case 'hard':
        return (
          <span className="text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
            Hard
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Question Bank"
        description="Explore, create, and organize reusable assessment items following the strict curriculum hierarchy: Course -> Topic -> Lesson."
        primaryAction={
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              leftIcon={<Sparkles className="w-4 h-4 text-[#3156D3]" />}
              onClick={() => {
                const navParams: Record<string, string> = { courseId: selectedCourseId };
                if (selectedTopicId !== 'all') navParams.topicId = selectedTopicId;
                onNavigate('ai_review', navParams);
              }}
            >
              Generate with AI
            </Button>
            <Button
              variant="primary"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                const navParams: Record<string, string> = { courseId: selectedCourseId };
                if (selectedTopicId !== 'all') navParams.topicId = selectedTopicId;
                onNavigate('question_editor', navParams);
              }}
            >
              Create question
            </Button>
          </div>
        }
      />

      {/* ==================================================== */}
      {/* STEP 1: Select Course                                */}
      {/* ==================================================== */}
      <div className="bg-white rounded-xl border border-[#D9DEE7] p-5 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-[#D9DEE7]">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#3156D3] text-white flex items-center justify-center text-xs font-bold">
              1
            </span>
            <BookOpen className="w-4 h-4 text-[#3156D3]" />
            <h2 className="text-sm font-bold text-[#1F2937]">Step 1: Select Course</h2>
          </div>
          <span className="text-[11px] text-[#737D8C]">
            Signed-in Teacher: <strong className="text-[#1F2937]">{CURRENT_TEACHER.name}</strong>
          </span>
        </div>

        <p className="text-xs text-[#5B6472]">
          Choose the course to inspect question categories:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {courses.map((c) => {
            const isSelected = c.id === selectedCourseId;
            const isAssigned = c.creatorId === CURRENT_TEACHER.id;
            const countInCourse = questions.filter((q) => q.courseId === c.id).length;
            const tCount = topics.filter((t) => t.courseId === c.id).length;
            const lCount = lessons.filter((l) => l.courseId === c.id).length;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleCourseChange(c.id)}
                className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#3156D3] bg-[#F4F6FF] ring-2 ring-[#3156D3]/20 shadow-xs'
                    : 'border-[#D9DEE7] bg-white hover:border-gray-300 hover:bg-gray-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isAssigned
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {isAssigned ? 'My Course' : 'Authorized'}
                    </span>
                    <span className="text-[10px] font-bold text-[#3156D3] bg-white px-2 py-0.5 rounded border border-[#3156D3]/20">
                      {countInCourse} Question{countInCourse !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-[#1F2937] line-clamp-2 mt-1">
                    {c.title}
                  </h3>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#737D8C]">
                  <span>
                    {tCount} Topics • {lCount} Lessons
                  </span>
                  <span className={`font-semibold ${isSelected ? 'text-[#3156D3]' : 'text-gray-400'}`}>
                    {isSelected ? 'Active Course ✓' : 'Select →'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================================================== */}
      {/* STEP 2: Select Topic                                 */}
      {/* ==================================================== */}
      <div className="bg-white rounded-xl border border-[#D9DEE7] p-5 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between pb-2 border-b border-[#D9DEE7]">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#3156D3] text-white flex items-center justify-center text-xs font-bold">
              2
            </span>
            <Layers className="w-4 h-4 text-[#3156D3]" />
            <h2 className="text-sm font-bold text-[#1F2937]">
              Step 2: Select Topic in "{activeCourse?.title}"
            </h2>
          </div>
          <span className="text-xs text-[#737D8C]">
            Filter questions by curriculum topic
          </span>
        </div>

        <p className="text-xs text-[#5B6472]">
          Select a specific topic to view its lessons, or choose "All Topics":
        </p>

        {courseTopics.length === 0 ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            No topics defined for this course. Please create topics in Curriculum Editor.
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedTopicId('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 border ${
                selectedTopicId === 'all'
                  ? 'bg-[#3156D3] text-white border-[#3156D3] shadow-xs'
                  : 'bg-white text-[#5B6472] border-[#D9DEE7] hover:bg-gray-50'
              }`}
            >
              <span>All Topics ({courseTopics.length})</span>
            </button>

            {courseTopics.map((t) => {
              const isSelected = selectedTopicId === t.id;
              const qCountInTopic = filteredQuestions.filter((q) => q.topicId === t.id).length;
              const lCountInTopic = lessons.filter(
                (l) => l.topicId === t.id && l.courseId === selectedCourseId
              ).length;

              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTopicId(t.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-[#E8EEFF] text-[#2646B8] border-[#3156D3] ring-1 ring-[#3156D3]'
                      : 'bg-white text-[#5B6472] border-[#D9DEE7] hover:bg-gray-50'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold opacity-75">T{t.order}:</span>
                  <span>{t.title}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-white text-[#2646B8]' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {qCountInTopic} Qs • {lCountInTopic} Ls
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* SEARCH & FILTERS BAR                                 */}
      {/* ==================================================== */}
      <div className="space-y-3">
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search questions by prompt or keywords..."
          filters={filters}
          activeChips={activeChips}
          onClearAll={() => {
            setSearchQuery('');
            setTypeFilter('');
            setDifficultyFilter('');
            setStatusFilter('');
          }}
        />

        <div className="flex items-center justify-between text-xs text-[#737D8C] px-1">
          <span>
            Showing <strong>{filteredQuestions.length}</strong> questions across{' '}
            <strong>{displayedTopics.length}</strong> topic{displayedTopics.length !== 1 ? 's' : ''} for{' '}
            <strong className="text-[#1F2937]">{activeCourse?.title}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={expandAllCategories}
              className="text-[#3156D3] hover:underline cursor-pointer"
            >
              Expand All
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={collapseAllCategories}
              className="text-[#3156D3] hover:underline cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* STEP 3: Lessons under each Topic                     */}
      {/* ==================================================== */}
      {displayedTopics.length === 0 ? (
        <EmptyState
          icon={<ListChecks className="w-6 h-6" />}
          title="No topics match your selection"
          description="Select an authorized course with configured curriculum topics."
          actionLabel="Open Curriculum Editor"
          onAction={() => onNavigate('curriculum', { courseId: selectedCourseId })}
        />
      ) : (
        <div className="space-y-6">
          {displayedTopics.map((topic) => {
            const topicLessons = lessons
              .filter((l) => l.topicId === topic.id && l.courseId === selectedCourseId)
              .sort((a, b) => a.order - b.order);

            const topicQuestions = filteredQuestions.filter((q) => q.topicId === topic.id);
            const topicCollapsedKey = `topic-${topic.id}`;
            const isTopicCollapsed = !!collapsedLessonIds[topicCollapsedKey];

            return (
              <div
                key={topic.id}
                className="bg-white rounded-xl border border-[#D9DEE7] overflow-hidden shadow-2xs space-y-4 p-5"
              >
                {/* Topic Header */}
                <div
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#D9DEE7] cursor-pointer select-none"
                  onClick={() => toggleLessonCollapse(topicCollapsedKey)}
                >
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      className="p-1 rounded text-gray-500 hover:bg-gray-100 transition"
                      aria-label={isTopicCollapsed ? 'Expand topic' : 'Collapse topic'}
                    >
                      {isTopicCollapsed ? (
                        <ChevronRight className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="text-[10px] font-bold text-[#3156D3] bg-[#E8EEFF] px-2 py-0.5 rounded border border-[#3156D3]/20">
                          Topic {topic.order}
                        </span>
                        <h3 className="text-sm font-bold text-[#1F2937]">{topic.title}</h3>
                        <span className="text-[10px] bg-gray-100 text-gray-700 font-semibold px-2 py-0.5 rounded">
                          {topicQuestions.length} Questions
                        </span>
                      </div>
                      <p className="text-[11px] text-[#737D8C] line-clamp-1">
                        {topic.description || 'Curriculum unit'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#3156D3]" />}
                      onClick={() =>
                        onNavigate('ai_review', {
                          courseId: selectedCourseId,
                          topicId: topic.id,
                        })
                      }
                    >
                      AI Generate for Topic
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                      onClick={() =>
                        onNavigate('question_editor', {
                          courseId: selectedCourseId,
                          topicId: topic.id,
                        })
                      }
                    >
                      Add Question
                    </Button>
                  </div>
                </div>

                {/* Lessons for this Topic */}
                {!isTopicCollapsed && (
                  <div className="space-y-4 pl-0 sm:pl-2">
                    {topicLessons.length === 0 ? (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs text-[#5B6472] text-center">
                        <p className="font-semibold">No lessons defined for this topic</p>
                        <p className="mt-0.5 text-[#737D8C]">
                          Add lessons to "{topic.title}" in the Curriculum Editor to structure questions per lesson.
                        </p>
                      </div>
                    ) : (
                      topicLessons.map((lesson) => {
                        const lessonKey = `lesson-${lesson.id}`;
                        const isLessonCollapsed = !!collapsedLessonIds[lessonKey];

                        // Match questions strictly by lessonId or fallback topic matching
                        const lessonQList = filteredQuestions.filter(
                          (q) => q.lessonId === lesson.id || (!q.lessonId && q.topicId === topic.id)
                        );

                        const easyCount = lessonQList.filter((q) => q.difficulty === 'easy').length;
                        const medCount = lessonQList.filter((q) => q.difficulty === 'medium').length;
                        const hardCount = lessonQList.filter((q) => q.difficulty === 'hard').length;

                        return (
                          <div
                            key={lesson.id}
                            className="bg-[#F8FAFC] rounded-xl border border-[#D9DEE7] overflow-hidden"
                          >
                            {/* Lesson Category Header */}
                            <div
                              className="p-3.5 bg-gray-50 border-b border-[#D9DEE7] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer select-none hover:bg-gray-100/70 transition-colors"
                              onClick={() => toggleLessonCollapse(lessonKey)}
                            >
                              <div className="flex items-center gap-2.5">
                                <button
                                  type="button"
                                  className="p-1 rounded text-gray-500 hover:bg-white transition"
                                  aria-label={isLessonCollapsed ? 'Expand lesson' : 'Collapse lesson'}
                                >
                                  {isLessonCollapsed ? (
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  )}
                                </button>

                                <div>
                                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                    <span className="text-[10px] font-bold text-[#3156D3] bg-white px-2 py-0.5 rounded border border-[#3156D3]/20">
                                      Lesson {lesson.order}
                                    </span>
                                    <span className="text-xs font-bold text-[#1F2937]">
                                      {lesson.title}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-[#737D8C] line-clamp-1">
                                    {lesson.description}
                                  </p>
                                </div>
                              </div>

                              <div
                                className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex items-center gap-1.5 text-[10px] font-medium mr-1">
                                  <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                                    {easyCount} Easy
                                  </span>
                                  <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                                    {medCount} Med
                                  </span>
                                  <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                                    {hardCount} Hard
                                  </span>
                                  <span className="bg-white text-gray-700 font-bold px-2 py-0.5 rounded border">
                                    {lessonQList.length} Total
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#3156D3]" />}
                                    onClick={() =>
                                      onNavigate('ai_review', {
                                        courseId: selectedCourseId,
                                        topicId: topic.id,
                                        lessonId: lesson.id,
                                      })
                                    }
                                    title="Generate questions for this lesson"
                                  >
                                    AI Generate
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    size="sm"
                                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                                    onClick={() =>
                                      onNavigate('question_editor', {
                                        courseId: selectedCourseId,
                                        topicId: topic.id,
                                        lessonId: lesson.id,
                                      })
                                    }
                                    title="Add question to this lesson"
                                  >
                                    Add
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* Questions for This Lesson */}
                            {!isLessonCollapsed && (
                              <div className="bg-white">
                                {lessonQList.length === 0 ? (
                                  <div className="p-6 text-center text-xs text-[#5B6472]">
                                    <p className="font-semibold text-[#1F2937]">
                                      No questions created for this lesson yet
                                    </p>
                                    <p className="mt-1 text-[#737D8C] max-w-sm mx-auto">
                                      Anchor questions directly to "{lesson.title}" through manual authoring or AI generation.
                                    </p>
                                    <div className="flex items-center justify-center gap-2 mt-3">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#3156D3]" />}
                                        onClick={() =>
                                          onNavigate('ai_review', {
                                            courseId: selectedCourseId,
                                            topicId: topic.id,
                                            lessonId: lesson.id,
                                          })
                                        }
                                      >
                                        Generate with AI
                                      </Button>
                                      <Button
                                        variant="secondary"
                                        size="sm"
                                        leftIcon={<Plus className="w-3.5 h-3.5" />}
                                        onClick={() =>
                                          onNavigate('question_editor', {
                                            courseId: selectedCourseId,
                                            topicId: topic.id,
                                            lessonId: lesson.id,
                                          })
                                        }
                                      >
                                        Add Question
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                      <thead>
                                        <tr className="bg-white border-b border-[#D9DEE7] text-[11px] font-semibold text-[#5B6472]">
                                          <th scope="col" className="py-2.5 px-5">Question Prompt</th>
                                          <th scope="col" className="py-2.5 px-3">Type</th>
                                          <th scope="col" className="py-2.5 px-3">Difficulty</th>
                                          <th scope="col" className="py-2.5 px-3">Status</th>
                                          <th scope="col" className="py-2.5 px-3 text-center">Pts</th>
                                          <th scope="col" className="py-2.5 px-5 text-right">Actions</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-[#D9DEE7] text-xs">
                                        {lessonQList.map((q) => (
                                          <tr key={q.id} className="hover:bg-[#F9FAFB] transition-colors group">
                                            <td className="py-3 px-5 max-w-md">
                                              <button
                                                type="button"
                                                onClick={() => setPreviewQuestion(q)}
                                                className="font-medium text-[#1F2937] group-hover:text-[#3156D3] text-left transition-colors cursor-pointer text-xs line-clamp-2"
                                              >
                                                {q.prompt}
                                              </button>
                                              {q.source === 'ai_generated' && (
                                                <span className="inline-flex items-center gap-1 text-[10px] text-[#2646B8] bg-[#E8EEFF] px-1.5 py-0.2 rounded mt-1 font-medium">
                                                  <Sparkles className="w-2.5 h-2.5" />
                                                  AI Candidate (Approved)
                                                </span>
                                              )}
                                            </td>
                                            <td className="py-3 px-3">
                                              <span className="font-medium text-[#1F2937] bg-gray-100 px-2 py-0.5 rounded border border-gray-200 text-[11px]">
                                                {formatTypeLabel(q.type)}
                                              </span>
                                            </td>
                                            <td className="py-3 px-3">{getDifficultyBadge(q.difficulty)}</td>
                                            <td className="py-3 px-3">
                                              <StatusBadge status={q.status} />
                                            </td>
                                            <td className="py-3 px-3 text-center font-semibold text-[#1F2937]">
                                              {q.points || 1}
                                            </td>
                                            <td className="py-3 px-5 text-right">
                                              <div className="flex items-center justify-end gap-1">
                                                <Button
                                                  variant="ghost"
                                                  size="sm"
                                                  leftIcon={<Eye className="w-3.5 h-3.5" />}
                                                  onClick={() => setPreviewQuestion(q)}
                                                >
                                                  Preview
                                                </Button>
                                                <button
                                                  onClick={() =>
                                                    onNavigate('question_editor', {
                                                      questionId: q.id,
                                                      courseId: selectedCourseId,
                                                      topicId: topic.id,
                                                      lessonId: lesson.id,
                                                    })
                                                  }
                                                  className="p-1.5 text-[#5B6472] hover:text-[#1F2937] hover:bg-gray-100 rounded cursor-pointer transition-colors"
                                                  title="Edit question"
                                                  aria-label={`Edit ${q.prompt}`}
                                                >
                                                  <Edit3 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                  onClick={() => setConfirmDeleteId(q.id)}
                                                  className="p-1.5 text-[#5B6472] hover:text-[#B42318] hover:bg-[#FEF0EF] rounded cursor-pointer transition-colors"
                                                  title="Delete question"
                                                  aria-label={`Delete ${q.prompt}`}
                                                >
                                                  <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Question Preview Modal (Student View + Teacher Answer Key View) */}
      {previewQuestion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-[#D9DEE7] max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9DEE7]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold bg-[#E8EEFF] text-[#2646B8] px-2 py-0.5 rounded">
                  {formatTypeLabel(previewQuestion.type)}
                </span>
                <span className="text-xs text-[#737D8C]">• {previewQuestion.points || 1} pts</span>
              </div>
              <button
                onClick={() => setPreviewQuestion(null)}
                className="p-1 text-[#5B6472] hover:bg-gray-100 rounded-lg cursor-pointer"
                aria-label="Close preview"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 overflow-y-auto flex-1 space-y-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#737D8C] tracking-wider block mb-1">
                  Question Prompt (Student View)
                </span>
                <p className="text-sm font-semibold text-[#1F2937] leading-relaxed">
                  {previewQuestion.prompt}
                </p>
              </div>

              {/* Type-specific preview representation */}
              {previewQuestion.type === 'multiple_choice' && (
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold text-[#5B6472]">Options:</span>
                  {(previewQuestion.options || []).map((opt, i) => (
                    <div
                      key={opt.id}
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                        opt.isCorrect
                          ? 'bg-[#EAF7F0] border-[#18794E]/40 text-[#18794E] font-medium'
                          : 'bg-gray-50 border-gray-200 text-[#1F2937]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-white border flex items-center justify-center font-bold text-[10px]">
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span>{opt.text}</span>
                      </div>
                      {opt.isCorrect && (
                        <span className="text-[10px] uppercase font-bold text-[#18794E] flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Correct Answer
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {previewQuestion.type === 'true_false' && (
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold text-[#5B6472]">Answer Choices:</span>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className={`p-3 rounded-lg border text-center font-semibold flex items-center justify-center gap-1.5 ${
                        previewQuestion.correctBool === true
                          ? 'bg-[#EAF7F0] border-[#18794E] text-[#18794E]'
                          : 'bg-gray-50 border-gray-200 text-gray-500'
                      }`}
                    >
                      <span>True</span>
                      {previewQuestion.correctBool === true && (
                        <span className="text-xs font-bold flex items-center gap-0.5">
                          (<Check className="w-3.5 h-3.5 inline" /> Correct)
                        </span>
                      )}
                    </div>
                    <div
                      className={`p-3 rounded-lg border text-center font-semibold flex items-center justify-center gap-1.5 ${
                        previewQuestion.correctBool === false
                          ? 'bg-[#EAF7F0] border-[#18794E] text-[#18794E]'
                          : 'bg-gray-50 border-gray-200 text-gray-500'
                      }`}
                    >
                      <span>False</span>
                      {previewQuestion.correctBool === false && (
                        <span className="text-xs font-bold flex items-center gap-0.5">
                          (<Check className="w-3.5 h-3.5 inline" /> Correct)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {previewQuestion.type === 'fill_blank' && (
                <div className="space-y-2 bg-[#F5F7FA] p-3 rounded-lg border border-[#D9DEE7]">
                  <span className="text-[10px] font-semibold text-[#5B6472]">Accepted Answer(s):</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {(previewQuestion.acceptedAnswers || []).map((ans, i) => (
                      <span
                        key={i}
                        className="bg-white border border-[#18794E]/30 text-[#18794E] font-mono font-bold px-2 py-1 rounded"
                      >
                        {ans}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-[#737D8C] block mt-1">
                    Case sensitivity: {previewQuestion.caseSensitive ? 'Enforced' : 'Case-insensitive'}
                  </span>
                </div>
              )}

              {previewQuestion.type === 'matching' && (
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold text-[#5B6472]">Target Matching Pairs:</span>
                  <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                    {(previewQuestion.matchingPairs || []).map((pair) => (
                      <div key={pair.id} className="grid grid-cols-2 p-2.5 text-xs bg-white">
                        <span className="font-semibold text-[#1F2937] pr-2 border-r">{pair.left}</span>
                        <span className="text-[#5B6472] pl-2">{pair.right}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {previewQuestion.type === 'short_answer' && (
                <div className="p-3 bg-[#F5F7FA] rounded-lg border border-[#D9DEE7] space-y-1">
                  <span className="text-[10px] font-bold text-[#5B6472] uppercase">
                    Teacher Grading Rubric &amp; Criteria:
                  </span>
                  <p className="text-xs text-[#1F2937] leading-relaxed whitespace-pre-wrap">
                    {previewQuestion.expectedRubric}
                  </p>
                </div>
              )}

              {previewQuestion.explanation && (
                <div className="p-3 rounded-lg bg-[#EFF8FF] border border-[#175CD3]/20">
                  <span className="text-[10px] font-bold text-[#175CD3] uppercase">
                    Pedagogical Explanation:
                  </span>
                  <p className="text-xs text-[#1F2937] mt-0.5 leading-relaxed">
                    {previewQuestion.explanation}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#D9DEE7] flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const q = previewQuestion;
                  setPreviewQuestion(null);
                  const navParams: Record<string, string> = {
                    questionId: q.id,
                    courseId: selectedCourseId,
                    topicId: q.topicId,
                  };
                  if (q.lessonId) navParams.lessonId = q.lessonId;
                  onNavigate('question_editor', navParams);
                }}
              >
                Edit in editor
              </Button>
              <Button variant="secondary" size="sm" onClick={() => setPreviewQuestion(null)}>
                Close preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Question Confirmation */}
      <ConfirmDialog
        isOpen={!!confirmDeleteId}
        title="Delete question from bank?"
        consequence="This item will be permanently removed from the question repository. If it is currently used in active published assessments, grading logs will retain snapshot records."
        isDestructive
        confirmLabel="Delete question"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </div>
  );
};
