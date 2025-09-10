import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [petData, setPetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [funFacts] = useState([
    "One tablespoon of peanut butter for dogs is like a human eating 2½ hamburgers! Use sparingly as treats.",
    "Dogs can burn 300-400 calories per hour during active play - similar to a human jogging!",
    "Cats sleep 12-16 hours a day to conserve energy for hunting, even indoor cats maintain this pattern.",
    "A dog's sense of smell is 10,000 to 100,000 times stronger than humans - that's why they love sniffing everything!",
    "Proper hydration is key: dogs need about 1 ounce of water per pound of body weight daily."
  ]);
  const [currentFactIndex] = useState(Math.floor(Math.random() * 5));

  useEffect(() => {
    loadPetData();
  }, []);

  const loadPetData = async () => {
    try {
      const petId = localStorage.getItem('currentPetId');
      if (!petId) {
        // No pet found, redirect to onboarding
        window.location.href = '/';
        return;
      }

      const { db } = await import('../../firebase');
      const { doc, getDoc } = await import('firebase/firestore');
      
      const docRef = doc(db, 'pets', petId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setPetData(docSnap.data());
      } else {
        // Pet not found, redirect to onboarding
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error loading pet data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogActivity = (type) => {
    alert(`Logging ${type} - Feature coming soon!`);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px'
      }}>
        Loading your pet's profile...
      </div>
    );
  }

  if (!petData) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px'
      }}>
        Pet not found. Redirecting...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
        color: 'white',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700' }}>
          🐾 PawTracker
        </h1>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Pet Card */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          borderRadius: '16px',
          padding: '20px',
          color: 'white',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '5px' }}>
            {petData.petType === 'dog' ? '🐕' : '🐱'} {petData.name}
          </div>
          <div style={{ opacity: 0.9, fontSize: '14px' }}>
            {petData.breed} • {petData.age} • {petData.weight}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '15px',
          margin: '20px 0'
        }}>
          <button
            onClick={() => handleLogActivity('food')}
            style={{
              background: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0px)'}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🍽️</div>
            <div>Log Food</div>
          </button>

          <button
            onClick={() => handleLogActivity('activity')}
            style={{
              background: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0px)'}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏃</div>
            <div>{petData.petType === 'dog' ? 'Log Walk' : 'Log Play'}</div>
          </button>

          <button
            onClick={() => handleLogActivity('water')}
            style={{
              background: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0px)'}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>💧</div>
            <div>Log Water</div>
          </button>

          <button
            onClick={() => handleLogActivity('bathroom')}
            style={{
              background: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.target.style.transform = 'translateY(0px)'}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🚽</div>
            <div>{petData.petType === 'dog' ? 'Bathroom Log' : 'Litter Box'}</div>
          </button>
        </div>

        {/* Fun Fact Card */}
        <div style={{
          background: 'linear-gradient(135deg, #FFB74D, #FF8A65)',
          borderRadius: '16px',
          padding: '20px',
          color: 'white',
          margin: '20px 0'
        }}>
          <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '10px' }}>
            💡 Did You Know?
          </div>
          <div style={{ lineHeight: 1.4 }}>
            {funFacts[currentFactIndex]}
          </div>
        </div>

        {/* Today's Summary */}
        <div style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '15px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ marginTop: 0, color: '#333' }}>Today's Summary</h3>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <span>Meals</span>
            <span style={{ fontWeight: '600', color: '#4ECDC4' }}>0/2</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <span>{petData.petType === 'dog' ? 'Exercise' : 'Playtime'}</span>
            <span style={{ fontWeight: '600', color: '#4ECDC4' }}>0 min</span>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 0'
          }}>
            <span>Water</span>
            <span style={{ fontWeight: '600', color: '#4ECDC4' }}>0 cups</span>
          </div>
        </div>

        {/* New Pet Button */}
        <button
          onClick={() => window.location.href = '/'}
          style={{
            background: 'transparent',
            color: '#666',
            border: '1px solid #ddd',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '14px',
            cursor: 'pointer',
            width: '100%',
            marginTop: '20px'
          }}
        >
          + Add Another Pet
        </button>
      </div>
    </div>
  );
};

export default Dashboard;