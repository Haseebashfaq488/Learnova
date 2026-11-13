'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  StudentLayout,
  StudentNavigationPage,
  ToastMessage,
} from '../components/StudentLayout';

// Student Portal 18 Pages
import { SignInPage } from '../views/SignInPage';
import { CreateAccountPage } from '../views/CreateAccountPage';
import { StudentDashboardPage } from '../views/StudentDashboardPage';
import { CourseCatalogPage } from '../views/CourseCatalogPage';
import { CourseDetailsPage } from '../views/CourseDetailsPage';
import { MyLearningPage } from '../views/MyLearningPage';
import { CourseLearningMapPage } from '../views/CourseLearningMapPage';
import { LessonWorkspacePage } from '../views/LessonWorkspacePage';
import { DiagnosticIntroPage } from '../views/DiagnosticIntroPage';
import { DiagnosticPlayerPage } from '../views/DiagnosticPlayerPage';
import { AdaptivePracticePlayerPage } from '../views/AdaptivePracticePlayerPage';
import { FinalExamPlayerPage } from '../views/FinalExamPlayerPage';
import { AssessmentResultsPage } from '../views/AssessmentResultsPage';
import { ProgressAnalyticsPage } from '../views/ProgressAnalyticsPage';
import { AchievementsBadgesPage } from '../views/AchievementsBadgesPage';
import { XPActivityHistoryPage } from '../views/XPActivityHistoryPage';
import { LeaderboardPage } from '../views/LeaderboardPage';
import { ProfileSettingsPage } from '../views/ProfileSettingsPage';

// Shared APIs and Types
import { authApi } from '../services/api/authApi';
import { coursesApi, mapBackendCourseToCourse, mapBackendEnrollmentToEnrollment } from '../services/api/coursesApi';
import { curriculumApi } from '../services/api/curriculumApi';
import { gamificationApi } from '../services/api/gamificationApi';
import { masteryApi, mapBackendMasteryToMasteryState } from '../services/api/masteryApi';
import { assessmentApi, mapBackendAssessmentToAssessment } from '../services/api/assessmentApi';
import { storage } from '../services/storageService';

import {
  Course,
  Topic,
  Lesson,
  LearningResource,
  QuestionData,
  Assessment,
  AssessmentAttempt,
  StudentUser,
  Enrollment,
  LessonCompletion,
  MasteryState,
  GamificationProfile,
  XPEvent,
  Badge,
  LeaderboardEntry,
  StudentAssessmentResult,
} from '../types';

