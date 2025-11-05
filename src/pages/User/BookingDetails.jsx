import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import axios from "../../config/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const BookingDetails = () => {
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails?.data;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [guestDialogOpen, setGuestDialogOpen] = useState(false);
  const [guests, setGuests] = useState([]);
  const [selectedGuests, setSelectedGuests] = useState(new Set());

  const fetchAllGuest = async () => {
    try {
      const res = await axios.get("/users/guests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGuests(res.data.data || []);
    } catch (error) {
      toast.error("Error fetching guests");
    }
  };

  const handleSelectGuest = (guestId) => {
    setSelectedGuests((prev) => {
      const set = new Set(prev);
      set.has(guestId) ? set.delete(guestId) : set.add(guestId);
      return set;
    });
  };

  const handleAddGuestsToBooking = async () => {
    if (!selectedGuests.size) return toast.error("Select at least one guest");

    try {
      const guestIds = Array.from(selectedGuests);
      await axios.post(
        `/bookings/${bookingDetails.id}/addGuests`,
        JSON.stringify(guestIds),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Guests added!");
      setGuestDialogOpen(false);
    } catch {
      toast.error("Failed to add guests.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F1] to-[#F4D9C6] py-12 px-4">
      <motion.div
        className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl shadow-lg rounded-2xl p-10 border border-[#FBECEC]"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#3B3B3B]">Booking Details</h1>
          
          <Button
            variant="outline"
            onClick={() => navigate("/home")}
            className="rounded-full border-[#E8B4B8] text-[#E28C8A] hover:bg-[#E8B4B8]/30"
          >
            Go to Home
          </Button>
        </div>

        {bookingDetails ? (
          <>
            <motion.div
              className="bg-[#FFF1EC] p-6 rounded-xl shadow-inner"
              initial={{ opacity: 0.95, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-4 border-b pb-2">
                Booking Confirmation
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#6b6b6b]">
                <p><strong>ID:</strong> {bookingDetails.id}</p>
                <p><strong>Check-in:</strong> {new Date(bookingDetails.checkInDate).toLocaleDateString()}</p>
                <p><strong>Check-out:</strong> {new Date(bookingDetails.checkOutDate).toLocaleDateString()}</p>
                <p><strong>Rooms:</strong> {bookingDetails.roomsCount}</p>
                <p>
                  <strong>Total:</strong>{" "}
                  <span className="text-[#E28C8A] font-bold">
                    ₹{bookingDetails.amount}
                  </span>
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-3 py-1 text-xs rounded-full text-white ${
                      bookingDetails.bookingStatus === "RESERVED"
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {bookingDetails.bookingStatus}
                  </span>
                </p>
              </div>
            </motion.div>

            <div className="mt-6">
              <Dialog open={guestDialogOpen} onOpenChange={setGuestDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      fetchAllGuest();
                      setGuestDialogOpen(true);
                    }}
                    className="bg-gradient-to-r from-[#E8B4B8] to-[#B7CADB] text-[#3B3B3B] rounded-full"
                  >
                    Add Guests
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-md bg-white rounded-2xl border border-[#F3D9D9]">
                  <DialogHeader>
                    <DialogTitle className="text-[#3B3B3B] text-lg font-semibold">
                      Select Guests
                    </DialogTitle>
                  </DialogHeader>

                  <div className="max-h-60 overflow-y-auto mt-4 space-y-2">
                    {guests.length ? (
                      guests.map((guest) => (
                        <div
                          key={guest.id}
                          onClick={() => handleSelectGuest(guest.id)}
                          className={`cursor-pointer flex justify-between px-4 py-2 rounded-lg border transition ${
                            selectedGuests.has(guest.id)
                              ? "bg-[#FBECEC] border-[#E28C8A] text-[#E28C8A]"
                              : "bg-white border-[#F3D9D9] hover:bg-[#FFF1EC]"
                          }`}
                        >
                          <span>{guest.name}</span>
                          {selectedGuests.has(guest.id) && "✓"}
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-[#8a8a8a]">No guests found</p>
                    )}
                  </div>

                  <DialogFooter className="mt-4">
                    <Button
                      onClick={handleAddGuestsToBooking}
                      className="w-full bg-gradient-to-r from-[#E28C8A] to-[#B7CADB] text-[#3B3B3B] rounded-xl py-2"
                    >
                      Confirm
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <motion.p
              className="mt-8 text-center text-green-600 font-semibold text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ✅ Thank you for booking — we look forward to hosting you!
            </motion.p>

            <Button
              onClick={() => navigate("/user-profile")}
              className="mt-6 w-full bg-gradient-to-r from-[#E8B4B8] to-[#B7CADB] text-[#3B3B3B] rounded-xl py-3 font-semibold"
            >
              View My Bookings
            </Button>
          </>
        ) : (
          <p className="text-center text-red-600 mt-8">No booking details.</p>
        )}
      </motion.div>
    </div>
  );
};

export default BookingDetails;
