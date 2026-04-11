import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './Layout';

export default function RewardsPage() {
  const [rewards, setRewards] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:8000/api/my-rewards', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRewards(response.data);
      const points = response.data.reduce((sum: number, reward: any) => sum + Number(reward.points_earned), 0);
      setTotalPoints(points);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout active="Rewards">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <div>Loading rewards...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout active="Rewards">
      <style>{`
        .rewards-earn-grid { display: flex; gap: 16px; }
        @media (max-width: 600px) { .rewards-earn-grid { flex-direction: column; } }
      `}</style>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontWeight: 700, fontSize: '1.5rem', color: '#1a3a50', margin: '0 0 4px' }}>
          Rewards And Points
        </h1>
        <p style={{ color: '#7a9db5', fontSize: '0.83rem', margin: 0 }}>
          Track your contributions and earn rewards for helping the community
        </p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <div style={{
          flex: 1,
          background: '#fff',
          borderRadius: '12px',
          padding: '22px 24px',
          border: '1px solid #dce8f0',
        }}>
          <div style={{ fontSize: '0.78rem', color: '#7a9db5', fontWeight: 600, marginBottom: '10px' }}>
            Total Points Earned
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1a3a50', lineHeight: 1, marginBottom: '8px' }}>
            {totalPoints}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#7a9db5' }}>
            {rewards.length} reward{rewards.length !== 1 ? 's' : ''} earned
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a3a50', margin: '0 0 16px' }}>
          Recent Rewards
        </h2>

        {rewards.length === 0 ? (
          <div style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '40px',
            textAlign: 'center',
            border: '1px solid #dce8f0',
          }}>
            <p style={{ color: '#7a9db5', margin: 0 }}>No rewards yet. Upload resources to earn points!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {rewards.map((reward: any) => (
              <div key={reward.id} style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '16px 20px',
                border: '1px solid #dce8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: '#1a3a50', marginBottom: '4px' }}>
                    {reward.reward_name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#7a9db5', wordBreak: 'break-word' }}>
                    {reward.reward_description}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#b0c4d4', marginTop: '6px' }}>
                    {new Date(reward.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div style={{
                  fontWeight: 800, fontSize: '1.1rem', color: '#2e7da8',
                  background: '#edf5fa', borderRadius: '8px', padding: '6px 16px', flexShrink: 0,
                }}>+{reward.points_earned}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a3a50', margin: '0 0 16px' }}>
          How to Earn Points
        </h2>

        <div className="rewards-earn-grid">
          <div style={{
            flex: 1,
            background: '#fff',
            borderRadius: '12px',
            padding: '20px 22px',
            border: '1px solid #dce8f0',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#4a6a80' }}>Upload a Resource</div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a6a80" strokeWidth="1.8">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.83rem', color: '#7a9db5' }}>Earn 10 points</div>
              <div style={{
                fontWeight: 800, fontSize: '1rem', color: '#2e7da8',
                background: '#edf5fa', borderRadius: '8px', padding: '4px 14px',
              }}>+10</div>
            </div>
          </div>

          <div style={{
            flex: 1,
            background: '#fff',
            borderRadius: '12px',
            padding: '20px 22px',
            border: '1px solid #dce8f0',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
              <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#4a6a80' }}>Resource gets Downloaded</div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a6a80" strokeWidth="1.8">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.83rem', color: '#7a9db5' }}>Earns 5 points</div>
              <div style={{
                fontWeight: 800, fontSize: '1rem', color: '#2e7da8',
                background: '#edf5fa', borderRadius: '8px', padding: '4px 14px',
              }}>+5</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}