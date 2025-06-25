import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SummaryBox({ content }) {
  const [summary, setSummary] = useState('');

  useEffect(() => {
    if (!content) return;

    axios.post(
    'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
    { inputs: content },
    {
        headers: {
        Authorization: `Bearer ${process.env.REACT_APP_HF_TOKEN}`
        }
    }
    ).then(res => {
      if (res.data && res.data[0] && res.data[0].summary_text) {
        setSummary(res.data[0].summary_text);
      }
    }).catch(err => {
      console.error("Summary Error:", err);
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
