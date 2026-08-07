import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const demoAccounts = [
  { label: 'Customer', email: 'customer@loanflow.com' },
  { label: 'Loan Officer', email: 'officer@loanflow.com' },
  { label: 'Manager', email: 'manager@loanflow.com' },
  { label: 'Admin', email: 'admin@loanflow.com' },
];

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (loginEmail: string) => {
    await login(loginEmail);
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
      <div style={{ background: '#1e293b', padding: '2.5rem', borderRadius: '12px', width: '360px', color: '#fff' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>LoanFlow AI</h1>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Sign in to continue</p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', marginBottom: '1rem' }}
        />
        <button
          onClick={() => handleLogin(email)}
          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none', background: '#3b82f6', color: '#fff', fontWeight: 600, cursor: 'pointer', marginBottom: '1.5rem' }}
        >
          Login
        </button>

        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.75rem' }}>Or try a demo account:</p>
        {demoAccounts.map((acc) => (
          <button
            key={acc.email}
            onClick={() => handleLogin(acc.email)}
            style={{ width: '100%', padding: '0.6rem', marginBottom: '0.5rem', borderRadius: '8px', border: '1px solid #334155', background: 'transparent', color: '#fff', cursor: 'pointer', textAlign: 'left' }}
          >
            {acc.label} <span style={{ color: '#64748b', fontSize: '0.75rem' }}>({acc.email})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LoginPage;