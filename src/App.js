import React, { useState } from 'react';
import './App.css';

function App() {
  const [questionId, setQuestionId] = useState('');
  const [query, setQuery] = useState('');
  const [code, setCode] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse('');

    if (!questionId.trim() || !query.trim() || !code.trim()) {
      setError('All fields are required');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('https://pymebot-backend.onrender.com/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, query, code }),
      });

      if (!response.ok) throw new Error('API request failed');
      
      const data = await response.json();
      setResponse(data.response);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(response).catch(() => {
      setError('Failed to copy text');
    });
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="heading">PyMeBot</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Question ID:</label>
            <input
              type="text"
              value={questionId}
              onChange={(e) => setQuestionId(e.target.value)}
              required
              className="input"
            />
          </div>

          <div className="form-group">
            <label>Student Query:</label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
              className="input textarea"
            />
          </div>

          <div className="form-group">
            <label>Student Code:</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="input code-area"
            />
          </div>

          <button 
            type="submit" 
            className="button"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Run'}
          </button>

          {error && <p className="error">{error}</p>}
        </form>
      </div>

      <div className="response-container">
        <h2 className="heading">Response</h2>
        {response && (
          <button 
            onClick={copyToClipboard}
            className="copy-button"
            title="Copy to clipboard"
          >
            copy ⎘
          </button>
        )}
        <div className="response-content">
          {isLoading ? (
            <p>Loading...</p>
          ) : response ? (
            <pre className="response-text">{response}</pre>
          ) : (
            <p className="placeholder">Submit a query to see the response</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
