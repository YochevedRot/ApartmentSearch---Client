// LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../App'
import './LoginPage.css';

/**
 * LoginPage checks if a user exists by email; if not, prompts registration.
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [phase, setPhase] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:5031/api/User?email=${email}`);
      // Here you could verify password if API supports it
      login(res.data);
      navigate('/personal', { replace: true });
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // User not found, switch to register
        setPhase('register');
        setError('No account found. Please register.');
      } else {
        setError('Login failed.');
      }
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    try {
      const payload = { name, email, phone, password };
      const res = await axios.post('http://localhost:5031/api/User', payload);
      login(res.data);
      navigate('/personal', { replace: true });
    } catch {
      setError('Registration failed.');
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={phase === 'login' ? handleLogin : handleRegister}>
        <h2>{phase === 'login' ? 'Login' : 'Register'}</h2>
        {error && <p className="login-error">{error}</p>}
        {phase === 'register' && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">
          {phase === 'login' ? 'Login' : 'Register'}
        </button>
        {phase === 'login' ? (
          <p className="toggle-text">
            No account? <span onClick={() => { setPhase('register'); setError(''); }} className="toggle-link">Register here</span>
          </p>
        ) : (
          <p className="toggle-text">
            Have an account? <span onClick={() => { setPhase('login'); setError(''); }} className="toggle-link">Login here</span>
          </p>
        )}
      </form>
    </div>
  );
}
