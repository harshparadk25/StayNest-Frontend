import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "../../config/axios";
import { useNavigate } from "react-router-dom";
const BookingDetails = () => {
  const location = useLocation();
  const bookingDetails = location.state?.bookingDetails?.data;
  console.log("Booking Details:", bookingDetails);
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
      if (newSet.has(guestId)) newSet.delete(guestId);
      else newSet.add(guestId);
      return newSet;
    });
  };

  // ✅ Send selected guests to backend
  const handleAddGuestsToBooking = async () => {
    if (selectedGuests.size === 0) {
      toast.error("Please select at least one guest.");
      return;
    }

    const guestIds = Array.from(selectedGuests);
    console.log("Sending guest IDs:", guestIds);

    try {
      const res = await axios.post(
  `/bookings/${bookingDetails.id}/addGuests`,
  JSON.stringify(guestIds), // ✅ explicitly send as JSON array
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
    <div className="min-h-screen bg-gray-50 py-10">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Booking Details
      </h1>

      {bookingDetails ? (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-gray-700 border-b pb-3">
            Booking Confirmation
          </h2>

          <div className="space-y-3 text-gray-700">
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
              <strong>Total Amount:</strong> ₹{bookingDetails.amount}
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

            <Dialog open={guestDialogOpen} onOpenChange={setGuestDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="mt-2"
                  onClick={() => {
                    setGuestDialogOpen(true);
                    fetchAllGuest();
                  }}
                >
                  Add Guest to Booking
                </Button>
              </DialogTrigger>

              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Select Guests</DialogTitle>
                </DialogHeader>

                <div className="max-h-64 overflow-y-auto mt-4 space-y-2">
                  {guests.length > 0 ? (
                    guests.map((guest) => (
                      <div
                        key={guest.id}
                        onClick={() => handleSelectGuest(guest.id)}
                        className={`cursor-pointer border p-3 rounded-lg flex justify-between items-center transition-all ${
                          selectedGuests.has(guest.id)
                            ? "bg-green-100 border-green-500"
                            : "bg-white hover:bg-gray-100"
                        }`}
                      >
                        <span>{guest.name}</span>
                        {selectedGuests.has(guest.id) && (
                          <span className="text-green-600 font-semibold">
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
                  <Button onClick={handleAddGuestsToBooking}>
                    Confirm Selection
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <p className="mt-6 text-green-600 font-semibold text-center">
            ✅ Thank you for booking with us!
          </p>
          <Button onClick={() => navigate("/user-profile", { state: { from: "bookingDetails" } })} className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded">
            View My Bookings
          </Button>
        </div>
      ) : (
        <p className="text-center text-red-600 text-lg">
          No booking details available.
        </p>
      )}
    </div>
  );
};

export default BookingDetails;
