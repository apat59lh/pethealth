import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Placeholder components (we'll build these in Conversation 2)
function Welcome() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center'
    }}>
      <h1>🐾 Welcome to PawTracker!</h1>
    </div>
  );
}

function PetTypeSelection() {
  return <div style={{padding: '20px'}}>Pet Type Selection Coming Soon...</div>;
}

function Dashboard() {
  return <div style={{padding: '20px'}}>Dashboard Coming Soon...</div>;
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/pet-type" element={<PetTypeSelection />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;