import React, { useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './Dashboard.css';

const AdminStatement = () => {
  // const [fromDate, setFromDate] = useState('');
  // const [toDate, setToDate] = useState('');
const today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(today.getMonth() - 1);
const formatDate = (date) => date.toISOString().split('T')[0];

  const [fromDate, setFromDate] = useState(oneMonthAgo.toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(today.toISOString().split('T')[0]);
  const maxDate = formatDate(today);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [students, setStudents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  const token = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    fetchStudents();
    fetchTransactions();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${global.url}/api/Reports/GetAllStudents`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch students');
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
      setError('Error fetching students');
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${global.url}/api/Reports/GetAdminStatements`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error('Failed to fetch transactions');
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      console.error(err);
      setError('Error fetching transaction data');
    }
  };

  const filteredData = transactions.filter(entry => {
    const entryDate = new Date(entry.date || entry.tDate);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    const matchesDate = (!from || entryDate >= from) && (!to || entryDate <= to);
    const matchesStudent = !selectedStudent || entry.studentName === selectedStudent;

    return matchesDate && matchesStudent;
  });

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['T_id', 'Student', 'Type', 'Amount', 'Mode', 'TDate']],
      body: filteredData.map((txn , idx) => [
        idx + 1,
        txn.studentName,
        txn.type,
        `₹ ${txn.amount}`,
        txn.mode,
        new Date(txn.tDate).toLocaleDateString(),
      ]),
    });
    doc.save('statement.pdf');
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData.map((txn, idx) => ({
      T_id: idx + 1,
      Student: txn.studentName,
      Type: txn.type,
      Amount: txn.amount,
      Mode: txn.mode,
      TDate: new Date(txn.tDate).toLocaleDateString(),
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Statement');
    XLSX.writeFile(workbook, 'statement.xlsx');
  };

  return (
    <div className="card p-4 shadow rounded-4">
      <h4 className="mb-4">Statement</h4>

      {error && <div className="alert alert-danger">{error}</div>}

      {/* Filters */}
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
      <div className="row align-items-end mb-4">
        <div className="col-md-3">
          <label className="form-label fw-semibold">From</label>
          <input
            type="date"
            className="form-control rounded-3"
            value={fromDate}
            max={maxDate}
            onChange={e => setFromDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold">To</label>
          <input
            type="date"
            className="form-control rounded-3"
            value={toDate}
            max={maxDate}
            onChange={e => setToDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold">Student</label>
          <select
            className="form-select rounded-3"
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
          >
            <option value="">All Students</option>
            {students.map((s, idx) => (
              <option key={idx} value={s.name || s.Name}>
                {s.name || s.Name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3 text-end">
          <button className="btn btn-outline-primary me-2 rounded-3" onClick={exportPDF}>
            <i className="bi bi-filetype-pdf me-1"></i> PDF
          </button>
          <button className="btn btn-outline-success rounded-3" onClick={exportExcel}>
            <i className="bi bi-file-earmark-excel me-1"></i> Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <div style={{ maxHeight: '500px', overflowY: 'auto' }} className="mt-3">
        <Table className="table table-striped table-hover rounded-4 overflow-hidden">
          <thead className="table-light">
            <tr>
              <th>T_id</th>
              <th>Student</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Mode</th>
              <th>TDate</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">No transactions found.</td>
              </tr>
            ) : (
              filteredData.map((txn, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>  
                  <td>{txn.studentName}</td>
                  <td>{txn.type}</td>
                  <td>₹ {txn.amount}</td>
                  <td>{txn.mode}</td>
                  <td>{new Date(txn.tDate).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
    </div>
    </div>
  );
};

export default AdminStatement;
