import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Deposit = () => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    selectedUserId: '',
    amount: '',
    paymentMode: '',
    depositDate: ''
  });

  const [deposits, setDeposits] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchDeposits();
  }, []);

  const fetchStudents = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(global.url + '/api/Reports/GetAllStudents', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
        }
      });

      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      } else {
        console.error('Failed to fetch students');
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const fetchDeposits = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(global.url + '/api/Reports/GetStudentDeposit', {
        headers: {
          'Authorization': `Bearer ${userData.token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setDeposits(data);
      }
    } catch (error) {
      console.error('Failed to fetch deposits:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { selectedUserId, amount, paymentMode, depositDate } = formData;

    if (!selectedUserId || !amount || !paymentMode || !depositDate) {
      alert('Please fill in all fields.');
      return;
    }

    const admin = JSON.parse(localStorage.getItem('user'));

    const payload = {
      user_id: parseInt(selectedUserId),
      type: 'deposit',
      amount: parseFloat(amount),
      mode: paymentMode,
      admin_id: admin.userId,
      tDate: depositDate,
      status: 'active'
    };

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(global.url + '/api/Statement/Add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Deposit successful!');
        setFormData({
          selectedUserId: '',
          amount: '',
          paymentMode: '',
          depositDate: ''
        });
        setShowForm(false);
        fetchDeposits();
      } else {
        const errorMsg = await res.text();
        alert('Error: ' + errorMsg);
      }
    } catch (error) {
      console.error('Error submitting deposit:', error);
      alert('Failed to submit deposit.');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this deposit?')) return;

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(`${global.url}/api/Reports/DeleteStudentDeposit/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userData.token}`
        }
      });

      if (res.ok) {
        alert('Deleted successfully');
        fetchDeposits();
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while deleting');
    }
  };

  const handleUpdate = async (deposit) => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(global.url + '/api/Reports/UpdateStudentDeposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`
        },
        body: JSON.stringify(deposit)
      });

      if (res.ok) {
        alert('Updated successfully');
        fetchDeposits();
        setEditIndex(-1);
      } else {
        alert('Failed to update');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred during update');
    }
  };

  return (
    <div className="container mt-4">
      {!showForm ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4>All Deposits</h4>
            <button className="btn btn-success" onClick={() => setShowForm(true)}>Deposit</button>
          </div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Amount</th>
                <th>Mode</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((dep, index) => (
                <tr key={dep.user_id}>
                  <td>{dep.studentName}</td>
                  <td>
                    {editIndex === index ? (
                      <input
                        type="number"
                        value={dep.amount}
                        onChange={(e) => {
                          const updated = [...deposits];
                          updated[index].amount = e.target.value;
                          setDeposits(updated);
                        }}
                      />
                    ) : (
                      dep.amount
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <select
                        value={dep.mode}
                        onChange={(e) => {
                          const updated = [...deposits];
                          updated[index].mode = e.target.value;
                          setDeposits(updated);
                        }}
                      >
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                      </select>
                    ) : (
                      dep.mode
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <input
                        type="date"
                        value={dep.tDate }
                        onChange={(e) => {
                          const updated = [...deposits];
                          updated[index].tDate = e.target.value;
                          setDeposits(updated);
                        }}
                      />
                    ) : (
                       dep.tDate
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <>
                        <button className="btn btn-success btn-sm me-2" onClick={() => handleUpdate(dep)}>Save</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => setEditIndex(-1)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-warning btn-sm me-2" onClick={() => setEditIndex(index)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(dep.user_id)}>
                          <i className="bi bi-trash"></i>
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <>
          <h4>Make a Deposit</h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Select Student</label>
              <select
                className="form-select"
                name="selectedUserId"
                value={formData.selectedUserId}
                onChange={handleChange}
              >
                <option value="">-- Select Student --</option>
                {students.map((s) => (
                  <option key={s.user_id} value={s.user_id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Amount</label>
              <input
                type="number"
                className="form-control"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Payment Mode</label>
              <select
                className="form-select"
                name="paymentMode"
                value={formData.paymentMode}
                onChange={handleChange}
              >
                <option value="">-- Select Mode --</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Deposit Date</label>
              <input
                type="date"
                className="form-control"
                name="depositDate"
                value={formData.depositDate}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn btn-success me-2">Submit Deposit</button>
            <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Back</button>
          </form>
        </>
      )}
    </div>
  );
};

export default Deposit;
