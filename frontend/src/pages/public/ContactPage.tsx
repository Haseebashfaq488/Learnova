import React, { useState } from 'react';
import {
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Activity,
  Send,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
  HelpCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ServiceHealthCheck } from '../../types';
import { PublicNavigationPage } from '../../services/routerService';

interface ContactPageProps {
  serviceHealth?: ServiceHealthCheck[];
  onNavigate: (page: PublicNavigationPage, params?: Record<string, string>) => void;
}

const DEFAULT_HEALTH_METRICS: ServiceHealthCheck[] = [
  {
    id: 'svc-core-api',
    name: 'Learnova Core REST API',
    category: 'api',
    status: 'healthy',
    latencyMs: 18,
    uptimePercent: 99.99,
    lastChecked: new Date().toISOString(),
    description: 'Express gateway processing curriculum, user, and assessment requests.',
  },
  {
    id: 'svc-postgres',
    name: 'PostgreSQL Relational DB',
    category: 'database',
    status: 'healthy',
    latencyMs: 12,
    uptimePercent: 99.98,
    lastChecked: new Date().toISOString(),
    description: 'Relational storage for course nodes, user accounts, and attempts.',
  },
  {
    id: 'svc-auth-jwt',
    name: 'Auth & JWT Session Broker',
    category: 'auth',
    status: 'healthy',
    latencyMs: 14,
    uptimePercent: 100.0,
    lastChecked: new Date().toISOString(),
    description: 'Role-based access token verification and password security.',
  },
  {
    id: 'svc-dag-worker',
    name: 'DAG Prerequisite Worker',
    category: 'worker',
    status: 'healthy',
    latencyMs: 24,
    uptimePercent: 99.95,
    lastChecked: new Date().toISOString(),
    description: 'Asynchronous DAG cycle detection and mastery recalibration engine.',
  },
  {
    id: 'svc-gemini-ai',
    name: 'External AI Adapter (Gemini)',
    category: 'ai_service',
    status: 'healthy',
    latencyMs: 142,
    uptimePercent: 99.85,
    lastChecked: new Date().toISOString(),
    description: 'LLM adapter for AI question generation and adaptive tutoring.',
  },
];

const FAQS = [
  {
    q: 'How does Learnova integrate with existing University LMS platforms (Canvas, Blackboard)?',
    a: 'Learnova supports LTI 1.3 Advantage specifications, enabling seamless grade passback, deep linking to DAG topics, and single sign-on (SSO) with university identity providers.',
  },
  {
    q: 'How does Learnova prevent AI hallucinations in assessment questions?',
    a: 'All generated questions are quarantined under the SSD-08 protocol in a pending review state. Questions can only appear in live exams after assigned faculty review, edit, and approve them with row-level database locks.',
  },
  {
    q: 'Is student assessment data compliant with FERPA and GDPR regulations?',
    a: 'Yes. Learnova segregates PII, implements strict data sovereignty controls, provides automated audit logging for administrative actions, and does not sell or share student learning metrics.',
  },
  {
    q: 'What is required to run Learnova on-premise or in dedicated cloud clusters?',
    a: 'Learnova runs on an Option B Modular Monolith topology requiring only a single FastAPI/Uvicorn process and PostgreSQL 17. Docker Compose configurations are included for rapid deployment.',
  },
];

