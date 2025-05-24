import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; 
import './login.css';

const Login = () => {
  const history = useHistory(); 
  const [isStudent, setIsStudent] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [response, setResponse] = useState(null);

  const toggleRole = () => {
    setIsStudent(!isStudent);
    setError('');
  };

const handleLogin = async (e) => {
  e.preventDefault();

  const payload = { username, password };

  try {
    const res = await fetch(global.url + '/api/Auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const contentType = res.headers.get("content-type");

    let responseJson;
    if (contentType && contentType.includes("application/json")) {
      responseJson = await res.json();
    } else {
      const text = await res.text();
      throw new Error(text);
    }

    if (responseJson.error === true) {
      const msg = responseJson.message?.toLowerCase();
      if (msg.includes('username')) {
        setError('Invalid username');
      } else if (msg.includes('password')) {
        setError('Invalid password');
      } else {
        setError('Invalid username or password');
      }
    } else {
      const userData = responseJson;

      if (!userData || !userData.role) {
        setError('Invalid user data received from server.');
        return;
      }

      const actualRole = userData.role.toLowerCase();
      const expectedRole = isStudent ? 'student' : 'admin';

      if (actualRole !== expectedRole) {
        setError(`Please log in through the correct ${actualRole} login portal.`);
        return;
      }

      localStorage.setItem("token", JSON.stringify(userData.token));
      localStorage.setItem("username", userData.username);
      localStorage.setItem("role", userData.role);
      localStorage.setItem('user', JSON.stringify(userData));

      setResponse(userData);

      if (actualRole === 'student') {
        history.push('/Student_Dashboard');
      } else if (actualRole === 'admin') {
        history.push('/Admin_Dashboard');
      } else {
        setError('Unknown role');
      }
    }
  } catch (err) {
    setError('Invalid username or password'); 
  }
};


  return (
    <div className={`login-container ${isStudent ? 'slide' : ''}`}>
      <div className="panel">
        <h2>Welcome</h2>
        <p>Manage Your Accounts Efficiently and Securely</p>
        <button onClick={toggleRole}>
          {isStudent ? 'Admin Sign In' : 'Student Sign In'}
        </button>
      </div>

      <div className="form-container">
        <h2 className="form-heading">{isStudent ? 'Student' : 'Admin'} Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder={isStudent ? 'Student Username' : 'Admin Username'}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-btn">Login</button>
        </form>

        {response && (
          <div className="success-message">
            Logged in as: <strong>{response.Username}</strong> ({response.Role})
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
