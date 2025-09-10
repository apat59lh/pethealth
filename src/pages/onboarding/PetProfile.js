import React, { useState, useEffect } from 'react';

const PetProfile = () => {
  const [petType, setPetType] = useState('dog');
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    weight: '',
    foodBrand: '',
    // Dog-specific
    walksPerDay: '2',
    exerciseLevel: 'moderate',
    // Cat-specific
    foodType: 'wet',
    litterBoxes: '1',
    indoorOutdoor: 'indoor'
  });

  useEffect(() => {
    // Get pet type from previous screen
    const savedPetType = localStorage.getItem('selectedPetType') || 'dog';
    setPetType(savedPetType);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = async () => {
    // Save pet profile to Firebase
    try {
      const { db } = await import('../../firebase');
      const { collection, addDoc } = await import('firebase/firestore');
      
      const petProfile = {
        ...formData,
        petType,
        createdAt: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'pets'), petProfile);
      localStorage.setItem('currentPetId', docRef.id);
      
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Error saving pet profile:', error);
      alert('Error saving profile. Please try again.');
    }
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
          Tell us about your {petType}! {petType === 'dog' ? '🐕' : '🐱'}
        </h1>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Progress Bar */}
        <div style={{
          background: '#e9ecef',
          height: '6px',
          borderRadius: '3px',
          overflow: 'hidden',
          marginBottom: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(90deg, #4ECDC4, #44A08D)',
            height: '100%',
            width: '75%',
            transition: 'width 0.3s ease'
          }}></div>
        </div>

        {/* Basic Info */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
            What's your {petType}'s name?
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder={`Enter ${petType}'s name`}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
            Breed
          </label>
          <input
            type="text"
            value={formData.breed}
            onChange={(e) => handleInputChange('breed', e.target.value)}
            placeholder={petType === 'dog' ? 'e.g., Golden Retriever, Mixed breed' : 'e.g., Maine Coon, Domestic Shorthair'}
            style={{
              width: '100%',
              padding: '12px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Age and Weight */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
              Age
            </label>
            <input
              type="text"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              placeholder="3 years"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
              Weight
            </label>
            <input
              type="text"
              value={formData.weight}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              placeholder={petType === 'dog' ? '65 lbs' : '9 lbs'}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Dog-Specific Questions */}
        {petType === 'dog' && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                Current Food Brand
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  value={formData.foodBrand}
                  onChange={(e) => handleInputChange('foodBrand', e.target.value)}
                  placeholder="Scan or type food brand"
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '16px',
                    boxSizing: 'border-box'
                  }}
                />
                <button style={{
                  background: '#4ECDC4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '20px'
                }}>📱</button>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                How many walks per day?
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['1', '2', '3+'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleInputChange('walksPerDay', option)}
                    style={{
                      flex: 1,
                      background: formData.walksPerDay === option ? '#4ECDC4' : '#fff',
                      color: formData.walksPerDay === option ? 'white' : '#333',
                      border: '2px solid #e9ecef',
                      borderRadius: '12px',
                      padding: '15px',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                Exercise Level
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { value: 'moderate', label: '🚶 Moderate - Daily walks, some fetch' },
                  { value: 'high', label: '🏃 High - Long runs, dog park visits' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleInputChange('exerciseLevel', option.value)}
                    style={{
                      background: formData.exerciseLevel === option.value ? '#4ECDC4' : '#fff',
                      color: formData.exerciseLevel === option.value ? 'white' : '#333',
                      border: '2px solid #e9ecef',
                      borderRadius: '12px',
                      padding: '15px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Cat-Specific Questions */}
        {petType === 'cat' && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                Current Food Type
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { value: 'wet', label: '🥫 Wet Food Only' },
                  { value: 'dry', label: '🌾 Dry Food Only' },
                  { value: 'mixed', label: '🍽️ Mixed (Wet + Dry)' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleInputChange('foodType', option.value)}
                    style={{
                      background: formData.foodType === option.value ? '#4ECDC4' : '#fff',
                      color: formData.foodType === option.value ? 'white' : '#333',
                      border: '2px solid #e9ecef',
                      borderRadius: '12px',
                      padding: '15px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                Litter Box Setup
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['1', '2', '3+'].map(option => (
                  <button
                    key={option}
                    onClick={() => handleInputChange('litterBoxes', option)}
                    style={{
                      flex: 1,
                      background: formData.litterBoxes === option ? '#4ECDC4' : '#fff',
                      color: formData.litterBoxes === option ? 'white' : '#333',
                      border: '2px solid #e9ecef',
                      borderRadius: '12px',
                      padding: '15px',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    {option} Box{option === '1' ? '' : 'es'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333' }}>
                Indoor/Outdoor?
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[
                  { value: 'indoor', label: '🏠 Indoor Only' },
                  { value: 'both', label: '🌳 Indoor/Outdoor' }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleInputChange('indoorOutdoor', option.value)}
                    style={{
                      flex: 1,
                      background: formData.indoorOutdoor === option.value ? '#4ECDC4' : '#fff',
                      color: formData.indoorOutdoor === option.value ? 'white' : '#333',
                      border: '2px solid #e9ecef',
                      borderRadius: '12px',
                      padding: '15px',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Continue Button */}
        <button 
          onClick={handleContinue}
          disabled={!formData.name || !formData.breed}
          style={{
            background: (!formData.name || !formData.breed) ? '#ccc' : 'linear-gradient(135deg, #4ECDC4, #44A08D)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '15px 30px',
            fontSize: '16px',
            fontWeight: '600',
            width: '100%',
            cursor: (!formData.name || !formData.breed) ? 'not-allowed' : 'pointer',
            marginTop: '20px'
          }}
        >
          Create Profile & Get Started! 🎉
        </button>
      </div>
    </div>
  );
};

export default PetProfile;