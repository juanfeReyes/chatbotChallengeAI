import React, { useState } from 'react';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import useLocalStorage from '~/hook/useLocalStorage';
import api from '~/services/axiosInterceptor';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useLocalStorage<string>('token', '');
  let navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const loginResult = await api.post("/api/v1/login", { username, password })
    setToken(loginResult.data.token)
    navigate('/')
  };

  const handleClear = () => {
    setUsername('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 relative">
      <a href="/" className="absolute top-6 left-6 text-blue-600 underline font-medium text-base z-10">Home</a>
      <div className="h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-[350px] flex flex-col items-center">
          <h2 className="text-center text-blue-600 mb-8 font-bold tracking-wide">Login</h2>
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-5">
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
            <label className="font-medium text-blue-600">
              Password
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-3 py-3 mt-2 rounded-lg border border-blue-200 outline-none text-base bg-blue-50 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <div className="flex gap-4 justify-center mt-2">
              <button type="submit" className="bg-blue-600 text-white rounded-lg px-6 py-3 font-semibold cursor-pointer shadow-md shadow-blue-200 hover:bg-blue-700 transition-colors">Login</button>
              <button type="button" onClick={handleClear} className="bg-blue-50 text-blue-600 rounded-lg px-6 py-3 font-semibold cursor-pointer hover:bg-blue-100 transition-colors">Clear</button>
            </div>
          </form>
          <div className="mt-8 text-center">
            <a href="/register" className="text-blue-600 underline font-medium hover:text-blue-700">Do not have account yet? Register now!</a>
          </div>
          <div className="mt-8 text-center">
            <a href="/api/v1/auth/google" className="text-blue-600 underline font-medium hover:text-blue-700">
              <div className="flex gap-2 items-center">
                <FaGoogle /> Login with Google
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
