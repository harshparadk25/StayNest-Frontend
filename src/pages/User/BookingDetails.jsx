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

  // ✅ Fetch guests
  const fetchAllGuest = async () => {
    try {
      const res = await axios.get("/users/guests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGuests(res.data.data || []);
    } catch (error) {
      toast.error("Error fetching guests. Please try again.");
      console.error("Fetch Guests Error:", error);
    }
  };

  // ✅ Toggle guest selection
  const handleSelectGuest = (guestId) => {
    setSelectedGuests((prev) => {
      const newSet = new Set(prev);
      newSet.has(guestId) ? newSet.delete(guestId) : newSet.add(guestId);
      return newSet;
    });
  };

  // ✅ Add selected guests to booking
  const handleAddGuestsToBooking = async () => {
    if (selectedGuests.size === 0) {
      toast.error("Please select at least one guest.");
      return;
    }

    try {
      const guestIds = Array.from(selectedGuests);
      const res = await axios.post(
        `/bookings/${bookingDetails.id}/addGuests`,
        JSON.stringify(guestIds),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Guests successfully added to booking!");
      console.log("Add Guest Response:", res.data);
      setGuestDialogOpen(false);
    } catch (error) {
      console.error("Add Guest Error:", error);
      toast.error("Failed to add guests. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <motion.div
        className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-10 border border-indigo-100"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-700 tracking-tight">
            Booking Details
          </h1>
          <Button
            variant="outline"
            onClick={() => navigate("/home")}
            className="hover:bg-indigo-100"
          >
            Go to Home
          </Button>
        </div>

        {bookingDetails ? (
          <>
            <motion.div
              className="bg-indigo-50 p-6 rounded-2xl shadow-inner"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-semibold text-indigo-800 mb-4 border-b pb-2">
                Booking Confirmation
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                <p>
                  <strong>Booking ID:</strong> {bookingDetails.id}
                </p>
                <p>
                  <strong>Check-in:</strong>{" "}
                  {new Date(bookingDetails.checkInDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Check-out:</strong>{" "}
                  {new Date(bookingDetails.checkOutDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Rooms:</strong> {bookingDetails.roomsCount}
                </p>
                <p>
                  <strong>Total Amount:</strong>{" "}
                  <span className="text-indigo-700 font-medium">
                    ₹{bookingDetails.amount}
                  </span>
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
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

            {/* Guest Dialog */}
            <div className="mt-6">
              <Dialog open={guestDialogOpen} onOpenChange={setGuestDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setGuestDialogOpen(true);
                      fetchAllGuest();
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Add Guest to Booking
                  </Button>
                </DialogTrigger>

                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-indigo-700">
                      Select Guests
                    </DialogTitle>
                  </DialogHeader>

                  <div className="max-h-64 overflow-y-auto mt-4 space-y-2">
                    {guests.length > 0 ? (
                      guests.map((guest) => (
                        <div
                          key={guest.id}
                          onClick={() => handleSelectGuest(guest.id)}
                          className={`cursor-pointer border p-3 rounded-lg flex justify-between items-center transition-all ${
                            selectedGuests.has(guest.id)
                              ? "bg-indigo-100 border-indigo-500"
                              : "bg-white hover:bg-gray-100"
                          }`}
                        >
                          <span>{guest.name}</span>
                          {selectedGuests.has(guest.id) && (
                            <span className="text-indigo-600 font-semibold">
                              ✓
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500">
                        No guests available.
                      </p>
                    )}
                  </div>

                  <DialogFooter className="mt-4">
                    <Button
                      onClick={handleAddGuestsToBooking}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      Confirm Selection
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <motion.p
              className="mt-8 text-center text-green-600 font-semibold text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              ✅ Thank you for booking with us! We look forward to your stay.
            </motion.p>

            <Button
              onClick={() =>
                navigate("/user-profile", { state: { from: "bookingDetails" } })
              }
              className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-all"
            >
              View My Bookings
            </Button>
          </>
        ) : (
          <p className="text-center text-red-600 text-lg mt-8">
            No booking details available.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default BookingDetails;
