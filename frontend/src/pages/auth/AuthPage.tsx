import React, { useState } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Award,
  Compass,
} from 'lucide-react';
import { authApi, UserResponse } from '../../services/api/authApi';

interface AuthPageProps {
  initialMode?: 'signin' | 'register';
  onAuthSuccess: (user: UserResponse, token: string) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'signin',
  onAuthSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'register'>(initialMode);
  
  // Sign In State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register State
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Status & Error
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fast demo account loader
  const fillDemoAccount = (role: 'student' | 'teacher' | 'admin') => {
    setError(null);
    setMode('signin');
    if (role === 'student') {
      setEmail('student@learnova.edu');
      setPassword('student123');
    } else if (role === 'teacher') {
      setEmail('teacher@learnova.edu');
      setPassword('teacher123');
    } else {
      setEmail('admin@learnova.edu');
      setPassword('admin123');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both your university email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authApi.login({
        email: email.trim().toLowerCase(),
        password,
      });

      let activeUser = res.user;
      if (!activeUser) {
        activeUser = await authApi.getMe();
      }

      onAuthSuccess(activeUser, res.access_token);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regFullName.trim() || !regEmail.trim() || !regPassword) {
      setError('Please fill in all required registration fields.');
      return;
    }

    if (regPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await authApi.register({
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        full_name: regFullName.trim(),
      });

      let activeUser = res.user;
      if (!activeUser) {
        activeUser = await authApi.getMe();
      }

      onAuthSuccess(activeUser, res.access_token);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try a different email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] dark:bg-[#0F1218] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      {/* Centered Split-Screen Card with Fixed Matching Dimensions */}
      <div className="w-full max-w-5xl bg-white dark:bg-[#181C24] rounded-3xl shadow-2xl border border-[#D9DEE7] dark:border-[#2D3545] overflow-hidden flex flex-col md:flex-row md:h-[690px] min-h-[690px] transition-all duration-300">
        
        {/* Left Section: Educational Visual & Brand Banner */}
        <div className="md:w-1/2 bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#4338CA] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden h-full">
          {/* Ambient Background Decorative Elements */}
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-indigo-500/25 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-emerald-400/15 blur-2xl pointer-events-none" />

          {/* Top: Brand Monogram */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white block leading-none">
                  Learnova
                </span>
                <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-widest mt-1 block">
                  Adaptive Learning Platform
                </span>
              </div>
            </div>
          </div>

          {/* Center: Educational Art & Value Proposition */}
          <div className="relative z-10 my-8 sm:my-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-blue-100 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Next-Generation Higher Education</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
              Master complex topics with adaptive precision.
            </h1>

            <p className="mt-3 text-sm text-blue-100/90 leading-relaxed max-w-md">
              Dynamic knowledge graph tracing, personalized AI tutoring sessions, and teacher-guided evaluations crafted for academic excellence.
            </p>

            {/* Feature Highlights Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <Compass className="w-4 h-4 text-emerald-300 shrink-0" />
                <span className="text-white font-medium">DAG Prerequisite Mapping</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <BookOpen className="w-4 h-4 text-yellow-300 shrink-0" />
                <span className="text-white font-medium">Curriculum Synthesis</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <Award className="w-4 h-4 text-purple-300 shrink-0" />
                <span className="text-white font-medium">Dynamic BKT Mastery</span>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-cyan-300 shrink-0" />
                <span className="text-white font-medium">Faculty Governance</span>
              </div>
            </div>
          </div>

          {/* Bottom: Social Proof Footer */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-blue-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Verified academic institution network</span>
            </div>
            <span className="font-semibold text-white">v0.1.0-RC</span>
          </div>
        </div>

        {/* Right Section: Interactive Auth Form with Exact Matching Footprint */}
        <div className="md:w-1/2 p-8 sm:p-10 flex flex-col justify-between bg-white dark:bg-[#181C24] h-full overflow-y-auto">
          <div>
            {/* Form Toggle Header (Sign In vs Create Account) */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4 mb-6">
              <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800/80 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode('signin');
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                    mode === 'signin'
                      ? 'bg-white dark:bg-[#1F2937] text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode('register');
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                    mode === 'register'
                      ? 'bg-white dark:bg-[#1F2937] text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <span className="text-xs text-gray-400 hidden sm:inline">
                {mode === 'signin' ? 'Access your dashboard' : 'Student self-registration'}
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                {mode === 'signin' ? 'Welcome Back' : 'Begin Your Journey'}
              </h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {mode === 'signin'
                  ? 'Enter your institutional email to access your courses and progress.'
                  : 'Register a student account to get personalized adaptive learning.'}
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-medium animate-in fade-in duration-150">
                {error}
              </div>
            )}

            {/* Form Slot: Locked min-height so switching forms never shifts or jumps card size */}
            <div className="min-h-[285px] flex flex-col justify-center">
              {/* SIGN IN FORM */}
              {mode === 'signin' && (
                <form key="signin" onSubmit={handleSignIn} className="space-y-3.5 animate-in fade-in duration-200">
                  <div>
                    <label
                      htmlFor="auth-email"
                      className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1"
                    >
                      University Email
                    </label>
                    <div className="relative rounded-xl">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="auth-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@learnova.edu"
                        className="block w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E232E] text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label
                        htmlFor="auth-password"
                        className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300"
                      >
                        Password
                      </label>
                    </div>
                    <div className="relative rounded-xl">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="auth-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="block w-full pl-10 pr-10 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E232E] text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700"
                      />
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        Stay signed in across reloads
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-1 py-2.5 px-4 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to Learnova</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* CREATE ACCOUNT FORM */}
              {mode === 'register' && (
                <form key="register" onSubmit={handleRegister} className="space-y-3 animate-in fade-in duration-200">
                  <div>
                    <label
                      htmlFor="reg-fullname"
                      className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Full Name
                    </label>
                    <div className="relative rounded-xl">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-fullname"
                        type="text"
                        required
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="e.g. Haseeb Ashfaq"
                        className="block w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E232E] text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="reg-email"
                      className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1"
                    >
                      University Email
                    </label>
                    <div className="relative rounded-xl">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="reg-email"
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="haseeb@learnova.edu"
                        className="block w-full pl-10 pr-3.5 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E232E] text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label
                        htmlFor="reg-pass"
                        className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Password
                      </label>
                      <div className="relative rounded-xl">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <input
                          id="reg-pass"
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Min 8 chars"
                          className="block w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E232E] text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                        >
                          {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="reg-confirm-pass"
                        className="block text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Confirm
                      </label>
                      <div className="relative rounded-xl">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <input
                          id="reg-confirm-pass"
                          type={showRegPassword ? 'text' : 'password'}
                          required
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="block w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1E232E] text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-1 py-2.5 px-4 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Student Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Quick 1-Click Demo Profiles */}
            <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-2 text-center">
                Quick Demo One-Click Fill
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => fillDemoAccount('student')}
                  className="flex flex-col items-center justify-center p-2 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100/80 transition cursor-pointer"
                  title="Fill Alex Rivera (Student)"
                >
                  <span className="font-bold">Student</span>
                  <span className="text-[10px] opacity-75">Alex R.</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('teacher')}
                  className="flex flex-col items-center justify-center p-2 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/60 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 hover:bg-blue-100/80 transition cursor-pointer"
                  title="Fill Elena Rostova (Teacher)"
                >
                  <span className="font-bold">Teacher</span>
                  <span className="text-[10px] opacity-75">Elena R.</span>
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoAccount('admin')}
                  className="flex flex-col items-center justify-center p-2 rounded-xl border border-purple-200 dark:border-purple-800/60 bg-purple-50/60 dark:bg-purple-950/20 text-purple-800 dark:text-purple-300 hover:bg-purple-100/80 transition cursor-pointer"
                  title="Fill Sarah Connor (Admin)"
                >
                  <span className="font-bold">Admin</span>
                  <span className="text-[10px] opacity-75">Sarah C.</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Switch Link */}
          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            {mode === 'signin' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode('register');
                  }}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Create student account
                </button>
              </p>
            ) : (
              <p>
                Already registered with Learnova?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode('signin');
                  }}
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