export const ContactPage: React.FC<ContactPageProps> = ({ serviceHealth = DEFAULT_HEALTH_METRICS }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    institution: '',
    inquiryType: 'partnership',
    message: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      errors.email = 'Institutional email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Enter a valid institutional email address';
    }
    if (!formData.institution.trim()) errors.institution = 'Institution or university name is required';
    if (!formData.message.trim()) errors.message = 'Please provide details about your inquiry';
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    // Simulate API dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Institutional Contact &amp; Campus Operations
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          Connect with our academic partnerships team, request a campus demonstration, or view live
          infrastructure telemetry.
        </p>
      </div>

      {/* Main Grid: Contact Form & Live Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#121724] border border-gray-200/90 dark:border-gray-800 shadow-sm">
          {isSubmitted ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Inquiry Successfully Dispatched
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
                Thank you, {formData.fullName}. Our academic liaison for {formData.institution} has
                received your message and will respond to {formData.email} within one business day.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    fullName: '',
                    email: '',
                    institution: '',
                    inquiryType: 'partnership',
                    message: '',
                  });
                }}
                className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Initiate Institutional Inquiry
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Prof. Jane Doe"
                    className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border bg-gray-50 dark:bg-[#182030] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      formErrors.fullName
                        ? 'border-red-400 dark:border-red-600'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                  {formErrors.fullName && (
                    <span className="text-[11px] text-red-500 mt-1 block">
                      {formErrors.fullName}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Institutional Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="j.doe@university.edu"
                    className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border bg-gray-50 dark:bg-[#182030] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      formErrors.email
                        ? 'border-red-400 dark:border-red-600'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                  {formErrors.email && (
                    <span className="text-[11px] text-red-500 mt-1 block">
                      {formErrors.email}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="institution"
                    className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Institution / Organization *
                  </label>
                  <input
                    id="institution"
                    name="institution"
                    type="text"
                    value={formData.institution}
                    onChange={handleInputChange}
                    placeholder="University of Science & Tech"
                    className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border bg-gray-50 dark:bg-[#182030] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      formErrors.institution
                        ? 'border-red-400 dark:border-red-600'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  />
                  {formErrors.institution && (
                    <span className="text-[11px] text-red-500 mt-1 block">
                      {formErrors.institution}
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="inquiryType"
                    className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Inquiry Objective
                  </label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#182030] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer"
                  >
                    <option value="partnership">Academic Partnership &amp; Accreditation</option>
                    <option value="enterprise">Campus Enterprise Deployment</option>
                    <option value="faculty">Faculty Question Authoring Access</option>
                    <option value="security">Security &amp; Vulnerability Disclosure</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
                >
                  Message &amp; Project Context *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe your student cohort size, specific curriculum requirements, or LMS integration needs..."
                  className={`w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border bg-gray-50 dark:bg-[#182030] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    formErrors.message
                      ? 'border-red-400 dark:border-red-600'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                />
                {formErrors.message && (
                  <span className="text-[11px] text-red-500 mt-1 block">
                    {formErrors.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Dispatching Inquiry...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Academic Inquiry</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Live Infrastructure Telemetry Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121724] border border-gray-200/90 dark:border-gray-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Live Infrastructure Telemetry
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                ALL SYSTEMS HEALTHY
              </span>
            </div>

            <div className="space-y-2.5">
              {serviceHealth.map((svc) => (
                <div
                  key={svc.id}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-[#182030] border border-gray-200/60 dark:border-gray-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <div>
                      <span className="font-semibold text-gray-900 dark:text-white block">
                        {svc.name}
                      </span>
                      <span className="text-[11px] text-gray-500 dark:text-gray-400">
                        {svc.uptimePercent}% uptime
                      </span>
                    </div>
                  </div>
                  <span className="font-mono text-gray-600 dark:text-gray-300 font-bold">
                    {svc.latencyMs}ms
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Locations */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121724] border border-gray-200/90 dark:border-gray-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Campus &amp; Research Centers
            </h3>

            <div className="space-y-3 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-900 dark:text-white block">Cambridge Academic Hub</span>
                  <span>Learnova Institute, Kendall Square, Cambridge, MA 02142</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-900 dark:text-white block">Zurich Formal Verification Lab</span>
                  <span>Leonhardstrasse 21, 8092 Zürich, Switzerland</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-gray-900 dark:text-white block">Security &amp; Compliance Hotline</span>
                  <span className="font-mono text-[11px]">s.connor@learnova.edu · support@learnova.edu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <section className="space-y-6 pt-4">
        <div className="max-w-2xl">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Common institutional questions about Bayesian calibration, SSD-08 quarantine, and data privacy.
          </p>
        </div>

        <div className="space-y-3 max-w-4xl">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-gray-200/80 dark:border-gray-800 bg-white dark:bg-[#121724] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-gray-50 dark:hover:bg-[#182030] transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-xs sm:text-sm text-gray-900 dark:text-white pr-4">
                    {faq.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800/80 bg-gray-50/40 dark:bg-[#161D2B]/30">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
