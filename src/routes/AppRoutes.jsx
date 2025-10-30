import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/auth/login';
import SignUp from '../pages/auth/SignUp';
import ProtectedRoute from '../config/protect';
import Home from '../pages/User/Home';
import Dashboard from '../pages/Admin/Dashboard';
import HotelDetail from '../pages/Admin/hotelDetail';
import RoomDetail from '../pages/Admin/RoomDetail';
import UserProfileBooking from '../pages/User/UserProfileBooking';
import HotelInfo from '../pages/User/HotelInfo';
import HotelList from '../pages/User/HotelList';
import BookingDetails from '../pages/User/BookingDetails';
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/user-profile' element={<ProtectedRoute><UserProfileBooking /></ProtectedRoute>} />
        <Route path='/booking-details' element={<ProtectedRoute><BookingDetails /></ProtectedRoute>} />
        <Route path='/search-results' element={<ProtectedRoute><HotelList /></ProtectedRoute>} />
        <Route path='/hotels/:hotelId/info' element={<ProtectedRoute><HotelInfo /></ProtectedRoute>} />
        <Route path='/manager-dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/manager-dashboard/hotels/:hotelId' element={<ProtectedRoute><HotelDetail /></ProtectedRoute>} />
        <Route path='/manager-dashboard/hotels/:hotelId/rooms/:roomId' element={<ProtectedRoute><RoomDetail /></ProtectedRoute>} />
        <Route path='*' element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes;
