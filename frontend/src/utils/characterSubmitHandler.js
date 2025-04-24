const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

const submitCharacterForm = async (payload, onSaveSuccess) => {
  try {
    console.log('📡 Submitting to:', `${API_BASE}/characters`);
    const response = await fetch(`${API_BASE}/characters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(payload),
    });

    const raw = await response.text(); // 👈 get raw text first
    console.log('🧪 Raw backend response:', raw);

    let data;
    try {
      data = JSON.parse(raw); // 👈 only parse if it's valid JSON
    } catch (err) {
      console.warn('⚠️ Could not parse JSON:', err);
      throw new Error('Non-JSON response from backend');
    }

    if (!response.ok) {
      console.error('🛑 Character creation failed:', data);
      alert(`Error: ${data.message || 'Failed to create character.'}`);
      return;
    }

    console.log('✅ Character saved:', data);
    onSaveSuccess(data);
  } catch (error) {
    console.error('🚨 Network error during character submission:', error);
    alert('Network error — please check your connection or try again.');
  }
};

export default submitCharacterForm;