export default function StudentApp() {
  const [currentStudent, setCurrentStudent] = useState<StudentUser | null>(() => storage.getStudentUser());
  const [studentPage, setStudentPage] = useState<StudentNavigationPage>('dashboard');
  const [studentNavParams, setStudentNavParams] = useState<Record<string, string>>({});
  const [latestResult, setLatestResult] = useState<StudentAssessmentResult | null>(null);

  // Data Records
  const [courses, setCourses] = useState<Course[]>(() => storage.getCourses());
  const [topics, setTopics] = useState<Topic[]>(() => storage.getTopics());
  const [lessons, setLessons] = useState<Lesson[]>(() => storage.getLessons());
  const [resources, setResources] = useState<LearningResource[]>(() => storage.getResources());
  const [questions, setQuestions] = useState<QuestionData[]>(() => storage.getQuestions());
  const [assessments, setAssessments] = useState<Assessment[]>(() => storage.getAssessments());
  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => storage.getEnrollments());
  const [completions, setCompletions] = useState<LessonCompletion[]>(() => storage.getCompletions());
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>(() => storage.getAttempts());
  const [masteryStates, setMasteryStates] = useState<MasteryState[]>(() => storage.getMasteryStates());
  const [gamificationProfile, setGamificationProfile] = useState<GamificationProfile>(() => storage.getGamificationProfile());
  const [xpEvents, setXpEvents] = useState<XPEvent[]>(() => storage.getXPEvents());
  const [badges, setBadges] = useState<Badge[]>(() => storage.getBadges());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => storage.getLeaderboard());

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const notify = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const handleDismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleStudentNavigate = useCallback((page: StudentNavigationPage, params?: Record<string, string>) => {
    setStudentPage(page);
    if (params) {
      setStudentNavParams(params);
    }
  }, []);

  // Hydrate session and courses from live backend
  const refreshStudentData = useCallback(async () => {
    try {
      const liveCourses = await coursesApi.listCourses();
      if (liveCourses.length > 0) {
        setCourses(liveCourses.map(mapBackendCourseToCourse));
      }
      const liveAssessments = await assessmentApi.listAssessments();
      if (liveAssessments.length > 0) {
        setAssessments(liveAssessments.map(mapBackendAssessmentToAssessment));
      }
      const liveProfile = await gamificationApi.getProfile();
      if (liveProfile) {
        setGamificationProfile({
          userId: liveProfile.user_id,
          totalXp: liveProfile.total_xp,
          currentLevel: liveProfile.current_level,
          currentStreak: liveProfile.current_streak,
          longestStreak: liveProfile.longest_streak,
          lastActiveDate: liveProfile.last_active_date || new Date().toISOString(),
          unlockedBadgeIds: [],
        });
      }
    } catch (err) {
      // Offline fallback to preloaded state
    }
  }, []);

  useEffect(() => {
    refreshStudentData();
  }, [refreshStudentData]);

  const handleEnrollCourse = async (courseId: string) => {
    try {
      const enr = await coursesApi.enrollCourse(courseId);
      setEnrollments((prev) => [...prev, mapBackendEnrollmentToEnrollment(enr)]);
      notify('success', 'Enrolled in course successfully!');
      handleStudentNavigate('course_map', { courseId });
    } catch (err: any) {
      notify('info', 'Enrolled via local offline session.');
      handleStudentNavigate('course_map', { courseId });
    }
  };

  const handleMarkLessonComplete = async (lessonId: string, courseId: string, topicId: string) => {
    try {
      await curriculumApi.completeLesson(lessonId);
      setCompletions((prev) => [...prev, { id: `comp-${Date.now()}`, studentId: currentStudent?.id || '', lessonId, courseId, topicId, completedAt: new Date().toISOString(), xpEarned: 50 }]);
      notify('success', 'Lesson marked complete! +50 XP earned.');
    } catch (err) {
      setCompletions((prev) => [...prev, { id: `comp-${Date.now()}`, studentId: currentStudent?.id || '', lessonId, courseId, topicId, completedAt: new Date().toISOString(), xpEarned: 50 }]);
      notify('success', 'Lesson completed offline. +50 XP.');
    }
  };

  const handleFinishDiagnostic = (score: number, total: number) => {
    notify('success', `Diagnostic Completed! Score: ${score}/${total}`);
    handleStudentNavigate('dashboard');
  };

  const handleFinishPractice = (score: number, total: number) => {
    notify('success', `Practice complete! Score: ${score}/${total}`);
    handleStudentNavigate('dashboard');
  };

  const handleFinishExam = (score: number, total: number) => {
    notify('success', `Exam submitted! Score: ${score}/${total}`);
    handleStudentNavigate('dashboard');
  };

  const handleUpdateStudentProfile = (updated: Partial<StudentUser>) => {
    if (!currentStudent) return;
    const merged = { ...currentStudent, ...updated };
    setCurrentStudent(merged);
    notify('success', 'Profile updated successfully.');
  };

  const handleStudentSignOut = async () => {
    try {
      await authApi.logout();
    } catch {}
    setCurrentStudent(null);
    setStudentPage('sign_in');
  };

  const handleStudentSignInSuccess = (user: StudentUser) => {
    setCurrentStudent(user);
    setStudentPage('dashboard');
    refreshStudentData();
    notify('success', `Welcome back, ${user.name}!`);
  };

  // If not signed in
  if (!currentStudent || studentPage === 'sign_in') {
    return (
      <SignInPage
        onSignInSuccess={handleStudentSignInSuccess}
        onNavigateToRegister={() => setStudentPage('register')}
        onSwitchToTeacher={() => { window.location.href = 'http://localhost:3002'; }}
        onSwitchToAdmin={() => { window.location.href = 'http://localhost:3003'; }}
      />
    );
  }

  if (studentPage === 'register') {
    return (
      <CreateAccountPage
        onRegisterSuccess={handleStudentSignInSuccess}
        onNavigateToSignIn={() => setStudentPage('sign_in')}
      />
    );
  }

  // Full-screen distraction-minimized Assessment Players
  if (studentPage === 'diagnostic_player') {
    const asm = assessments.find((a) => a.id === studentNavParams.assessmentId) || assessments.find((a) => a.type === 'diagnostic') || assessments[0];
    return (
      <DiagnosticPlayerPage
        assessment={asm}
        questions={questions}
        onFinishDiagnostic={handleFinishDiagnostic}
        onExit={() => handleStudentNavigate('course_map', { courseId: asm?.courseId || '' })}
      />
    );
  }

  if (studentPage === 'practice_player') {
    const asm = assessments.find((a) => a.id === studentNavParams.assessmentId) || assessments.find((a) => a.type === 'adaptive') || assessments[0];
    return (
      <AdaptivePracticePlayerPage
        assessment={asm}
        questions={questions}
        onFinishPractice={handleFinishPractice}
        onExit={() => handleStudentNavigate('course_map', { courseId: asm?.courseId || '' })}
      />
    );
  }

  if (studentPage === 'exam_player') {
    const asm = assessments.find((a) => a.id === studentNavParams.assessmentId) || assessments.find((a) => a.type === 'final') || assessments[0];
    return (
      <FinalExamPlayerPage
        assessment={asm}
        questions={questions}
        onFinishExam={handleFinishExam}
        onExit={() => handleStudentNavigate('course_map', { courseId: asm?.courseId || '' })}
      />
    );
  }

  return (
    <StudentLayout
      currentPage={studentPage}
      onNavigate={handleStudentNavigate}
      currentUser={currentStudent}
      gamificationProfile={gamificationProfile}
      toasts={toasts}
      onDismissToast={handleDismissToast}
      onSwitchPortal={() => { window.location.href = 'http://localhost:3002'; }}
      onSwitchToAdmin={() => { window.location.href = 'http://localhost:3003'; }}
      onSignOut={handleStudentSignOut}
      breadcrumbs={[{ label: 'Student Portal', page: 'dashboard' }, { label: studentPage }]}
    >
      {studentPage === 'dashboard' && (
        <StudentDashboardPage
          currentUser={currentStudent}
          gamificationProfile={gamificationProfile}
          enrollments={enrollments}
          courses={courses}
          topics={topics}
          lessons={lessons}
          masteryStates={masteryStates}
          badges={badges}
          recentAttempts={attempts}
          onNavigate={handleStudentNavigate}
        />
      )}

      {studentPage === 'catalog' && (
        <CourseCatalogPage
          courses={courses}
          topics={topics}
          enrollments={enrollments}
          onNavigate={handleStudentNavigate}
        />
      )}

      {studentPage === 'course_details' && (
        <CourseDetailsPage
          courseId={studentNavParams.courseId || courses[0]?.id || ''}
          courses={courses}
          topics={topics}
          lessons={lessons}
          enrollments={enrollments}
          onEnroll={handleEnrollCourse}
          onNavigate={handleStudentNavigate}
        />
      )}

      {studentPage === 'my_learning' && (
        <MyLearningPage
          courses={courses}
          topics={topics}
          lessons={lessons}
          enrollments={enrollments}
          onNavigate={handleStudentNavigate}
        />
      )}

      {studentPage === 'course_map' && (
        <CourseLearningMapPage
          courseId={studentNavParams.courseId || enrollments[0]?.courseId || courses[0]?.id || ''}
          courses={courses}
          topics={topics}
          lessons={lessons}
          resources={resources}
          enrollments={enrollments}
          masteryStates={masteryStates}
          assessments={assessments}
          completedLessonIds={new Set(completions.map((c) => c.lessonId))}
          onNavigate={handleStudentNavigate}
        />
      )}

      {studentPage === 'lesson' && (
        <LessonWorkspacePage
          courseId={studentNavParams.courseId || courses[0]?.id || ''}
          topicId={studentNavParams.topicId || topics[0]?.id || ''}
          lessonId={studentNavParams.lessonId || lessons[0]?.id || ''}
          courses={courses}
          topics={topics}
          lessons={lessons}
          resources={resources}
          isCompleted={completions.some((c) => c.lessonId === (studentNavParams.lessonId || lessons[0]?.id))}
          onMarkComplete={handleMarkLessonComplete}
          onNavigate={handleStudentNavigate}
        />
      )}

      {studentPage === 'diagnostic_intro' && (
        <DiagnosticIntroPage
          assessmentId={studentNavParams.assessmentId || assessments.find((a) => a.type === 'diagnostic')?.id || ''}
          assessments={assessments}
          courses={courses}
          topics={topics}
          onStartDiagnostic={(id) => handleStudentNavigate('diagnostic_player', { assessmentId: id })}
          onNavigate={handleStudentNavigate}
        />
      )}

      {studentPage === 'results' && latestResult && (
        <AssessmentResultsPage
          result={latestResult}
          course={courses.find((c) => c.id === latestResult.courseId)}
          topic={topics.find((t) => t.id === latestResult.topicId)}
          onNavigate={handleStudentNavigate}
        />
      )}

      {studentPage === 'progress' && (
        <ProgressAnalyticsPage
          courses={courses}
          topics={topics}
          lessons={lessons}
          masteryStates={masteryStates}
          attempts={attempts}
          completions={completions}
          onNavigate={handleStudentNavigate}
        />
      )}

      {studentPage === 'achievements' && (
        <AchievementsBadgesPage
          badges={badges}
          gamificationProfile={gamificationProfile}
          onNavigate={handleStudentNavigate}
        />
      )}

      {studentPage === 'xp_history' && (
        <XPActivityHistoryPage
          xpEvents={xpEvents}
          gamificationProfile={gamificationProfile}
          onNavigate={handleStudentNavigate}
        />
      )}

      {studentPage === 'leaderboard' && (
        <LeaderboardPage
          leaderboard={leaderboard}
          currentStudentId={currentStudent.id}
          onNavigate={handleStudentNavigate}
        />
      )}

      {studentPage === 'profile' && (
        <ProfileSettingsPage
          currentUser={currentStudent}
          gamificationProfile={gamificationProfile}
          onUpdateProfile={handleUpdateStudentProfile}
          onSignOut={handleStudentSignOut}
          onNotify={notify}
          onNavigate={handleStudentNavigate}
        />
      )}
    </StudentLayout>
  );
}
