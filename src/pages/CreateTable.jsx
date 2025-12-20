import React, { useState } from "react";

const CreateTable = () => {
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState([
    { name: "", type: "String", primaryKey: false },
  ]);

  const addColumn = () => {
    setColumns([...columns, { name: "", type: "String", primaryKey: false }]);
  };

  const handleColumnChange = (index, field, value) => {
    const updatedColumns = [...columns];
    updatedColumns[index][field] = value;
    setColumns(updatedColumns);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { tableName, columns };

    try {
      const response = await fetch("http://localhost:8089/api/create-table", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Table created successfully!");
        setTableName("");
        setColumns([{ name: "", type: "String", primaryKey: false }]);
      } else {
        alert("Failed to create table");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Create a Table</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>Table Name:</label>
        <input
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          required
          style={styles.input}
        />

        <h3 style={styles.subHeading}>Columns</h3>
        {columns.map((col, index) => (
          <div key={index} style={styles.columnRow}>
            <input
              type="text"
              placeholder="Column Name"
              value={col.name}
              onChange={(e) =>
                handleColumnChange(index, "name", e.target.value)
              }
              required
              style={styles.input}
            />
            <select
              value={col.type}
              onChange={(e) => handleColumnChange(index, "type", e.target.value)}
              required
              style={styles.select}
            >
              <option value="String">String</option>
              <option value="Long">Long</option>
              <option value="Integer">Integer</option>
              <option value="Boolean">Boolean</option>
            </select>
            <label style={styles.checkboxLabel}>
              Primary Key
              <input
                type="checkbox"
                checked={col.primaryKey}
                onChange={(e) =>
                  handleColumnChange(index, "primaryKey", e.target.checked)
                }
              />
            </label>
          </div>
        ))}

        <button type="button" onClick={addColumn} style={styles.addBtn}>
          ➕ Add Column
        </button>

        <button type="submit" style={styles.submitBtn}>
          ✅ Create Table
        </button>
      </form>
    </div>
  );
};

// Simple inline styling
const styles = {
  container: { maxWidth: "600px", margin: "30px auto", fontFamily: "sans-serif" },
  heading: { textAlign: "center", color: "#333" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  label: { fontWeight: "bold" },
  subHeading: { marginTop: "10px", fontWeight: "600" },
  input: { padding: "8px", borderRadius: "5px", border: "1px solid #ccc", width: "100%" },
  select: { padding: "8px", borderRadius: "5px", border: "1px solid #ccc" },
  checkboxLabel: { marginLeft: "10px" },
  columnRow: { display: "flex", gap: "10px", alignItems: "center" },
  addBtn: { background: "#007bff", color: "white", padding: "8px", border: "none", borderRadius: "6px", cursor: "pointer" },
  submitBtn: { background: "#28a745", color: "white", padding: "10px", border: "none", borderRadius: "6px", cursor: "pointer" },
};

export default CreateTable;
