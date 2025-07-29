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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f0ff 0%, #b3d8ff 100%)', position: 'relative' }} >
      <a href="/" style={{ position: 'absolute', top: 24, left: 24, color: '#1976d2', textDecoration: 'underline', fontWeight: 500, fontSize: '1rem', zIndex: 2 }}>Home</a>
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2.5rem 2rem', width: '100%', maxWidth: 350, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: '2rem', fontWeight: 700, letterSpacing: 1 }}>Login</h2>
          <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <label style={{ fontWeight: 500, color: '#1976d2' }}>
              Username
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.7rem 0.7rem 0.7rem 0.2rem',
                  marginTop: '0.5rem',
                  borderRadius: '8px',
                  border: '1px solid #b3d8ff',
                  outline: 'none',
                  fontSize: '1rem',
                  background: '#f5faff',
                  color: '#1976d2'
                }}
              />
            </label>
            <label style={{ fontWeight: 500, color: '#1976d2' }}>
              Password
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.7rem 0.7rem 0.7rem 0.2rem',
                  marginTop: '0.5rem',
                  borderRadius: '8px',
                  border: '1px solid #b3d8ff',
                  outline: 'none',
                  fontSize: '1rem',
                  background: '#f5faff',
                  color: '#1976d2'
                }}
              />
            </label>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '0.5rem' }}>
              <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.7rem 1.5rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(25,118,210,0.08)' }}>Login</button>
              <button type="button" onClick={handleClear} style={{ background: '#e3f0ff', color: '#1976d2', border: 'none', borderRadius: '8px', padding: '0.7rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}>Clear</button>
            </div>
          </form>
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <a href="/login/register" style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500 }}>Do not have account yet? Register now!</a>
          </div>
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <a href="/api/v1/auth/google" style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 500 }}>
              <div className='flex gap-2 items-center'>
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
