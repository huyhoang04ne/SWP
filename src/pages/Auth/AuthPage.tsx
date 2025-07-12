import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { login, register } from '../../api/authApi';


const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('Male');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const toggleForm = () => {
    setIsSignIn((prev) => !prev);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (isSignIn) {
        const res = await login({ email, password });
        if (res.data && res.data.token) {
          localStorage.setItem('token', res.data.token);
          window.location.href = '/';
        } else {
          setError('Đăng nhập thất bại.');
        }
      } else {
        await register({ email, password, fullName, gender, dateOfBirth });
        setSuccess('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsSignIn(true);
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        (isSignIn ? 'Đăng nhập thất bại.' : 'Đăng ký thất bại.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        {/* Form Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isSignIn ? 'signIn' : 'signUp'}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
            className="p-10 space-y-6 flex flex-col justify-center"
          >
            <h2 className="text-3xl font-bold text-gray-800 text-center">
              {isSignIn ? 'Sign In' : 'Create Account'}
            </h2>
            <div className="flex justify-center gap-3">
              {['G+', 'f', 'github', 'in'].map((icon, idx) => (
                <button
                  key={idx}
                  className="border rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100"
                  type="button"
                >
                  {icon}
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500">
              or use your email {isSignIn ? 'password' : 'for registration'}
            </p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isSignIn && (
                <>
                  <input
                    type="text"
                    placeholder="Name"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                  />
                  <select
                    className="w-full px-4 py-2 border rounded-lg"
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    required
                  >
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                  </select>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border rounded-lg"
                    value={dateOfBirth}
                    onChange={e => setDateOfBirth(e.target.value)}
                    required
                  />
                </>
              )}
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-lg"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              {isSignIn && (
                <p className="text-sm text-right text-purple-600 hover:underline cursor-pointer">
                  Forgot Your Password?
                </p>
              )}
              {error && <p className="text-red-500 text-center text-sm">{error}</p>}
              {success && <p className="text-green-600 text-center text-sm">{success}</p>}
              <button
                className="w-full bg-purple-600 text-white rounded-lg py-2 font-semibold hover:bg-purple-700 disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? (isSignIn ? 'Đang đăng nhập...' : 'Đang đăng ký...')
                  : (isSignIn ? 'SIGN IN' : 'SIGN UP')}
              </button>
            </form>
          </motion.div>
        </AnimatePresence>

        {/* Toggle Panel */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-tr from-purple-600 to-indigo-500 text-white p-10">
          <h2 className="text-3xl font-bold mb-2">
            {isSignIn ? 'Hello, Friend!' : 'Welcome Back!'}
          </h2>
          <p className="mb-4 text-center">
            {isSignIn
              ? 'Register with your personal details to use all of site features'
              : 'Enter your personal details to use all of site features'}
          </p>
          <button
            onClick={toggleForm}
            className="border border-white px-6 py-2 rounded-lg hover:bg-white hover:text-purple-600 font-semibold transition"
          >
            {isSignIn ? 'SIGN UP' : 'SIGN IN'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
