import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f4f4f4;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

const FileInput = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
`;

const UploadButton = styled.button`
  background-color: ${(props) => (props.disabled ? "#a0a0a0" : "#007bff")};
  color: white;
  padding: 10px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 5px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.3s ease;
  margin-top: 10px;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#a0a0a0" : "#0056b3")};
  }
`;

const SummaryBox = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  max-width: 600px;
  text-align: left;
`;

const SummaryTitle = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  color: #222;
`;

const SummaryText = styled.p`
  margin-top: 10px;
  color: #555;
`;

const App = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:5000/summarize", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSummary(response.data.summary);
    } catch (error) {
      alert("Error summarizing PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>AI-Powered PDF Summarizer</Title>
      <FileInput type="file" accept="application/pdf" onChange={handleFileChange} />
      <UploadButton onClick={handleUpload} disabled={loading}>
        {loading ? "Summarizing..." : "Upload & Summarize"}
      </UploadButton>
      {summary && (
        <SummaryBox>
          <SummaryTitle>Summary:</SummaryTitle>
          <SummaryText>{summary}</SummaryText>
        </SummaryBox>
      )}
    </Container>
  );
};

export default App;
