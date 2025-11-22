import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ArenaPage from './pages/ArenaPage';
import AdminPage from './pages/AdminPage';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArenaPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
