import React, { useState } from 'react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Add login logic here
    alert(`Logging in as ${username}`);
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
