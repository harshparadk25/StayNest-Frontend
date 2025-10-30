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
import { useLocation } from "react-router-dom";


const UserProfileBooking = () => {
  const user = useContext(AuthContext);
  

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

  // Fetch guests
  const fetchGuestInfo = async () => {
    try {
      const res = await axios.get("/users/guests");
      setGuestInfo(res.data.data || []);
      console.log("Fetched guests:", res.data.data);
    } catch (error) {
      toast.error("Failed to fetch guest information");
      console.error(error);
    }
  };

  // Open guest dialog for edit/add
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

  // Add or edit guest
  const handleGuestSubmit = async (e) => {
    e.preventDefault();
    const guestPayload = {
      name: guestName,
      dateOfBirth: guestDOB,
      gender: guestGender.toUpperCase(),
    };

    try {
      if (editingGuest) {
        // Edit guest
        await axios.put(`/users/guests/${editingGuest.id}`, guestPayload);
        toast.success("Guest updated successfully");
      } else {
        // Add guest
        await axios.post("/users/guests", guestPayload);
        toast.success("Guest added successfully");
      }
      setGuestDialogOpen(false);
      setEditingGuest(null);
      setGuestName("");
      setGuestDOB("");
      setGuestGender("");
      fetchGuestInfo();
    } catch (error) {
      toast.error("Failed to save guest");
      console.error(error);
    }
  };

  // Remove guest
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

  // Update profile
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
      console.log("User bookings:", res.data.data);
      toast.success("Bookings fetched successfully");
    } catch (error) {
      toast.error("Failed to fetch bookings");
      console.error(error);
    }
  }

  const cancelBooking = async (bookingId) => {
  try {
    await axios.post(`/bookings/${bookingId}/cancel`, {});
    toast.success("Booking cancelled successfully");
    fetchBookings();
  } catch (error) {
    console.error("Cancel Booking Error:", error.response?.data || error);
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-2xl border"
    >
      {/* User Profile */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        User Profile
      </h2>

      <div className="space-y-3 text-gray-700">
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Date of Birth:</strong> {dateOfBirth || "Not set"}</p>
        <p><strong>Gender:</strong> {gender || "Not specified"}</p>
        <p><strong>Email:</strong> {email}</p>
      </div>

      <div className="flex justify-center mt-5">
        <Dialog open={openProfileDialog} onOpenChange={setOpenProfileDialog}>
          <DialogTrigger asChild>
            <Button>Update Profile</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Your Profile</DialogTitle>
            </DialogHeader>
            <form onSubmit={updateUserProfile} className="space-y-4 mt-3">
              <div>
                <Label>Name</Label>
                <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label>Date of Birth</Label>
                <Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
              </div>
              <div>
                <Label>Gender</Label>
                <select
                  className="w-full border rounded-md px-3 py-2 mt-1"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenProfileDialog(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Guest Section */}
      <div className="mt-10">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Guest Information</h3>
          <Button onClick={() => openGuestDialog()}>Add Guest</Button>
        </div>

        {/* Guest List */}
        <div className="mt-5 space-y-3">
          {guestInfo.length > 0 ? (
            guestInfo.map((guest) => (
              <div key={guest.id} className="border p-3 rounded-lg shadow-sm bg-gray-50 flex justify-between items-center">
                <div>
                  <p><strong>Name:</strong> {guest.name}</p>
                  <p><strong>Date of Birth:</strong> {guest.dateOfBirth}</p>
                  <p><strong>Gender:</strong> {guest.gender}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => openGuestDialog(guest)}>Edit</Button>
                  <Button onClick={() => removeGuest(guest.id)}>Remove</Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No guests added yet.</p>
          )}
        </div>
      </div>

      {/* Guest Add/Edit Dialog */}
      <Dialog open={guestDialogOpen} onOpenChange={setGuestDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingGuest ? "Edit Guest" : "Add Guest"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleGuestSubmit} className="space-y-4 mt-3">
            <div>
              <Label>Name</Label>
              <Input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Date of Birth</Label>
              <Input
                type="date"
                value={guestDOB}
                onChange={(e) => setGuestDOB(e.target.value)}
                required
              />
            </div>
            <div>
              <Label>Gender</Label>
              <select
                className="w-full border rounded-md px-3 py-2 mt-1"
                value={guestGender}
                onChange={(e) => setGuestGender(e.target.value)}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setGuestDialogOpen(false)}>Cancel</Button>
              <Button type="submit">{editingGuest ? "Save Changes" : "Add Guest"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Booking Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-10 p-4 bg-gray-50 rounded-xl border text-center"
      >
        <h3 className="text-lg font-medium text-gray-800 mb-2">User Bookings</h3>
        <p className="text-gray-600">Your booking history will appear here.</p>
        <div className="mt-5 space-y-3">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="border p-3 rounded-lg shadow-sm bg-gray-50">

                <p><strong>Check-in:</strong> {booking.checkInDate}</p>
                <p><strong>Check-out:</strong> {booking.checkOutDate}</p>
                <p><strong>Rooms:</strong> {booking.roomsCount}</p>
                <p><strong>Total Amount:</strong> ₹{booking.amount}</p>
                <p><strong>Status:</strong> {booking.bookingStatus}</p>
                <p><strong>Guests:</strong> {booking.guests.length}</p>
                <Button onClick={() => cancelBooking(booking.id)}>Cancel Booking</Button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No bookings found.</p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UserProfileBooking;
