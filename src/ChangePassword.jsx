import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword } = formData;

    if (!currentPassword || !newPassword) {
      alert('Please fill in both fields.');
      return;
    }

    try {
      const userData = JSON.parse(localStorage.getItem('user'));

      const payload = {
        userId: userData.userId,
        currentPassword,
        newPassword
      };

      const res = await fetch(global.url + '/api/User/ChangePassword', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Password changed successfully!');
        setFormData({ currentPassword: '', newPassword: '' });
      } else {
        const errorMsg = await res.text();
        alert('Error: ' + errorMsg);
      }
    } catch (error) {
      console.error('Password change error:', error);
      alert('Failed to change password.');
    }
  };

  return (
    <div className="container mt-4">
      <h4>Change Password</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Current Password</label>
          <input
            type="password"
            className="form-control"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Enter current password"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type="password"
            className="form-control"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
          />
        </div>

        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </div>
  );
};

export default ChangePassword;
