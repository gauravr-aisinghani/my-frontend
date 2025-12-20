import React, { useState } from "react";

export default function XmlFileUploader() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("⚠️ Please select an XML file first.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8089/api/xml-table/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.text();
        setMessage("✅ " + result);
      } else {
        const errorText = await response.text();
        setMessage("❌ Failed: " + errorText);
      }
    } catch (err) {
      setMessage("⚠️ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📁 Upload XML File to Generate Table</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="file"
          accept=".xml"
          onChange={handleFileChange}
          style={styles.fileInput}
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Processing..." : "Upload & Generate"}
        </button>
      </form>

      {message && <div style={styles.message}>{message}</div>}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "60px auto",
    padding: "30px",
    borderRadius: "12px",
    background: "#fdfdfd",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    fontFamily: "sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#2c3e50",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    alignItems: "center",
  },
  fileInput: {
    border: "1px solid #ccc",
    padding: "10px",
    borderRadius: "8px",
    width: "100%",
  },
  button: {
    background: "#2ecc71",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },
  message: {
    marginTop: "20px",
    textAlign: "center",
    color: "#2c3e50",
    whiteSpace: "pre-line",
  },
};
