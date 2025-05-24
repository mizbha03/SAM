import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './Dashboard.css';

const Statement = () => {
  const [data, setData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const userData = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchStatements = async () => {
      try {
        if (!userData || !userData.userId || !userData.token) {
          console.error('User data missing');
          return;
        }

        const response = await fetch(`${global.url}/api/Reports/StudentStatementById/${userData.userId}`, {
          headers: {
            'Authorization': `Bearer ${userData.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch statements');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Error fetching statements:', err);
      }
    };

    fetchStatements();
  }, []);

  const filteredData = data.filter(entry => {
    const entryDate = new Date(entry.tDate);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;
    return (!from || entryDate >= from) && (!to || entryDate <= to);
  });

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['T_id', 'Type', 'Amount', 'Mode', 'TDate', 'Balance']],
      body: filteredData.map(txn => [txn.t_id, txn.type, txn.amount, txn.mode, txn.tDate, txn.balance]),
    });
    doc.save('statement.pdf');
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Statement');
    XLSX.writeFile(workbook, 'statement.xlsx');
  };

  return (
    <div className="card p-4 shadow rounded-4">
      <h4 className="mb-4">Statement</h4>

      {/* Date Filter */}
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
      <div className="row align-items-end mb-4">
        <div className="col-md-3">
          <label className="form-label fw-semibold">From</label>
          <input
            type="date"
            className="form-control rounded-3"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label fw-semibold">To</label>
          <input
            type="date"
            className="form-control rounded-3"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
          />
        </div>
        <div className="col-md-6 text-end">
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
        <Table className="table table-striped table-hover rounded-4 overflow-hidden">
          <thead className="table-light">
            <tr>
              <th>T_id</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Mode</th>
              <th>TDate</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((txn, idx) => (
              <tr key={idx}>
                <td>{txn.t_id}</td>
                <td>{txn.type}</td>
                <td>₹ {txn.amount}</td>
                <td>{txn.mode}</td>
                <td>{txn.tDate}</td>
                <td>₹ {txn.balance}</td>
              </tr>
            ))}
          </tbody>
          
        </Table>
      </div>
      </div>
    </div>
  
  );
};

export default Statement;
