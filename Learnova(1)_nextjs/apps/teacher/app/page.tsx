'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  TeacherLayout,
  TeacherNavigationPage,
} from '../components/TeacherLayout';

// Teacher 12 Pages
import { DashboardPage as TeacherDashboardPage } from '../views/DashboardPage';
import { CoursesPage } from '../views/CoursesPage';
import { CourseOverviewPage } from '../views/CourseOverviewPage';
import { CurriculumEditorPage } from '../views/CurriculumEditorPage';
import { PrerequisiteManagerPage } from '../views/PrerequisiteManagerPage';
import { ResourceManagerPage } from '../views/ResourceManagerPage';
import { QuestionBankPage } from '../views/QuestionBankPage';
import { QuestionEditorPage } from '../views/QuestionEditorPage';
import { AIReviewPage } from '../views/AIReviewPage';
import { AssessmentsPage } from '../views/AssessmentsPage';
import { AssessmentEditorPage } from '../views/AssessmentEditorPage';
import { AnalyticsPage } from '../views/AnalyticsPage';

// Shared APIs and Types
import { teacherApi, mapBackendQuestionToQuestionData, mapBackendAssessmentToAssessment } from '../services/api/teacherApi';
import { coursesApi, mapBackendCourseToCourse } from '../services/api/coursesApi';
import { aiApi } from '../services/api/aiApi';
import { storage } from '../services/storageService';

import {
  Course,
  Topic,
  Lesson,
  LearningResource,
  QuestionData,
  AICandidateQuestion,
  Assessment,
  AssessmentAttempt,
  StudentUser,
  MasteryState,
} from '../types';

