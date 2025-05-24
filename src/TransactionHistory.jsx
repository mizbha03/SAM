import React, { useEffect, useState } from 'react';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

 useEffect(() => {
  const fetchTransactions = async () => {
    try {
 const userData = JSON.parse(localStorage.getItem('user'));
 console.log('User Data from localStorage:', userData); 
    if (!userData || !userData.userId) {
      setError('User ID not found');
      return;
    }
const userId = userData.userId;

// if (!userId) {
//   setError('User ID not found');
//   return;
// }

      const response = await fetch(`${global.url}/api/Reports/GetStudentStatementsById/${userId}`, {
  headers: {
    'Authorization': `Bearer ${userData.token}`
  }
});
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch data');
      }

      setTransactions(data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong');
    }
  };

  fetchTransactions();
}, []);


  return (
    <div className="transaction-history">
      <h4>Transaction History</h4>
      {error && <p className="text-danger">{error}</p>}
      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
      <table className="table">
        <thead>
          <tr>
            <th>T_id</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Mode</th>
            <th>TDate</th>
            {/* <th>AdminName</th> */}
          </tr>
        </thead>
         <tbody>
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => {
              const formattedDate = new Date(transaction.tDate);
              const dateString = isNaN(formattedDate.getTime())
                ? "Invalid Date"
                : formattedDate.toLocaleDateString();

              return (
                <tr key={index}>
                  <td>{transaction.t_id}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.mode}</td>
                  <td>{dateString}</td> 
                  {/* <td>{transaction.adminName}</td> */}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center">No transactions found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default TransactionHistory;
