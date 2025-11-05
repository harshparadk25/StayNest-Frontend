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
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [email, setEmail] = useState(user?.email || "");
  const [openProfileDialog, setOpenProfileDialog] = useState(false);

  const [guestInfo, setGuestInfo] = useState([]);
  const [guestDialogOpen, setGuestDialogOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestDOB, setGuestDOB] = useState("");
  const [guestGender, setGuestGender] = useState("");
  const [editingGuest, setEditingGuest] = useState(null);
  const [bookings, setBookings] = useState([]);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get("/users/profile");
      const data = res.data.data;
      setName(data.name);
      setDateOfBirth(data.dateOfBirth);
      setGender(data.gender);
      setEmail(data.email);
    } catch {
      toast.error("Failed to fetch profile");
    }
  };

  const fetchGuestInfo = async () => {
    try {
      const res = await axios.get("/users/guests");
      setGuestInfo(res.data.data || []);
    } catch {
      toast.error("Failed to fetch guests");
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/users/myBookings");
      setBookings(res.data.data || []);
    } catch {
      toast.error("Failed to fetch bookings");
    }
  };

  const updateUserProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.patch("/users/profile", {
        name,
        dateOfBirth,
        gender: gender?.toUpperCase(),
      });
      toast.success("Profile updated");
      setOpenProfileDialog(false);
      fetchUserProfile();
    } catch {
      toast.error("Update failed");
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
    const payload = { name: guestName, dateOfBirth: guestDOB, gender: guestGender.toUpperCase() };

    try {
      if (editingGuest) {
        await axios.put(`/users/guests/${editingGuest.id}`, payload);
        toast.success("Guest updated");
      } else {
        await axios.post("/users/guests", payload);
        toast.success("Guest added");
      }
      setGuestDialogOpen(false);
      fetchGuestInfo();
    } catch {
      toast.error("Failed to save guest");
    }
  };

  const removeGuest = async (id) => {
    try {
      await axios.delete(`/users/guests/${id}`);
      toast.success("Guest removed");
      fetchGuestInfo();
    } catch {
      toast.error("Failed to remove guest");
    }
  };

  const cancelBooking = async (id) => {
    try {
      await axios.post(`/bookings/${id}/cancel`);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch {
      toast.error("Cancel failed");
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
      className="min-h-screen bg-gradient-to-b from-[#FFF8F1] to-[#F4D9C6] px-6 py-10"
    >
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border border-[#F3D9D9] shadow-xl rounded-2xl p-8 space-y-10">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-[#3B3B3B]">Your Profile</h1>
          <p className="text-[#7a7a7a]">Manage your info, guests & bookings</p>

          <Button 
            onClick={() => navigate("/home")}
            className="mt-2 rounded-full bg-gradient-to-r from-[#E8B4B8] to-[#B7CADB] text-[#3B3B3B]"
          >
            Home
          </Button>
        </div>

        {/* Profile Card */}
        <motion.div className="bg-[#FFF1EC] border border-[#F3D9D9] p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-[#3B3B3B] mb-3">Profile</h2>

          <div className="grid grid-cols-2 gap-3 text-[#6b6b6b]">
            <p><strong>Name:</strong> {name}</p>
            <p><strong>DOB:</strong> {dateOfBirth || "Not set"}</p>
            <p><strong>Gender:</strong> {gender}</p>
            <p><strong>Email:</strong> {email}</p>
          </div>

          <Button
            onClick={() => setOpenProfileDialog(true)}
            className="mt-4 rounded-full bg-gradient-to-r from-[#E28C8A] to-[#B7CADB] text-[#3B3B3B]"
          >
            Edit Profile
          </Button>
        </motion.div>

        {/* Profile Edit Dialog */}
        <Dialog open={openProfileDialog} onOpenChange={setOpenProfileDialog}>
          <DialogContent className="bg-white rounded-2xl border border-[#F3D9D9]">
            <DialogHeader><DialogTitle>Edit Profile</DialogTitle></DialogHeader>

            <form onSubmit={updateUserProfile} className="space-y-3">
              <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div><Label>DOB</Label><Input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} /></div>
              <div><Label>Gender</Label><Input value={gender} onChange={(e) => setGender(e.target.value)} /></div>

              <DialogFooter>
                <Button className="w-full rounded-full bg-gradient-to-r from-[#E8B4B8] to-[#B7CADB] text-[#3B3B3B]">
                  Save
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Guests */}
        <motion.div className="bg-white/80 border border-[#F3D9D9] p-6 rounded-xl shadow-md">
          <div className="flex justify-between mb-4">
            <h3 className="text-xl font-semibold text-[#3B3B3B]">Guests</h3>
            <Button 
              onClick={() => openGuestDialog()}
              className="rounded-full bg-gradient-to-r from-[#E8B4B8] to-[#B7CADB] text-[#3B3B3B]"
            >
              + Add Guest
            </Button>
          </div>

          {guestInfo.length ? guestInfo.map((g) => (
            <div key={g.id} className="bg-[#FFF1EC] p-4 border border-[#F3D9D9] rounded-xl mb-2 flex justify-between">
              <div className="text-[#6b6b6b]">
                <p><strong>Name:</strong> {g.name}</p>
                <p><strong>DOB:</strong> {g.dateOfBirth}</p>
                <p><strong>Gender:</strong> {g.gender}</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => openGuestDialog(g)} className="rounded-full bg-[#B7CADB] text-[#3B3B3B]">Edit</Button>
                <Button onClick={() => removeGuest(g.id)} className="rounded-full bg-[#E28C8A] text-white">Remove</Button>
              </div>
            </div>
          )) : <p className="text-[#7a7a7a] text-center">No guests added yet.</p>}
        </motion.div>

        {/* Guest Dialog */}
        <Dialog open={guestDialogOpen} onOpenChange={setGuestDialogOpen}>
          <DialogContent className="bg-white rounded-2xl border border-[#F3D9D9]">
            <DialogHeader><DialogTitle>{editingGuest ? "Edit Guest" : "Add Guest"}</DialogTitle></DialogHeader>

            <form onSubmit={handleGuestSubmit} className="space-y-3">
              <div><Label>Name</Label><Input value={guestName} onChange={(e) => setGuestName(e.target.value)} required /></div>
              <div><Label>DOB</Label><Input type="date" value={guestDOB} onChange={(e) => setGuestDOB(e.target.value)} required /></div>
              <div><Label>Gender</Label><Input value={guestGender} onChange={(e) => setGuestGender(e.target.value)} required /></div>

              <DialogFooter>
                <Button className="w-full rounded-full bg-gradient-to-r from-[#E8B4B8] to-[#B7CADB] text-[#3B3B3B]">
                  {editingGuest ? "Save Changes" : "Add Guest"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Bookings */}
        <motion.div className="bg-[#FFF1EC] border border-[#F3D9D9] p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-[#3B3B3B] mb-4">Bookings</h3>

          {bookings.length ? bookings.map((b) => (
            <div key={b.id} className="bg-white/70 p-4 border border-[#F3D9D9] rounded-xl mb-2">
              <div className="grid grid-cols-2 gap-2 text-[#6b6b6b]">
                <p><strong>Check-in:</strong> {b.checkInDate}</p>
                <p><strong>Check-out:</strong> {b.checkOutDate}</p>
                <p><strong>Rooms:</strong> {b.roomsCount}</p>
                <p><strong>Amount:</strong> ₹{b.amount}</p>
                <p><strong>Status:</strong> {b.bookingStatus}</p>
                <p><strong>Guests:</strong> {b.guests.length}</p>
              </div>

              <Button
                onClick={() => cancelBooking(b.id)}
                className="mt-3 rounded-full bg-gradient-to-r from-[#E28C8A] to-[#B7CADB] text-[#3B3B3B]"
              >
                Cancel
              </Button>
            </div>
          )) : <p className="text-[#7a7a7a] text-center">No bookings found.</p>}
        </motion.div>

      </div>
    </motion.div>
  );
};

export default UserProfileBooking;
