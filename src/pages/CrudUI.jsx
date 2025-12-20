import { useState } from "react";

const apiBase = "http://localhost:8089/api/crud";

export default function CrudUI() {
  const [table, setTable] = useState("");
  const [idColumn, setIdColumn] = useState("");
  const [idValue, setIdValue] = useState("");
  const [jsonData, setJsonData] = useState(`{
  "id": 1,
  "name": "Alice",
  "age": 30
}`);
  const [result, setResult] = useState("");

  const handleFetch = async (url, options = {}) => {
    try {
      const res = await fetch(url, options);
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        setResult(JSON.stringify(json, null, 2));
      } catch {
        setResult(text);
      }
    } catch (err) {
      setResult("Error: " + err.message);
    }
  };

  const insertRow = () => {
    const data = JSON.parse(jsonData);
    handleFetch(`${apiBase}/${table}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const getAll = () => handleFetch(`${apiBase}/${table}`);

  const getById = () =>
    handleFetch(`${apiBase}/${table}/${idColumn}/${idValue}`);

  const updateRow = () => {
    const data = JSON.parse(jsonData);
    handleFetch(`${apiBase}/${table}/${idColumn}/${idValue}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const deleteRow = () =>
    handleFetch(`${apiBase}/${table}/${idColumn}/${idValue}`, {
      method: "DELETE",
    });

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Generic CRUD Operations UI</h2>

      <label>
        Table Name:
        <input
          type="text"
          value={table}
          onChange={(e) => setTable(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </label>
      <br />
      <br />

      <label>
        ID Column:
        <input
          type="text"
          value={idColumn}
          onChange={(e) => setIdColumn(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </label>
      <br />
      <br />

      <label>
        ID Value:
        <input
          type="text"
          value={idValue}
          onChange={(e) => setIdValue(e.target.value)}
          style={{ marginLeft: "10px" }}
        />
      </label>
      <br />
      <br />

      <label>JSON Data:</label>
      <br />
      <textarea
        rows="6"
        cols="50"
        value={jsonData}
        onChange={(e) => setJsonData(e.target.value)}
        style={{ marginTop: "5px" }}
      />
      <br />
      <br />

      <button onClick={insertRow}>Create (Insert)</button>
      <button onClick={getAll} style={{ marginLeft: "10px" }}>
        Read All
      </button>
      <button onClick={getById} style={{ marginLeft: "10px" }}>
        Read by ID
      </button>
      <button onClick={updateRow} style={{ marginLeft: "10px" }}>
        Update
      </button>
      <button onClick={deleteRow} style={{ marginLeft: "10px" }}>
        Delete
      </button>

      <h3 style={{ marginTop: "20px" }}>Result:</h3>
      <pre
        style={{
          backgroundColor: "#f0f0f0",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        {result}
      </pre>
    </div>
  );
}
