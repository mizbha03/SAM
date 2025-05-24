// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap-icons/font/bootstrap-icons.css';

// const AddStudents = () => {
//   const [student, setStudent] = useState({
//     name: '',
//     username: '',
//     password: '',
//     profileImage: ''
//   });
//   const [imagePreview, setImagePreview] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [students, setStudents] = useState([]);
//   const [editingId, setEditingId] = useState(null);

//   const userData = JSON.parse(localStorage.getItem('user'));
//   const token = userData?.token;
  

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const fetchStudents = async () => {
//     try {
//       const res = await fetch(`${global.url}/api/Reports/AllStudents`, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       const data = await res.json();
//       setStudents(data);
//     } catch (err) {
//       console.error('Failed to fetch students:', err);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setStudent((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const fullBase64 = reader.result;
//       const base64Only = fullBase64.split(',')[1];
//       setStudent((prev) => ({ ...prev, profileImage: base64Only }));
//       setImagePreview(fullBase64);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   const { name, username, password, profileImage } = student;

//   if (!name || !username || (!editingId && !password)) {
//     alert('Please fill in all required fields.');
//     return;
//   }

//   setIsSubmitting(true);

//   const payload = editingId
//     ? {
//         user_id: editingId,
//         name,
//         username,
//         password ,
//         profileImage ,
//       }
//     : {
        
//       name,
//       userName: username,
//       password,
//       profileImage,
//       };

//   try {
//     const url = editingId
//       ? `${global.url}/api/Reports/UpdateStudent`
//       : `${global.url}/api/Reports/AddStudent`;

//     const res = await fetch(url, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify(payload)
//     });

//     if (!res.ok) throw new Error('Failed to save student');

//     alert(editingId ? 'Student updated!' : 'Student added!');
//     setStudent({ name: '', username: '', password: '', profileImage: '' });
//     setImagePreview(null);
//     setEditingId(null);
//     fetchStudents();
//   } catch (err) {
//     alert('Error: ' + err.message);
//     console.error(err);
//   } finally {
//     setIsSubmitting(false);
//   }
// };


//   const handleEdit = (student) => {
//     setStudent({
//       name: student.name || student.Name,
//       username: student.userName || student.Username,
//       password: '',
//       profileImage: student.profileImage || ''
//     });
//     setImagePreview(student.profileImage ? `data:image/jpeg;base64,${student.profileImage}` : null);
//     setEditingId(student.user_id || student.User_id);
//   };

//   const handleDelete = async (User_id) => {
//     if (!window.confirm('Are you sure you want to delete this student?')) return;

//     try {
//       const res = await fetch(`${global.url}/api/Reports/DeleteStudent/${User_id}`, {
//         method: 'DELETE',
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       if (!res.ok) throw new Error('Failed to delete student');

//       alert('Student deleted.');
//       fetchStudents();
//     } catch (err) {
//       alert('Error: ' + err.message);
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h4>{editingId ? 'Edit Student' : 'Add New Student'}</h4>
//       <form onSubmit={handleSubmit} className="mt-3">
//         <div className="mb-3">
//           <label className="form-label">Name</label>
//           <input
//             type="text"
//             className="form-control"
//             name="name"
//             value={student.name}
//             onChange={handleChange}
//             placeholder="Enter name"
//             required
//           />
//         </div>

//         <div className="mb-3">
//           <label className="form-label">Username</label>
//           <input
//             type="text"
//             className="form-control"
//             name="username"
//             value={student.username}
//             onChange={handleChange}
//             placeholder="Enter username"
//             required
//           />
//         </div>

//         {!editingId && (
//           <div className="mb-3">
//             <label className="form-label">Password</label>
//             <input
//               type="password"
//               className="form-control"
//               name="password"
//               value={student.password}
//               onChange={handleChange}
//               placeholder="Enter password"
//               required
//             />
//           </div>
//         )}

//         <div className="mb-3">
//           <label className="form-label">Profile Image</label>
//           <input
//             type="file"
//             className="form-control"
//             accept="image/*"
//             onChange={handleImageChange}
//           />
//         </div>

//         {imagePreview && (
//           <div className="mb-3">
//             <label className="form-label d-block">Preview:</label>
//             <img
//               src={imagePreview}
//               alt="Preview"
//               className="img-thumbnail"
//               style={{ width: '100px', height: '100px' }}
//             />
//           </div>
//         )}

//         <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
//           {isSubmitting ? 'Saving...' : editingId ? 'Update Student' : 'Save Student'}
//         </button>
//       </form>

//       <hr className="my-4" />

//       <h5>All Students</h5>
//       <div style={{ maxHeight: '500px', overflowY: 'auto' }} className="mt-3">
//       <div className="table-responsive">
//         <table className="table table-striped">
//           <thead className="table-light">
//             <tr>
//               <th>#</th>
//               <th>Id</th>
//               <th>Profile</th>
//               <th>Name</th>
//               <th>Username</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {students.length === 0 ? (
//               <tr>
//                 <td colSpan="5" className="text-center">No students found.</td>
//               </tr>
//             ) : (
//               students.map((s, idx) => (
//                 <tr key={s.User_id || s.user_id || idx}>
//                   <td>{idx + 1}</td>
//                   <td>{s.user_id}</td>
//                   <td>
//                     {s.profileImage ? (
//                       <img
//                         src={`data:image/jpeg;base64,${s.profileImage}`}
//                         alt="Profile"
//                         style={{ width: '40px', height: '40px', borderRadius: '50%' }}
//                       />
//                     ) : (
//                       <i className="bi bi-person-circle fs-4 text-secondary"></i>
//                     )}
//                   </td>
//                   <td>{s.name || s.Name}</td>
//                   <td>{s.userName || s.Username}</td>
//                   <td>
//                     <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(s)}>
//                       <i className="bi bi-pencil"></i>
//                     </button>
//                     <button className="btn btn-sm btn-danger" onClick={() => handleDelete(s.user_id || s.User_id)}>
//                       <i className="bi bi-trash"></i>
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//     </div>
    
    
//   );
// };

// export default AddStudents;
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const AddStudents = () => {
  const [student, setStudent] = useState({
    name: '',
    username: '',
    password: '',
    profileImage: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);


  const userData = JSON.parse(localStorage.getItem('user'));
  const token = userData?.token;
  

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${global.url}/api/Reports/AllStudents`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const fullBase64 = reader.result;
      const base64Only = fullBase64.split(',')[1];
      setStudent((prev) => ({ ...prev, profileImage: base64Only }));
      setImagePreview(fullBase64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const { name, username, password, profileImage } = student;

  if (!name || !username || (!editingId && !password)) {
    alert('Please fill in all required fields.');
    return;
  }

  setIsSubmitting(true);

  const payload = editingId
    ? {
        user_id: editingId,
        name,
        username,
        password ,
        profileImage ,
      }
    : {
        
      name,
      userName: username,
      password,
      profileImage,
      };

  try {
    const url = editingId
      ? `${global.url}/api/Reports/UpdateStudent`
      : `${global.url}/api/Reports/AddStudent`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Failed to save student');

    alert(editingId ? 'Student updated!' : 'Student added!');
    setStudent({ name: '', username: '', password: '', profileImage: '' });
    setImagePreview(null);
    setEditingId(null);
    fetchStudents();
  } catch (err) {
    alert('Error: ' + err.message);
    console.error(err);
  } finally {
    setIsSubmitting(false);
  }
};


  const handleEdit = (student) => {
    setStudent({
      name: student.name || student.Name,
      username: student.userName || student.Username,
      password: '',
      profileImage: student.profileImage || ''
    });
    setImagePreview(student.profileImage ? `data:image/jpeg;base64,${student.profileImage}` : null);
    setEditingId(student.user_id || student.User_id);
  };

  const handleDelete = async (User_id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      const res = await fetch(`${global.url}/api/Reports/DeleteStudent/${User_id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Failed to delete student');

      alert('Student deleted.');
      fetchStudents();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
  <div className="container mt-4">
    {/* Conditionally show either the form or the table */}
    {showForm || editingId ? (
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title">{editingId ? 'Edit Student' : 'Add New Student'}</h5>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setStudent({ name: '', username: '', password: '', profileImage: '' });
                setImagePreview(null);
              }}
            >
              Cancel
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={student.name}
                onChange={handleChange}
                placeholder="Enter name"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={student.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />
            </div>

            {!editingId && (
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={student.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Profile Image</label>
              <input
                type="file"
                className="form-control"
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

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingId ? 'Update Student' : 'Save Student'}
            </button>
          </form>
        </div>
      </div>
    ) : (
      <>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>All Students</h5>
          <button
            className="btn btn-success"
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setStudent({ name: '', username: '', password: '', profileImage: '' });
              setImagePreview(null);
            }}
          >
            <i className="bi bi-plus-lg me-2"></i>Add Student
          </button>
        </div>

        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Id</th>
                  <th>Profile</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center">No students found.</td>
                  </tr>
                ) : (
                  students.map((s, idx) => (
                    <tr key={s.User_id || s.user_id || idx}>
                      <td>{idx + 1}</td>
                      <td>{s.user_id}</td>
                      <td>
                        {s.profileImage ? (
                          <img
                            src={`data:image/jpeg;base64,${s.profileImage}`}
                            alt="Profile"
                            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                          />
                        ) : (
                          <i className="bi bi-person-circle fs-4 text-secondary"></i>
                        )}
                      </td>
                      <td>{s.name || s.Name}</td>
                      <td>{s.userName || s.Username}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-warning me-2"
                          onClick={() => {
                            handleEdit(s);
                            setShowForm(true);
                          }}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(s.user_id || s.User_id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
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

export default AddStudents;
