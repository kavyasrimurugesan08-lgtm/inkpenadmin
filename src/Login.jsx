import { useState } from 'react';

const AU = 'jawaharkumar';
const AP = 'admin123';
const AK = 'inkpen-admin-auth';
const API_BASE = import.meta.env?.VITE_API_URL || 'http://localhost:4000/api';

export default function Login({ logo, onSuccess }) {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u.trim(), password: p })
      });
      if (res.ok) {
        try { sessionStorage.setItem(AK, '1'); } catch (x) {}
        onSuccess();
        return;
      }
      const data = await res.json();
      setErr(data.error || 'Incorrect username or password.');
    } catch (networkErr) {
      // Fallback to local auth if backend is offline
      if (u.trim().toLowerCase() === AU && (p === AP || p === 'Admin123')) {
        try { sessionStorage.setItem(AK, '1'); } catch (x) {}
        setErr('');
        onSuccess();
      } else {
        setErr('Incorrect username or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login">
      <div className="card">
        <div className="chip"><img src={logo} alt="INKPEN" /></div>
        <h1>Admin sign in</h1>
        <p className="mute" style={{ margin: 0 }}>Enter your admin username and password.</p>
        <form autoComplete="off" noValidate onSubmit={submit}>
          <label htmlFor="lgu">Username
            <input id="lgu" autoFocus autoComplete="username" required value={u} onChange={(e) => setU(e.target.value)} />
          </label>
          <label htmlFor="lgp">Password
            <div className="pwrow">
              <input id="lgp" type={show ? 'text' : 'password'} autoComplete="current-password" required value={p} onChange={(e) => setP(e.target.value)} />
              <button type="button" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(!show)}>👁</button>
            </div>
          </label>
          <p id="lgerr" role="alert">{err}</p>
          <button className="btn p" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}

