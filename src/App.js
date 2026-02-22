import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'https://stock-sentiment-backend-kushalrshahh-k7h795.vercel.app';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/top10`);
        setData(res.data.top10 || []);
      } catch {
        setData([{ ticker: 'Error', score: 0, signal: 'HOLD' }]);
      }
      setLoading(false);
    };
    fetchData();
    const interval = setInterval(fetchData, 300000);  // 5 min
    return () => clearInterval(interval);
  }, []);

  const buys = data.filter(d => d.signal === 'BUY');
  const sells = data.filter(d => d.signal === 'SELL');

  if (loading) return <div style={styles.loading}>Loading daily top 10...</div>;

  return (
    <div style={styles.app}>
      <h1 style={styles.title}>🏆 Daily Stock Advice</h1>
      <p style={styles.subtitle}>Top 10 sentiment ranked | Refresh taps</p>

      {buys.length > 0 && (
        <div>
          <h2 style={styles.buyTitle}>🔥 Best Buys</h2>
          {buys.map(d => (
            <div key={d.ticker} style={styles.buyCard}>
              <strong>{d.ticker}</strong> BUY {d.score > 0.3 ? '🚀' : ''}
              <br/>Posts: {d.posts}
            </div>
          ))}
        </div>
      )}

      <h2 style={styles.chartTitle}>📈 Top 10 Sentiment</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3" />
          <XAxis dataKey="ticker" angle={-45} height={60} />
          <YAxis domain={[-1, 1]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="score" stroke="#00bfbf" name="Score" />
        </LineChart>
      </ResponsiveContainer>

      <h2 style={styles.sellTitle}>📉 Quick Sells</h2>
      {sells.slice(0,3).map(d => (
        <div key={d.ticker} style={styles.sellCard}>
          <strong>{d.ticker}</strong> SELL {d.score < -0.3 ? '⚠️' : ''}
        </div>
      ))}

      <div style={styles.footer}>
        Posts low weekend—BUYS Mon-Fri 🚀 | Add to Home Screen
      </div>
    </div>
  );
}

const styles = {
  app: { padding: '20px', maxWidth: '400px', margin: '0 auto', fontFamily: '-apple-system, BlinkMacSystemFont' },
  title: { textAlign: 'center', color: '#00bfbf' },
  subtitle: { textAlign: 'center', color: '#666', fontSize: '14px' },
  buyTitle: { color: '#28a745', marginTop: '20px' },
  buyCard: { background: '#d4edda', border: '1px solid #28a745', padding: '12px', borderRadius: '8px', margin: '5px 0' },
  chartTitle: { textAlign: 'center', marginTop: '20px' },
  sellTitle: { color: '#dc3545' },
  sellCard: { background: '#f8d7da', border: '1px solid #dc3545', padding: '12px', borderRadius: '8px', margin: '5px 0' },
  footer: { textAlign: 'center', fontSize: '12px', color: '#999', marginTop: '20px' },
  loading: { padding: '40px', textAlign: 'center', fontSize: '18px' }
};

export default App;
