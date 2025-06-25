import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SummaryBox({ content }) {
  const [summary, setSummary] = useState('');

  useEffect(() => {
    if (!content) return;

  axios.post(`${process.env.REACT_APP_API_URL}/get-summary`, { content })
    .then(res => {
      if (res.data && res.data[0]?.summary_text) {
        setSummary(res.data[0].summary_text);
      }
    })
    .catch(() => {
      setSummary("Failed to summarize.");
    });

  }, [content]);

  return (
    <div className="summary-box">
      <h4>📝 Summary</h4>
      <p>{summary || "Summarizing..."}</p>
    </div>
  );
}

export default SummaryBox;
