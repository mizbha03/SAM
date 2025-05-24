import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const StudentsandStaffs = () => {
  const [user, setUser] = useState({
    user_id: '',
    name: '',
    userName: '',
    password: '',
    role: 'student',
    profileImage: ''
  });

  const [users, setUsers] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userData = JSON.parse(localStorage.getItem('user'));
  const token = userData?.token;

  const roleToNumber = {
    admin: 1,
    student: 2,
    staff: 3
  };

  const numberToRole = {
    1: 'admin',
    2: 'student',
    3: 'staff'
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${global.url}/api/User/GetAllUser`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Only = reader.result.split(',')[1];
      setUser((prev) => ({ ...prev, profileImage: base64Only }));
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Validation: Check that name, username, and password (if adding a new user) are provided
  if (!user.name || !user.userName || (!editingId && !user.password)) {
    alert('Please fill all required fields');
    return;
  }

  setIsSubmitting(true);

  // Create payload with user_id for editing, or 0 for a new user
  const payload = {
    ...user,
    role: roleToNumber[user.role], // Ensure the role is being mapped to the correct number
    user_id: editingId || undefined  // If editing, include user_id, else don't include it
  };

  const endpoint = editingId
    ? `${global.url}/api/User/Update`
    : `${global.url}/api/User/Add`;

  try {
    const res = await fetch(endpoint, {
      method: editingId ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Failed to save user');

    alert(editingId ? 'User updated successfully' : 'User added successfully');

    // Reset form after successful submission
    setUser({
      name: '',
      userName: '',
      password: '',
      role: 'student',
      profileImage: ''
    });
    setImagePreview(null);
    setEditingId(null);
    fetchUsers();  
  } catch (err) {
    alert('Error: ' + err.message);
  } finally {
    setIsSubmitting(false);
  }
};
  const handleEdit = (u) => {
    setUser({
      user_id: u.user_id,
      name: u.name,
      userName: u.userName,
      password: '',
      role: numberToRole[u.role],
      profileImage: ''
    });
    setImagePreview(u.profileImage ? `data:image/jpeg;base64,${u.profileImage}` : null);
    setEditingId(u.user_id);
  };

  const handleDelete = async (user_id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`${global.url}/api/User/Delete/${user_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to delete user');

      alert('User deleted');
      fetchUsers();
    } catch (error) {
      alert('Error deleting user');
    }
  };

  return (
    <div className="container mt-4">
      <h4>{editingId ? 'Edit User' : 'Add User'}</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            className="form-control"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Username</label>
          <input
            className="form-control"
            name="userName"
            value={user.userName}
            onChange={handleChange}
            required
          />
        </div>

        {!editingId && (
          <div className="mb-3">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="mb-3">
          <label>Role</label>
          <select
            className="form-select"
            name="role"
            value={user.role}
            onChange={handleChange}
          >
            <option value="student">Student</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="mb-3">
          <label>Profile Image</label>
          <input
            className="form-control"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {imagePreview && (
          <div className="mb-3">
            <label className="form-label d-block">Preview:</label>
            <img
              src={imagePreview}
              alt="Preview"
              className="img-thumbnail"
              style={{ width: '100px', height: '100px' }}
            />
          </div>
        )}

        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : editingId ? 'Update User' : 'Add User'}
        </button>
      </form>

      <hr />

      <h5>User List</h5>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Username</th>
            <th>Role</th>
            <th>Profile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">No users found.</td>
            </tr>
          ) : (
            users.map((u, i) => (
              <tr key={u.user_id}>
                <td>{i + 1}</td>
                <td>{u.name}</td>
                <td>{u.userName}</td>
                <td>{numberToRole[u.role]}</td>
                <td>
                  {u.profileImage ? (
                    <img
                      src={`data:image/jpeg;base64,${u.profileImage}`}
                      alt="profile"
                      style={{ width: 40, height: 40, borderRadius: '50%' }}
                    />
                  ) : (
                    <i className="bi bi-person-circle fs-4"></i>
                  )}
                </td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(u)}>
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.user_id)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsandStaffs;
