import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import api from '~/services/axiosInterceptor';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  let navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    // Add registration logic here
    
    await api.post("/api/v1/auth/register", { username, password })
    navigate('/login')
  };

  const handleCancel = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    navigate('/login')
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 relative">
      <a href="/login" className="absolute top-6 left-6 text-blue-600 underline font-medium text-base z-10">Go back</a>
      <div className="h-screen flex items-center justify-center">
        <div className="bg-gradient-to-br from-yellow-50 to-blue-50 rounded-2xl shadow-lg p-10 w-full max-w-[350px] flex flex-col items-center">
          <h2 className="text-center text-blue-600 mb-8 font-bold tracking-wide">Register</h2>
          <form onSubmit={handleRegister} className="w-full flex flex-col gap-5">
            <label className="font-medium text-blue-600">
              Username
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full px-3 py-3 mt-2 rounded-lg border border-blue-200 outline-none text-base bg-blue-50 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="font-medium text-blue-600 relative">
              Password
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-3 py-3 mt-2 rounded-lg border border-blue-200 outline-none text-base bg-blue-50 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <span
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-[45px] cursor-pointer text-blue-600 text-xl"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </label>
            <label className="font-medium text-blue-600 relative">
              Confirm Password
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-3 mt-2 rounded-lg border border-yellow-300 outline-none text-base bg-yellow-50 text-yellow-600 focus:ring-2 focus:ring-yellow-500"
              />
              <span
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-4 top-[45px] cursor-pointer text-yellow-600 text-xl"
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </label>
            {error && (
              <div className="text-red-600 font-medium mt-1 text-left w-full">
                {error}
              </div>
            )}
            <div className="flex gap-4 justify-center mt-2">
              <button type="submit" className="bg-blue-600 text-white rounded-lg px-6 py-3 font-semibold cursor-pointer shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors">Register</button>
              <button type="button" onClick={handleCancel} className="bg-yellow-50 text-yellow-600 rounded-lg px-6 py-3 font-semibold cursor-pointer hover:bg-yellow-100 transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
