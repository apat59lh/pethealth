import React, { useState } from 'react';

const PetTypeSelection = () => {
  const [selectedType, setSelectedType] = useState('dog');

  const handleContinue = () => {
    // Store the pet type in localStorage for now
    localStorage.setItem('selectedPetType', selectedType);
    window.location.href = '/pet-profile';
  };

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
          Choose Your Pet 🐾
        </h1>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Progress Bar */}
        <div style={{
          background: '#e9ecef',
          height: '6px',
          borderRadius: '3px',
          overflow: 'hidden',
          marginBottom: '30px'
        }}>
          <div style={{
            background: 'linear-gradient(90deg, #4ECDC4, #44A08D)',
            height: '100%',
            width: '25%',
            transition: 'width 0.3s ease'
          }}></div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <h2 style={{ color: '#333', marginBottom: '10px', fontSize: '24px' }}>
            What type of pet do you have?
          </h2>
          <p style={{ color: '#666', margin: 0 }}>
            We'll customize everything just for them
          </p>
        </div>

        {/* Pet Type Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '40px 0' }}>
          
          {/* Dog Option */}
          <div 
            onClick={() => setSelectedType('dog')}
            style={{
              padding: '30px',
              background: selectedType === 'dog' ? '#f0fdfc' : '#f8f9fa',
              border: selectedType === 'dog' ? '2px solid #4ECDC4' : '2px solid #e9ecef',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ fontSize: '60px' }}>🐕</div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '5px' }}>
                  Dog
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Track walks, meals, and more
                </div>
              </div>
            </div>
            <div style={{
              width: '24px',
              height: '24px',
              background: selectedType === 'dog' ? '#4ECDC4' : 'transparent',
              border: selectedType === 'dog' ? 'none' : '2px solid #ddd',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {selectedType === 'dog' ? '✓' : ''}
            </div>
          </div>

          {/* Cat Option */}
          <div 
            onClick={() => setSelectedType('cat')}
            style={{
              padding: '30px',
              background: selectedType === 'cat' ? '#f0fdfc' : '#f8f9fa',
              border: selectedType === 'cat' ? '2px solid #4ECDC4' : '2px solid #e9ecef',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ fontSize: '60px' }}>🐱</div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: '700', marginBottom: '5px' }}>
                  Cat
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Monitor litter box, play, and health
                </div>
              </div>
            </div>
            <div style={{
              width: '24px',
              height: '24px',
              background: selectedType === 'cat' ? '#4ECDC4' : 'transparent',
              border: selectedType === 'cat' ? 'none' : '2px solid #ddd',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {selectedType === 'cat' ? '✓' : ''}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <button 
          onClick={handleContinue}
          style={{
            background: 'linear-gradient(135deg, #4ECDC4, #44A08D)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '15px 30px',
            fontSize: '16px',
            fontWeight: '600',
            width: '100%',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Continue with {selectedType === 'dog' ? 'Dog' : 'Cat'} →
        </button>
      </div>
    </div>
  );
};

export default PetTypeSelection;