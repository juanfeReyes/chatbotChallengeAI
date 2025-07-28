import React, { useState } from 'react';
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
    
    const loginResult = await api.post("/api/v1/login", {username, password})
    setToken(loginResult.data.token)
    navigate('/')
  };

  const handleClear = () => {
    setUsername('');
    setPassword('');
  };

  return (
    <div style={{ maxWidth: 300, margin: '2rem auto' }}>
      <h2 style={{ textAlign: 'center' }}>Login</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit">Login</button>
          <button type="button" onClick={handleClear}>Clear</button>
        </div>
      </form>
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <a href="/login/register">Do not have account yet? Register now!</a>
      </div>
    </div>
  );
};

export default Login;
