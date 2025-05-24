import React, { useState } from 'react';
import './Dashboard.css';
import StudentsandStaffs from './StudentsandStaffs';

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState('home');

  return (
    <div className="dashboard d-flex">
      {/* Sidebar */}
      <div className="sidebar p-4">
        <div className="profile text-center mb-4">
          <div className="avatar mb-2"></div>
          <h5 className="text-white">JOHN DON</h5> 
        </div>
        <ul className="nav flex-column text-white">
          <li className="nav-item mb-3" onClick={() => setActiveMenu('home')}>
            <i className="bi bi-house-door me-2"></i> Home
          </li>
          <li className="nav-item mb-3" onClick={() => setActiveMenu('addStudent')}>
            <i className="bi bi-person-plus me-2"></i> Students and Staffs
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="main-content flex-grow-1 p-4">
        {activeMenu === 'home' && (
          <>
            <h4>Dashboard User</h4>
            <div className="row mt-4">
              {/* Stat Cards */}
              <div className="col-md-4">
                <div className="card stat-card d-flex flex-row align-items-center">
                  <div className="icon-box bg-primary text-white">
                    <i className="bi bi-wallet2 fs-4"></i>
                  </div>
                  <div className="card-body">
                    <h6>Total Amount</h6>
                    <h3>₹ XXX</h3>
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
                    <h3>₹ XXX</h3>
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
                    <h3>₹ XXX</h3>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {activeMenu === 'addStudent' && <StudentsandStaffs />}
      </div>
    </div>
  );
};

export default Dashboard;
