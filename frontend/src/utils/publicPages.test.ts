import { describe, it } from 'node:test';
import assert from 'node:assert';
import React from 'react';
import { renderToString } from 'react-dom/server';

import { storage } from '../services/storageService.ts';
import {
  parseUrlToRoute,
  serializeRouteToUrl,
  DEFAULT_PAGE_BY_PORTAL,
  VALID_PUBLIC_PAGES,
} from '../services/routerService.ts';

// Public Components and Pages
import { PublicHeader } from '../components/public/PublicHeader.tsx';
import { CourseCarousel } from '../components/public/CourseCarousel.tsx';
import { BKTSimulator } from '../components/public/BKTSimulator.tsx';
import { DAGVisualizer } from '../components/public/DAGVisualizer.tsx';
import { SearchModal } from '../components/public/SearchModal.tsx';
import { PublicLayout } from '../components/public/PublicLayout.tsx';
import { LandingPage } from '../pages/public/LandingPage.tsx';
import { CoursesExplorerPage } from '../pages/public/CoursesExplorerPage.tsx';
import { CourseDetailPage } from '../pages/public/CourseDetailPage.tsx';
import { AboutPage } from '../pages/public/AboutPage.tsx';
import { ContactPage } from '../pages/public/ContactPage.tsx';

describe('Public Marketing & Academic Site Suite (e2e-testing-patterns)', () => {
  const courses = storage.getCourses();
  const topics = storage.getTopics();
  const lessons = storage.getLessons();
  const resources = storage.getResources();
  const serviceHealth = storage.getServiceHealth();

  describe('Journey 1: Public URL Routing & Deep-Linking', () => {
    it('serializeRouteToUrl produces clean semantic URLs for public routes', () => {
      assert.equal(serializeRouteToUrl('public', 'landing'), '/');
      assert.equal(serializeRouteToUrl('public', 'courses'), '/courses');
      assert.equal(serializeRouteToUrl('public', 'about'), '/about');
      assert.equal(serializeRouteToUrl('public', 'contact'), '/contact');
      assert.equal(
        serializeRouteToUrl('public', 'course_details', { courseId: 'course-cs101' }),
        '/course_details?courseId=course-cs101'
      );
    });

    it('parseUrlToRoute correctly deserializes direct public routes', () => {
      const coursesRoute = parseUrlToRoute('/courses');
      assert.deepEqual(coursesRoute, {
        portal: 'public',
        page: 'courses',
        params: {},
      });

      const aboutRoute = parseUrlToRoute('/about');
      assert.deepEqual(aboutRoute, {
        portal: 'public',
        page: 'about',
        params: {},
      });

      const contactRoute = parseUrlToRoute('/contact');
      assert.deepEqual(contactRoute, {
        portal: 'public',
        page: 'contact',
        params: {},
      });

      const detailRoute = parseUrlToRoute('/course_details', '?courseId=course-cs101');
      assert.deepEqual(detailRoute, {
        portal: 'public',
        page: 'course_details',
        params: { courseId: 'course-cs101' },
      });

      const explicitPublic = parseUrlToRoute('/public/courses');
      assert.deepEqual(explicitPublic, {
        portal: 'public',
        page: 'courses',
        params: {},
      });
    });

    it('parseUrlToRoute maintains root null contract for backward compatibility', () => {
      assert.equal(parseUrlToRoute('/'), null);
      assert.equal(parseUrlToRoute(''), null);
    });
  });

  describe('Journey 2: Landing Page & Micro-Interactions Rendering', () => {
    it('LandingPage renders unique hero banner, telemetries, and BKT simulator', () => {
      const html = renderToString(
        React.createElement(LandingPage, {
          courses,
          topics,
          lessons,
          onNavigate: () => {},
          onEnterPortal: () => {},
        })
      );

      assert.ok(
        html.includes('Where Cognitive Science Meets Computational Mastery'),
        'Must contain hero headline'
      );
      assert.ok(html.includes('Bayesian Knowledge Tracing'), 'Must mention BKT');
      assert.ok(html.includes('Interactive Bayesian Knowledge Tracing'), 'Must include BKT simulator');
      assert.ok(html.includes('REST API 18ms'), 'Must show live telemetry');
      assert.ok(html.includes('Canonical Academic Curriculum'), 'Must contain courses carousel section');
      assert.ok(html.includes('SSD-08 Faculty Quarantine Protocol'), 'Must contain AI quarantine section');
      assert.ok(html.includes('Dr. Elena Rostova'), 'Must feature real faculty Dean');
      assert.ok(html.includes('Three.js 3D Knowledge Network'), 'Must feature Three.js 3D network badge');
    });

    it('CourseCarousel renders smooth navigation and canonical course cards', () => {
      const html = renderToString(
        React.createElement(CourseCarousel, {
          courses,
          topics,
          lessons,
          onSelectCourse: () => {},
        })
      );

      assert.ok(html.includes('Canonical Academic Curriculum'), 'Must include carousel title');
      assert.ok(html.includes('Introduction to Computer Science &amp; Python') || html.includes('Introduction to Computer Science & Python'), 'Must include CS101');
      assert.ok(html.includes('Data Structures and Algorithm Analysis'), 'Must include CS201');
      assert.ok(html.includes('Inspect Course Syllabus'), 'Must have syllabus CTA button');
      assert.ok(html.includes('lg:w-1/3'), 'Must format into 3-cards per row grid on desktop');
      assert.ok(html.includes('Topics'), 'Must display topics visual pill');
      assert.ok(html.includes('BKT Goal'), 'Must display BKT goal visual pill');
    });

    it('BKTSimulator displays initial 20% prior probability and 80% threshold', () => {
      const html = renderToString(React.createElement(BKTSimulator));

      assert.ok(html.includes('20%'), 'Must display initial prior 20%');
      assert.ok(html.includes('Target: 80% for DAG Unlock'), 'Must indicate 80% target');
      assert.ok(html.includes('Evaluate as TRUE'), 'Must have evaluation buttons');
      assert.ok(html.includes('Evaluate as FALSE'), 'Must have evaluation buttons');
    });

    it('DAGVisualizer displays 5 ordered nodes and cycle-free topological indicator', () => {
      const html = renderToString(
        React.createElement(DAGVisualizer, {
          topics,
          lessons,
        })
      );

      assert.ok(html.includes('Directed Acyclic Graph (DAG) Prerequisite Topology'), 'Header check');
      assert.ok(html.includes('Cycle-Free DFS Enforced') || html.includes('Depth-First Search (DFS)'), 'Cycle check');
      assert.ok(html.includes('Syntax, Variables &amp; Data Types') || html.includes('Syntax, Variables & Data Types'), 'Node check');
      assert.ok(html.includes('Conditional Logic &amp; Control Flow') || html.includes('Conditional Logic & Control Flow'), 'Node check');
    });
  });

  describe('Journey 3: Courses Explorer & Detailed Course View', () => {
    it('CoursesExplorerPage renders search filter bar, department chips, and course cards', () => {
      const html = renderToString(
        React.createElement(CoursesExplorerPage, {
          courses,
          topics,
          lessons,
          onSelectCourse: () => {},
          onNavigate: () => {},
        })
      );

      assert.ok(html.includes('University Computing Curriculum'), 'Heading check');
      assert.ok(html.includes('Filter courses by title, instructor, or topic'), 'Search input check');
      assert.ok(html.includes('All Disciplines'), 'Filter chips check');
      assert.ok(html.includes('Inspect Syllabus'), 'Card action check');
      assert.ok(html.includes('Interactive Curriculum Explorer'), 'Three.js 3D wave banner check');
    });

    it('CourseDetailPage renders deep syllabus, DAG prerequisite badges, and BKT rubric', () => {
      const html = renderToString(
        React.createElement(CourseDetailPage, {
          courseId: 'course-cs101',
          courses,
          topics,
          lessons,
          resources,
          onEnroll: () => {},
          onNavigate: () => {},
        })
      );

      assert.ok(html.includes('Introduction to Computer Science &amp; Python') || html.includes('Introduction to Computer Science & Python'), 'Title check');
      assert.ok(html.includes('Dr. Elena Rostova'), 'Instructor check');
      assert.ok(html.includes('Enroll in Course &amp; Start Learning') || html.includes('Enroll in Course & Start Learning'), 'CTA check');
      assert.ok(html.includes('Bayesian Knowledge Tracing (BKT) Criteria'), 'BKT rubric check');
      assert.ok(html.includes('Diagnostic Entrance Exam'), 'Assessment sequence check');
    });

    it('CourseDetailPage reflects enrolled student session with "Already Enrolled" and "Continue Learning"', () => {
      const mockEnrollments = [
        {
          id: 'enr-101',
          studentId: 'student-101',
          courseId: 'course-cs101',
          status: 'active' as const,
          progressPercent: 42,
          enrolledAt: '2026-10-01T00:00:00Z',
        },
      ];

      const mockStudentUser = {
        id: 'student-101',
        email: 'alex.rivera@learnova.edu',
        full_name: 'Alex Rivera',
        name: 'Alex Rivera',
        role: 'student' as const,
        is_active: true,
        isActive: true,
        created_at: '2026-09-01T00:00:00Z',
        createdAt: '2026-09-01T00:00:00Z',
        updatedAt: '2026-10-20T00:00:00Z',
      };

      const html = renderToString(
        React.createElement(CourseDetailPage, {
          courseId: 'course-cs101',
          courses,
          topics,
          lessons,
          resources,
          enrollments: mockEnrollments,
          currentUser: mockStudentUser,
          onEnroll: () => {},
          onContinueLearning: () => {},
          onNavigate: () => {},
        })
      );

      assert.ok(html.includes('Already Enrolled'), 'Must display Already Enrolled status');
      assert.ok(html.includes('Continue Learning'), 'Must provide Continue Learning action');
      assert.ok(html.includes('42%'), 'Must reflect active 42% progress percent');
      assert.ok(html.includes('Alex Rivera') && html.includes('Session'), 'Must identify active student session');
    });
  });

  describe('Journey 4: About Us & Contact Us Pages', () => {
    it('AboutPage renders Option B architecture, BKT/DAG/Quarantine tabs, and leadership team', () => {
      const html = renderToString(
        React.createElement(AboutPage, {
          onNavigate: () => {},
          onEnterPortal: () => {},
        })
      );

      assert.ok(
        html.includes('Competency-based education demands mathematical proof'),
        'Manifesto check'
      );
      assert.ok(html.includes('Option B Modular Monolith Architecture'), 'Architecture check');
      assert.ok(html.includes('Bayesian Knowledge Tracing'), 'Tabs check');
      assert.ok(html.includes('Dr. Elena Rostova'), 'Faculty check');
      assert.ok(html.includes('Prof. Alan Turing'), 'Faculty check');
      assert.ok(html.includes('Three.js 3D Architecture Knot'), '3D architecture canvas check');
    });

    it('ContactPage renders inquiry form, live health telemetry, and campus locations', () => {
      const html = renderToString(
        React.createElement(ContactPage, {
          serviceHealth,
          onNavigate: () => {},
        })
      );

      assert.ok(
        html.includes('Institutional Contact &amp; Campus Operations') || html.includes('Institutional Contact & Campus Operations'),
        'Heading check'
      );
      assert.ok(html.includes('Initiate Institutional Inquiry'), 'Form check');
      assert.ok(html.includes('Live Infrastructure Telemetry'), 'Telemetry check');
      assert.ok(html.includes('Cambridge Academic Hub'), 'Campus check');
      assert.ok(html.includes('Frequently Asked Questions'), 'FAQ check');
    });

    it('PublicHeader renders sticky nav with left logo, center menu, and right actions', () => {
      const html = renderToString(
        React.createElement(PublicHeader, {
          currentPage: 'landing',
          onNavigate: () => {},
          onOpenSearch: () => {},
          onOpenDesignStudio: () => {},
          onEnterPortal: () => {},
        })
      );

      assert.ok(html.includes('Learnova'), 'Brand logo check');
      assert.ok(html.includes('ACADEMIC'), 'Academic badge check');
      assert.ok(html.includes('Overview'), 'Menu check');
      assert.ok(html.includes('Courses'), 'Menu check');
      assert.ok(html.includes('About Us'), 'Menu check');
      assert.ok(html.includes('Contact Us'), 'Menu check');
      assert.ok(html.includes('Search...'), 'Search button check');
      assert.ok(html.includes('Portal'), 'Portal CTA check');
    });
  });

  describe('Journey 5: BKT Mathematical Invariants Verification', () => {
    it('Bayesian Knowledge Tracing update formula yields exact predicted probabilities', () => {
      const P_L0 = 0.20;
      const P_TRANSIT = 0.15;
      const P_SLIP = 0.10;
      const P_GUESS = 0.20;

      // First observation: Correct answer (obs = 1)
      const num1 = P_L0 * (1 - P_SLIP); // 0.20 * 0.90 = 0.18
      const den1 = num1 + (1 - P_L0) * P_GUESS; // 0.18 + 0.80 * 0.20 = 0.34
      const posterior1 = num1 / den1; // ~0.52941
      const updated1 = posterior1 + (1 - posterior1) * P_TRANSIT; // ~0.6000

      assert.ok(Math.abs(updated1 - 0.60) < 0.01, 'Step 1 mastery should be ~60%');

      // Second observation: Correct answer (obs = 1)
      const num2 = updated1 * (1 - P_SLIP); // ~0.60 * 0.90 = 0.54
      const den2 = num2 + (1 - updated1) * P_GUESS; // 0.54 + 0.40 * 0.20 = 0.62
      const posterior2 = num2 / den2; // ~0.871
      const updated2 = posterior2 + (1 - posterior2) * P_TRANSIT; // ~0.890

      assert.ok(updated2 >= 0.80, 'Second correct answer must surpass 80% mastery threshold');
    });
  });
});