export default function TeacherApp() {
  const [teacherPage, setTeacherPage] = useState<TeacherNavigationPage>('overview');
  const [teacherNavParams, setTeacherNavParams] = useState<Record<string, string>>({});

  // Data Records
  const [courses, setCourses] = useState<Course[]>(() => storage.getCourses());
  const [topics, setTopics] = useState<Topic[]>(() => storage.getTopics());
  const [lessons, setLessons] = useState<Lesson[]>(() => storage.getLessons());
  const [resources, setResources] = useState<LearningResource[]>(() => storage.getResources());
  const [questions, setQuestions] = useState<QuestionData[]>(() => storage.getQuestions());
  const [candidates, setCandidates] = useState<AICandidateQuestion[]>(() => storage.getCandidateQuestions());
  const [assessments, setAssessments] = useState<Assessment[]>(() => storage.getAssessments());
  const [students] = useState<StudentUser[]>(() => storage.getStudents());
  const [attempts] = useState<AssessmentAttempt[]>(() => storage.getAttempts());
  const [masteryStates] = useState<MasteryState[]>(() => storage.getMasteryStates());

  // Toast notifications
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; msg: string } | null>(null);

  const notify = useCallback((type: 'success' | 'error' | 'info', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleTeacherNavigate = useCallback((page: TeacherNavigationPage, params?: Record<string, string>) => {
    setTeacherPage(page);
    if (params) {
      setTeacherNavParams(params);
    }
  }, []);

  // Hydrate courses and questions from backend
  const refreshTeacherData = useCallback(async () => {
    try {
      const liveCourses = await coursesApi.listCourses();
      if (liveCourses.length > 0) {
        setCourses(liveCourses.map(mapBackendCourseToCourse));
      }
      const liveQuestions = await teacherApi.listQuestions();
      if (liveQuestions.length > 0) {
        setQuestions(liveQuestions.map(mapBackendQuestionToQuestionData));
      }
      const liveAssessments = await teacherApi.listAssessments();
      if (liveAssessments.length > 0) {
        setAssessments(liveAssessments.map(mapBackendAssessmentToAssessment));
      }
    } catch (err) {
      // Offline fallback
    }
  }, []);

  useEffect(() => {
    refreshTeacherData();
  }, [refreshTeacherData]);

  const handleSaveCourse = async (c: Course) => {
    try {
      const updated = await teacherApi.updateCourse(c.id, {
        title: c.title,
        description: c.description,
        is_published: c.isPublished,
      });
      setCourses((prev) => prev.map((item) => (item.id === c.id ? { ...item, ...c } : item)));
      notify('success', 'Course updated successfully.');
    } catch {
      storage.saveCourse(c);
      setCourses(storage.getCourses());
      notify('success', 'Course updated.');
    }
  };

  const handleSaveTopic = async (t: Topic) => {
    storage.saveTopic(t);
    setTopics(storage.getTopics());
    notify('success', 'Topic saved.');
  };

  const handleDeleteTopic = (id: string) => {
    storage.deleteTopic(id);
    setTopics(storage.getTopics());
    notify('info', 'Topic deleted.');
  };

  const handleSaveLesson = async (l: Lesson) => {
    storage.saveLesson(l);
    setLessons(storage.getLessons());
    notify('success', 'Lesson saved.');
  };

  const handleDeleteLesson = (id: string) => {
    storage.deleteLesson(id);
    setLessons(storage.getLessons());
    notify('info', 'Lesson deleted.');
  };

  const handleSaveResource = async (r: LearningResource) => {
    storage.saveResource(r);
    setResources(storage.getResources());
    notify('success', 'Resource saved.');
  };

  const handleDeleteResource = (id: string) => {
    storage.deleteResource(id);
    setResources(storage.getResources());
    notify('info', 'Resource deleted.');
  };

  const handleSaveQuestion = async (q: QuestionData) => {
    storage.saveQuestion(q);
    setQuestions(storage.getQuestions());
    notify('success', 'Question saved to bank.');
  };

  const handleDeleteQuestion = (id: string) => {
    storage.deleteQuestion(id);
    setQuestions(storage.getQuestions());
    notify('info', 'Question removed.');
  };

  const handleSaveAssessment = async (a: Assessment) => {
    storage.saveAssessment(a);
    setAssessments(storage.getAssessments());
    notify('success', 'Assessment configuration saved.');
  };

  const handleDeleteAssessment = (id: string) => {
    storage.deleteAssessment(id);
    setAssessments(storage.getAssessments());
    notify('info', 'Assessment removed.');
  };

  const handleSaveGeneratedCandidates = (newCandidates: AICandidateQuestion[]) => {
    setCandidates((prev) => [...newCandidates, ...prev]);
    newCandidates.forEach((c) => storage.saveCandidateQuestion(c));
    notify('success', `Saved ${newCandidates.length} generated candidate questions.`);
  };

  const handleUpdateCandidateStatus = async (id: string, status: 'approved' | 'rejected', reason?: string) => {
    if (status === 'approved') {
      try {
        await aiApi.approveCandidate(id);
      } catch {}
      const cand = candidates.find((c) => c.id === id);
      if (cand) {
        const approvedQ: QuestionData = {
          id: `q-${Date.now()}`,
          courseId: cand.courseId,
          topicId: cand.topicId,
          prompt: cand.prompt,
          type: cand.type,
          difficulty: cand.difficulty,
          points: cand.points,
          explanation: cand.explanation,
          sourceContext: cand.sourceContext,
          options: cand.options,
          correctBool: cand.correctBool,
          acceptedAnswers: cand.acceptedAnswers,
          matchingPairs: cand.matchingPairs,
          expectedRubric: cand.expectedRubric,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        handleSaveQuestion(approvedQ);
      }
    }
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, status, rejectionReason: reason } : c)));
    notify(status === 'approved' ? 'success' : 'info', `Candidate question ${status}.`);
  };

  return (
    <TeacherLayout
      currentPage={teacherPage}
      onNavigate={handleTeacherNavigate}
      onSwitchPortal={() => { window.location.href = 'http://localhost:3001'; }}
      onSwitchToAdmin={() => { window.location.href = 'http://localhost:3003'; }}
      toast={toast}
      onDismissToast={() => setToast(null)}
      breadcrumbs={[{ label: 'Teacher Portal', page: 'overview' }, { label: teacherPage }]}
    >
      {teacherPage === 'overview' && (
        <TeacherDashboardPage
          courses={courses}
          topics={topics}
          lessons={lessons}
          questions={questions}
          candidates={candidates}
          assessments={assessments}
          students={students}
          attempts={attempts}
          masteryStates={masteryStates}
          onNavigate={handleTeacherNavigate}
        />
      )}

      {teacherPage === 'courses' && (
        <CoursesPage
          courses={courses}
          topics={topics}
          lessons={lessons}
          onSaveCourse={handleSaveCourse}
          onNavigate={handleTeacherNavigate}
          onNotify={notify}
        />
      )}

      {teacherPage === 'course_overview' && (
        <CourseOverviewPage
          courseId={teacherNavParams.courseId || courses[0]?.id || ''}
          courses={courses}
          topics={topics}
          lessons={lessons}
          resources={resources}
          onNavigate={handleTeacherNavigate}
          onSaveCourse={handleSaveCourse}
          onNotify={notify}
        />
      )}

      {teacherPage === 'curriculum_editor' && (
        <CurriculumEditorPage
          courseId={teacherNavParams.courseId || courses[0]?.id || ''}
          courses={courses}
          topics={topics}
          lessons={lessons}
          onSaveTopic={handleSaveTopic}
          onDeleteTopic={handleDeleteTopic}
          onSaveLesson={handleSaveLesson}
          onDeleteLesson={handleDeleteLesson}
          onNavigate={handleTeacherNavigate}
          onNotify={notify}
        />
      )}

      {teacherPage === 'prerequisites' && (
        <PrerequisiteManagerPage
          courseId={teacherNavParams.courseId || courses[0]?.id || ''}
          courses={courses}
          topics={topics}
          onSaveTopic={handleSaveTopic}
          onNavigate={handleTeacherNavigate}
          onNotify={notify}
        />
      )}

      {teacherPage === 'resources' && (
        <ResourceManagerPage
          courseId={teacherNavParams.courseId || courses[0]?.id || ''}
          courses={courses}
          topics={topics}
          lessons={lessons}
          resources={resources}
          onSaveResource={handleSaveResource}
          onDeleteResource={handleDeleteResource}
          onNavigate={handleTeacherNavigate}
          onNotify={notify}
        />
      )}

      {teacherPage === 'question_bank' && (
        <QuestionBankPage
          courses={courses}
          topics={topics}
          questions={questions}
          onNavigate={handleTeacherNavigate}
          onDeleteQuestion={handleDeleteQuestion}
          onNotify={notify}
        />
      )}

      {teacherPage === 'question_editor' && (
        <QuestionEditorPage
          questionId={teacherNavParams.questionId}
          courses={courses}
          topics={topics}
          questions={questions}
          onSaveQuestion={handleSaveQuestion}
          onNavigate={handleTeacherNavigate}
          onNotify={notify}
        />
      )}

      {teacherPage === 'ai_review' && (
        <AIReviewPage
          courses={courses}
          topics={topics}
          resources={resources}
          candidates={candidates}
          onNavigate={handleTeacherNavigate}
          onSaveGeneratedCandidates={handleSaveGeneratedCandidates}
          onUpdateCandidateStatus={handleUpdateCandidateStatus}
          onNotify={notify}
        />
      )}

      {teacherPage === 'assessments' && (
        <AssessmentsPage
          courses={courses}
          topics={topics}
          assessments={assessments}
          questions={questions}
          onNavigate={handleTeacherNavigate}
          onDeleteAssessment={handleDeleteAssessment}
          onNotify={notify}
        />
      )}

      {teacherPage === 'assessment_editor' && (
        <AssessmentEditorPage
          assessmentId={teacherNavParams.assessmentId}
          courses={courses}
          topics={topics}
          questions={questions}
          assessments={assessments}
          onSaveAssessment={handleSaveAssessment}
          onNavigate={handleTeacherNavigate}
          onNotify={notify}
        />
      )}

      {teacherPage === 'analytics' && (
        <AnalyticsPage
          courses={courses}
          topics={topics}
          students={students}
          attempts={attempts}
          masteryStates={masteryStates}
          questions={questions}
          onNavigate={handleTeacherNavigate}
        />
      )}
    </TeacherLayout>
  );
}
