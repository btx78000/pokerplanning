import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Room from './components/Room';
import { useSocket } from './hooks/useSocket';

function App() {
  const { socket, connected } = useSocket();

  return (
    <Router>
      <div className="min-h-screen p-4">
        <Routes>
          <Route path="/" element={<Home socket={socket} connected={connected} />} />
          <Route path="/room/:roomId" element={<Room socket={socket} connected={connected} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
