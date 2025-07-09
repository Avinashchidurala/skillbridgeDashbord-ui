import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [tables, setTables] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/tables');
      setTables(res.data);
    } catch (err) {
      console.error('Error fetching tables', err);
    }
  };

  const fetchTableData = async (tableName) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/table/${tableName}`);
      setTableData(res.data);
      setSelectedTable(tableName);
    } catch (err) {
      console.error('Error fetching table data', err);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file.");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post('http://localhost:8080/api/upload', formData);
      setMessage(res.data);
      fetchTables();
    } catch (err) {
      console.error("Upload error", err);
      setMessage("Upload failed.");
    }
  };

  return (
    <div
      className="container-fluid py-5"
      style={{
        background: 'radial-gradient(circle, rgba(238, 174, 202, 1) 0%, rgba(148, 187, 233, 1) 100%)',
        minHeight: '100vh',
      }}
    >
      <div className="container">
        <h2 className="text-center mb-4">📊 SkillBridge Data Dashboard</h2>

        <div className="card p-4 shadow-sm mb-4">
          <div className="mb-3">
            <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} />
          </div>
          <button className="btn btn-success w-100" onClick={handleUpload}>
            Upload File
          </button>
          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>

        <h4>Available Tables:</h4>
        <ul className="list-group mb-4">
          {tables.map((table, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
              onClick={() => fetchTableData(table)}
              style={{ cursor: 'pointer' }}
            >
              {table}
              <span className="badge bg-primary text-light">View</span>
            </li>
          ))}
        </ul>

        {tableData.length > 0 && (
          <>
            <h5 className="mb-3">Table: <strong>{selectedTable}</strong></h5>
            <div className="table-responsive">
              <table className="table table-striped table-bordered">
                <thead className="table-light">
                  <tr>
                    {Object.keys(tableData[0]).map((col, idx) => (
                      <th key={idx}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((row, i) => (
                    <tr key={i}>
                      {Object.values(row).map((val, j) => (
                        <td key={j}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
