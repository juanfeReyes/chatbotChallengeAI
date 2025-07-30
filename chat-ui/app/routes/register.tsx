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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f0ff 0%, #fffbe6 100%)', position: 'relative' }}>
      <a href="/login" style={{ position: 'absolute', top: 24, left: 24, color: '#1976d2', textDecoration: 'underline', fontWeight: 500, fontSize: '1rem', zIndex: 2 }}>Go back</a>
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg, #fffbe6 0%, #e3f0ff 100%)', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: '2.5rem 2rem', width: '100%', maxWidth: 350, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 style={{ textAlign: 'center', color: '#1976d2', marginBottom: '2rem', fontWeight: 700, letterSpacing: 1 }}>Register</h2>
          <form onSubmit={handleRegister} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
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
            <label style={{ fontWeight: 500, color: '#1976d2', position: 'relative' }}>
              Password
              <input
                type={showPassword ? "text" : "password"}
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
              <span
                onClick={() => setShowPassword((v) => !v)}
                style={{ position: 'absolute', right: 15, top: 45, cursor: 'pointer', color: '#1976d2', fontSize: '1.2rem' }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </label>
            <label style={{ fontWeight: 500, color: '#1976d2', position: 'relative' }}>
              Confirm Password
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.7rem 0.7rem 0.7rem 0.2rem',
                  marginTop: '0.5rem',
                  borderRadius: '8px',
                  border: '1px solid #ffe066',
                  outline: 'none',
                  fontSize: '1rem',
                  background: '#fffbe6',
                  color: '#d4a200'
                }}
              />
              <span
                onClick={() => setShowConfirmPassword((v) => !v)}
                style={{ position: 'absolute', right: 15, top: 45, cursor: 'pointer', color: '#d4a200', fontSize: '1.2rem' }}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </label>
            {error && (
              <div style={{ color: '#d32f2f', fontWeight: 500, marginTop: '0.2rem', textAlign: 'left', width: '100%' }}>
                {error}
              </div>
            )}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '0.5rem' }}>
              <button type="submit" style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.7rem 1.5rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(25,118,210,0.08)' }}>Register</button>
              <button type="button" onClick={handleCancel} style={{ background: '#fffbe6', color: '#d4a200', border: 'none', borderRadius: '8px', padding: '0.7rem 1.5rem', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
