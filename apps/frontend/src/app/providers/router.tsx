import { Routes, Route } from 'react-router-dom';
import { RoomListPage } from '@pages/room-list';
import { RoomPage } from '@pages/room';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RoomListPage />} />
      <Route path="/rooms/:id" element={<RoomPage />} />
    </Routes>
  );
}
