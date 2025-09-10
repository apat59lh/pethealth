import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/onboarding/Welcome';
import PetTypeSelection from './pages/onboarding/PetTypeSelection';
import PetProfile from './pages/onboarding/PetProfile';
import Dashboard from './pages/dashboard/Dashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/pet-type" element={<PetTypeSelection />} />
          <Route path="/pet-profile" element={<PetProfile />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;