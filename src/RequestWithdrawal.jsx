import React, { useEffect, useState } from 'react';
import './Dashboard.css';

const RequestWithdrawal = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState('Loading...');
  const [message, setMessage] = useState('');
  const [requestHistory, setRequestHistory] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const userData = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (userData && userData.userId) {
      fetchBalance();
      fetchRequestHistory();
    } else {
      setBalance('Unavailable');
    }
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch(`${global.url}/api/Account/GetBalancebyId/${userData.userId}`, {
        headers: { 'Authorization': `Bearer ${userData.token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch balance');
      const data = await response.json();
      setBalance(`₹ ${data}`);
    } catch (error) {
      console.error(error);
      setBalance('Unavailable');
    }
  };

  const fetchRequestHistory = async () => {
    try {
      const response = await fetch(`${global.url}/api/Request/GetRequestsByUserId/${userData.userId}`, {
        headers: { 'Authorization': `Bearer ${userData.token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch request history');
      const data = await response.json();
      setRequestHistory(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = async () => {
    if (!description || !amount) {
      alert("Please enter both description and amount.");
      return;
    }

    try {
      const response = await fetch(`${global.url}/api/Request/SubmitRequest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData.token}`,
        },
        body: JSON.stringify({
          user_id: userData.userId,
          description,
          amount: parseFloat(amount)
        }),
      });

      if (!response.ok) throw new Error('Submission failed');
      setMessage('Request submitted successfully!');
      setDescription('');
      setAmount('');
      fetchRequestHistory();
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong while submitting.');
    }
  };

  return (
  <div className="request-withdrawal">
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h4>Withdrawal Requests</h4>
      <button className="btn btn-success" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Close Form' : 'Request'}
      </button>
    </div>

    

    {message && <div className="alert alert-info">{message}</div>}

    {/*Show form if toggled */}
    
    {showForm && (
      
      <div className="mb-4 p-3 border rounded bg-light">
        <div className="mb-3">
          <div className="mb-3"><strong>Current Balance:</strong> {balance}</div>
          <label>Description</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Reason for withdrawal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Amount</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={handleSend}>
          Submit Request
        </button>
      </div>
    )}

    {/*Show table only if form is hidden */}
    {!showForm && (
      <>
      
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <div className="table-responsive">
          <table className="table table-bordered mt-3">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Request Date</th>
                <th>Proceeded Date</th>
                <th>Status</th>
                <th>Rejection Reason</th>
              </tr>
            </thead>
            <tbody>
              {requestHistory.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">No requests found</td>
                </tr>
              ) : (
                requestHistory.map((req, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{req.description}</td>
                    <td>₹ {req.amount}</td>
                    <td>{new Date(req.request_date).toLocaleDateString()}</td>
                    <td>{req.proceeded_date ? new Date(req.proceeded_date).toLocaleDateString() : '-'}</td>
                    <td>{req.status}</td>
                    <td>{req.rejectionReason || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </div>
      </>
    )}
  </div>
);

};

export default RequestWithdrawal;
