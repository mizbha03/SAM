import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form } from 'react-bootstrap';

const Withdrawal = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const adminId = JSON.parse(localStorage.getItem('user'))?.userId;

  const fetchRequests = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const res = await fetch(`${global.url}/api/Request/GetAllRequests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to fetch withdrawal requests');
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const openRejectModal = (requestId) => {
    setSelectedRequestId(requestId);
    setRejectionReason('');
    setShowModal(true);
  };

  const handleReject = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const res = await fetch(`${global.url}/api/Request/RejectRequest/${selectedRequestId}/${adminId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rejectionReason: rejectionReason }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to reject request');
      }

      setRequests(requests.map(req =>
        req.request_id === selectedRequestId
          ? { ...req, status: 'Rejected', proceededBy: adminId, proceededDate: new Date().toLocaleDateString(), RequestReason: rejectionReason }
          : req
      ));
      setShowModal(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const res = await fetch(`${global.url}/api/Request/ApproveRequest/${requestId}/${adminId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to approve request');
      }

      setRequests(requests.map(req =>
        req.request_id === requestId
          ? { ...req, status: 'Approved', proceededBy: adminId, proceededDate: new Date().toLocaleDateString() }
          : req
      ));
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  // const updatePaymentStatus = async (requestId, newStatus) => {
  //   try {
  //     const token = JSON.parse(localStorage.getItem('token'));
  //     await fetch(`${global.url}/api/Request/UpdatePaymentStatus/${requestId}`, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ newStatus }),
  //     });

  //     setRequests(requests.map(req =>
  //       req.request_id === requestId ? { ...req, Payment_status: newStatus } : req
  //     ));
  //   } catch (err) {
  //     console.error(err);
  //     setError('Failed to update payment status');
  //   }
  // };

  return (
    <div className="container mt-4">
      <h4>Withdrawal Requests</h4>
      {error && <div className="alert alert-danger">{error}</div>}

      {requests.length === 0 ? (
        <p>No withdrawal requests available.</p>
      ) : (
        <div style={{ maxHeight: '500px', overflowY: 'auto' }} className="mt-3">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                {/* <th>Payment Status</th> */}
                <th>Requested Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, index) => (
                <tr key={req.request_id}>
                  <td>{index + 1}</td>
                  <td>{req.userName || req.UserName || req.name}</td>
                  <td>{req.description}</td>
                  <td>₹ {req.amount}</td>
                  <td>
                    <span className={`badge bg-${req.status === 'Approved' ? 'success' : req.status === 'Rejected' ? 'danger' : 'secondary'}`}>
                      {req.status || 'Pending'}
                    </span>
                  </td>
                  
                    {/* <select
                      className="form-select form-select-sm"
                      value={req.Payment_status || 'Unpaid'}
                      onChange={(e) => updatePaymentStatus(req.request_id, e.target.value)}
                    >
                      <option value="Unpaid">Unpaid</option>
                      <option value="Paid">Paid</option>
                    </select> */}
                  
                  <td>{req.request_date}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => handleApprove(req.request_id)}
                      disabled={req.status === 'Approved' || req.status === 'Rejected'}>
                      Approve
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => openRejectModal(req.request_id)}
                      disabled={req.status === 'Approved' || req.status === 'Rejected'}>
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Reason Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Rejection Reason</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Reason for rejecting the request:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter reason"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleReject}>Reject</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Withdrawal;
