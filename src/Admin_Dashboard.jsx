import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Dropdown, ButtonGroup } from 'react-bootstrap';
import AddStudents from './AddStudents';
import Deposit from './Deposit';
import Withdrawal from './Withdrawal';
import AdminStatement from './AdminStatement';

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('home');
  const [showStudentSubmenu, setShowStudentSubmenu] = useState(false);
  const [username, setUsername] = useState('');
  const [totals, setTotals] = useState({ totalDeposit: 0, totalWithdraw: 0 });
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = JSON.parse(localStorage.getItem('token'));
    const storedUsername = localStorage.getItem('username');

    if (user && user.userId) {
      setUsername(storedUsername || 'User');

      const headers = { Authorization: `Bearer ${token}` };

      fetch(global.url + '/api/Reports/GetStudentTotals', { headers })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setTotals({
              totalDeposit: data[0].totalDeposit || 0,
              totalWithdraw: data[0].totalWithdraw || 0
            });
          }
        });

      fetch(global.url + '/api/Reports/GetTotalAmount', { headers })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setTotalAmount(data[0].total_Amount || 0);
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
          {/* <div className="avatar mb-2"></div> */}
          <h5 className="text-white">{username}</h5>
        </div>

        <ul className="nav flex-column text-white">
          <li className="nav-item mb-3" onClick={() => setActiveMenu('home')}>
            <i className="bi bi-house-door me-2"></i> Home
          </li>
          <li className="nav-item mb-3" onClick={() => setShowStudentSubmenu(!showStudentSubmenu)}>
            <i className="bi bi-person me-2"></i> Students
          </li>
          {showStudentSubmenu && (
            <ul className="nav flex-column ms-3">
              <li
                className="nav-item mb-2"
                onClick={() => setActiveMenu('addStudent')}
                style={{ cursor: 'pointer' }}
              >
                View Students
              </li>
            </ul>
          )}
          <li className="nav-item mb-3" onClick={() => setActiveMenu('deposit')}>
            <i className="bi bi-arrow-down me-2"></i> Deposit
          </li>
          <li className="nav-item mb-3" onClick={() => setActiveMenu('withdrawal')}>
            <i className="bi bi-arrow-up me-2"></i> Withdraw
          </li>
          <li className="nav-item mb-3" onClick={() => setActiveMenu('statement')}>
            <i className="bi bi-file-earmark-text me-2"></i> Statement
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="main-content flex-grow-1 p-4">
        
        <div className="d-flex justify-content-end mb-3">
          <Dropdown as={ButtonGroup}>
            <Dropdown.Toggle variant="secondary" id="settings-dropdown">
              <i className="bi bi-gear">Settings</i>
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item onClick={handleLogout} className="text-danger">
                <i className="bi bi-box-arrow-right me-2"></i> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {activeMenu === 'home' && (
          <>
            <h4>Admin Dashboard</h4>
            <div className="row mt-4">
              <div className="col-md-4">
                <div className="card stat-card d-flex flex-row align-items-center">
                  <div className="icon-box bg-primary text-white">
                    <i className="bi bi-wallet2 fs-4"></i>
                  </div>
                  <div className="card-body">
                    <h6>Total Amount</h6>
                    <h3>₹ {totalAmount.toFixed(2)}</h3>
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

        {activeMenu === 'addStudent' && <AddStudents />}
        {activeMenu === 'deposit' && <Deposit />}
        {activeMenu === 'withdrawal' && <Withdrawal />}
        {activeMenu === 'statement' && <AdminStatement />}
      </div>
    </div>
  );
};

export default Dashboard;
