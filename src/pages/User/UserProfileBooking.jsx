import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { toast } from "sonner";
import axios from "../../config/axios.js";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const UserProfileBooking = () => {
  const user = useContext(AuthContext);
  const navigate = useNavigate();

  // User Profile States
  const [name, setName] = useState(user?.name || "");
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [email, setEmail] = useState(user?.email || "");
  const [openProfileDialog, setOpenProfileDialog] = useState(false);

  // Guest States
  const [guestInfo, setGuestInfo] = useState([]);
  const [guestDialogOpen, setGuestDialogOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestDOB, setGuestDOB] = useState("");
  const [guestGender, setGuestGender] = useState("");
  const [editingGuest, setEditingGuest] = useState(null);
  const [bookings, setBookings] = useState([]);

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const res = await axios.get("/users/profile");
      const userProfile = res.data.data;
      setName(userProfile.name);
      setDateOfBirth(userProfile.dateOfBirth);
      setGender(userProfile.gender);
      setEmail(userProfile.email);
    } catch (error) {
      toast.error("Failed to fetch user profile");
      console.error(error);
    }
  };

  const fetchGuestInfo = async () => {
    try {
      const res = await axios.get("/users/guests");
      setGuestInfo(res.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch guest information");
      console.error(error);
    }
  };

  const openGuestDialog = (guest = null) => {
    if (guest) {
      setEditingGuest(guest);
      setGuestName(guest.name);
      setGuestDOB(guest.dateOfBirth);
      setGuestGender(guest.gender.toLowerCase());
    } else {
      setEditingGuest(null);
      setGuestName("");
      setGuestDOB("");
      setGuestGender("");
    }
    setGuestDialogOpen(true);
  };

  const handleGuestSubmit = async (e) => {
    e.preventDefault();
    const guestPayload = {
      name: guestName,
      dateOfBirth: guestDOB,
      gender: guestGender.toUpperCase(),
    };
    try {
      if (editingGuest) {
        await axios.put(`/users/guests/${editingGuest.id}`, guestPayload);
        toast.success("Guest updated successfully");
      } else {
        await axios.post("/users/guests", guestPayload);
        toast.success("Guest added successfully");
      }
      setGuestDialogOpen(false);
      setEditingGuest(null);
      fetchGuestInfo();
    } catch (error) {
      toast.error("Failed to save guest");
      console.error(error);
    }
  };

  const removeGuest = async (guestId) => {
    try {
      await axios.delete(`/users/guests/${guestId}`);
      toast.success("Guest removed successfully");
      fetchGuestInfo();
    } catch (error) {
      toast.error("Failed to remove guest");
      console.error(error);
    }
  };

  const updateUserProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        name,
        dateOfBirth,
        gender: gender?.toUpperCase(),
      };
      await axios.patch("/users/profile", updatedUser);
      toast.success("Profile updated successfully");
      setOpenProfileDialog(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error.response?.data || error.message);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/users/myBookings");
      setBookings(res.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch bookings");
      console.error(error);
    }
  };

  const cancelBooking = async (bookingId) => {
    try {
      await axios.post(`/bookings/${bookingId}/cancel`, {});
      toast.success("Booking cancelled successfully");
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchGuestInfo();
    fetchBookings();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-[#8c92a0] via-[#e8eaec] to-[#0f172a] py-10 px-5 text-gray-100"
    >
      <div className="max-w-4xl mx-auto backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 space-y-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-3"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-400 text-transparent bg-clip-text">
            Your Stay Profile
          </h1>
          <p className="text-gray-800">Manage your profile, guests, and bookings seamlessly</p>
          <Button
            onClick={() => navigate("/home")}
            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-blue-500 hover:to-teal-500 mt-2"
          >
            Go to Home
          </Button>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="bg-white/10 rounded-2xl p-6 shadow-md border border-white/20"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Profile Details</h2>
          <div className="grid grid-cols-2 gap-4 text-gray-600">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>DOB:</strong> {dateOfBirth || "Not set"}</p>
            <p><strong>Gender:</strong> {gender || "Not specified"}</p>
            <p><strong>Email:</strong> {email}</p>
          </div>
          <Button
            onClick={() => setOpenProfileDialog(true)}
            className="mt-4 bg-gradient-to-r from-teal-800 to-blue-500 hover:opacity-90"
          >
            Update Profile
          </Button>
        </motion.div>

        {/* Guest Section */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white/10 rounded-2xl p-6 shadow-md border border-white/20"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-blue-900">Guest Information</h3>
            <Button
              onClick={() => openGuestDialog()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
            >
              + Add Guest
            </Button>
          </div>
          <div className="space-y-3">
            {guestInfo.length > 0 ? (
              guestInfo.map((guest) => (
                <motion.div
                  key={guest.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/10 p-4 rounded-lg border text-black border-white/20 flex justify-between items-center"
                >
                  <div>
                    <p><strong>Name:</strong> {guest.name}</p>
                    <p><strong>DOB:</strong> {guest.dateOfBirth}</p>
                    <p><strong>Gender:</strong> {guest.gender}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openGuestDialog(guest)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => removeGuest(guest.id)}
                      className="bg-rose-500 hover:bg-rose-600"
                    >
                      Remove
                    </Button>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-600 text-center">No guests added yet.</p>
            )}
          </div>
        </motion.div>

        {/* Booking Section */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white/10 rounded-2xl p-6 shadow-md border border-white/20"
        >
          <h3 className="text-xl font-semibold text-purple-700 mb-4">My Bookings</h3>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <motion.div
                key={booking.id}
                whileHover={{ scale: 1.01 }}
                className="border  border-white/20 bg-white/5 p-4 rounded-lg mb-3"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-gray-700">
                  <p><strong>Check-in:</strong> {booking.checkInDate}</p>
                  <p><strong>Check-out:</strong> {booking.checkOutDate}</p>
                  <p><strong>Rooms:</strong> {booking.roomsCount}</p>
                  <p><strong>Amount:</strong> ₹{booking.amount}</p>
                  <p><strong>Status:</strong> {booking.bookingStatus}</p>
                  <p><strong>Guests:</strong> {booking.guests.length}</p>
                </div>
                <Button
                  onClick={() => cancelBooking(booking.id)}
                  className="mt-3 bg-gradient-to-r from-rose-500 to-red-500 hover:opacity-90"
                >
                  Cancel Booking
                </Button>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No bookings found.</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserProfileBooking;
