import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import TransactionHistory from './TransactionHistory';
import RequestWithdrawal from './RequestWithdrawal';
import Statement from './Statement';
import ChangePassword from './ChangePassword';
import { Dropdown, ButtonGroup } from 'react-bootstrap';

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('home');
  const [username, setUsername] = useState('');
  const [totals, setTotals] = useState({ totalDeposit: 0, totalWithdraw: 0 });
  const [balance, setBalance] = useState(0);
  const [profileImage, setProfileImage] = useState('');


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = JSON.parse(localStorage.getItem('token'));
    const storedUsername = localStorage.getItem('username');

    if (user && user.userId) {
      const userId = user.userId;
      setUsername(storedUsername || 'User');

      fetch(`${global.url}/api/Reports/GetStudentTotalsById/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setTotals({
              totalDeposit: data[0].totalDeposit || 0,
              totalWithdraw: data[0].totalWithdraw || 0,
            });
          }
        });

      fetch(`${global.url}/api/Account/GetBalancebyId/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setBalance(parseFloat(data) || 0));

        fetch(`${global.url}/api/Reports/AllStudents`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((students) => {
        const student = students.find(
          (s) => s.user_id === userId || s.User_id === userId
        );
        if (student?.profileImage) {
          setProfileImage(`data:image/jpeg;base64,${student.profileImage}`);
        }
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.replace('/');
  };

  return (
    <div className="dashboard d-flex">
      {/* Sidebar */}
      <div className="sidebar p-4">
        <div className="profile text-center mb-4">
          <div className="avatar mb-2">
            {
            profileImage ? (
            <img
            src={profileImage}
            alt="Profile"
            className="rounded-circle"
            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
            />
          ) : (
          <i className="bi bi-person-circle fs-1 text-white"></i>
          )}
          </div>
          <h5 className="text-white">{username}</h5>
        </div>
        <ul className="nav flex-column text-white">
          <li className="nav-item mb-3" onClick={() => setActiveMenu('home')}>
            <i className="bi bi-house-door me-2"></i> Home
          </li>
          <li className="nav-item mb-3" onClick={() => setActiveMenu('transactions')}>
            <i className="bi bi-file-earmark me-2"></i> Transaction History
          </li>
          <li className="nav-item mb-3" onClick={() => setActiveMenu('withdrawal')}>
            <i className="bi bi-envelope me-2"></i> Request History
          </li>
          <li className="nav-item mb-3" onClick={() => setActiveMenu('statement')}>
            <i className="bi bi-bell me-2"></i> Statement
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="main-content flex-grow-1 p-4">
        {/* React Bootstrap Settings Dropdown */}
        <div className="d-flex justify-content-end mb-3">
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle variant="secondary" id="dropdown-settings">
              <i className="bi bi-gear me-2"></i> Settings
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item onClick={() => setActiveMenu('changepassword')}>
                <i className="bi bi-lock me-2"></i> Change Password
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout} className="text-danger">
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {/* Page content rendering */}
        {activeMenu === 'home' && (
          <>
            <h4>Dashboard User</h4>
            <div className="row mt-4">
              <div className="col-md-4">
                <div className="card stat-card d-flex flex-row align-items-center">
                  <div className="icon-box bg-primary text-white">
                    <i className="bi bi-wallet2 fs-4"></i>
                  </div>
                  <div className="card-body">
                    <h6>Current Balance</h6>
                    <h3>₹ {balance.toFixed(2)}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card stat-card d-flex flex-row align-items-center">
                  <div className="icon-box bg-success text-white">
                    <i className="bi bi-arrow-down-circle fs-4"></i>
                  </div>
                  <div className="card-body">
                    <h6>Total Deposit</h6>
                    <h3>₹ {totals.totalDeposit.toFixed(2)}</h3>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card stat-card d-flex flex-row align-items-center">
                  <div className="icon-box bg-danger text-white">
                    <i className="bi bi-arrow-up-circle fs-4"></i>
                  </div>
                  <div className="card-body">
                    <h6>Total Withdrawal</h6>
                    <h3>₹ {totals.totalWithdraw.toFixed(2)}</h3>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeMenu === 'transactions' && <TransactionHistory />}
        {activeMenu === 'withdrawal' && <RequestWithdrawal />}
        {activeMenu === 'statement' && <Statement />}
        {activeMenu === 'changepassword' && <ChangePassword />}
      </div>
    </div>
  );
};

export default Dashboard;
