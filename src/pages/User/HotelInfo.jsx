import React from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "../../config/axios";
import { motion } from "framer-motion";

const HotelInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotelId } = useParams();
  const hotelData = location.state?.hotelDetails;
  const searchParams =
    location.state?.searchParams ||
    JSON.parse(localStorage.getItem("searchParams") || "{}");

  if (!hotelData)
    return (
      <p className="text-center mt-10 text-[#6b6b6b]">
        No hotel data available.
      </p>
    );

  const { hotel, rooms } = hotelData.data;

  const handleBookNow = async (roomId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!searchParams) return toast.error("Search again please.");

      const res = await axios.post(
        "/bookings/init",
        {
          hotelId,
          roomId,
          checkInDate: searchParams.startDate,
          checkOutDate: searchParams.endDate,
          roomsCount: searchParams.roomsCount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Booking started!");
      navigate("/booking-details", { state: { bookingDetails: res.data } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F1] to-[#F4D9C6] px-6 py-10">
      
      {/* Back */}
      <Button
        onClick={() => navigate("/search-results")}
        className="mb-6 rounded-full bg-white border border-[#E8B4B8] text-[#E28C8A] hover:bg-[#E8B4B8]/30"
      >
        ← Back
      </Button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 bg-white/80 backdrop-blur-xl border border-[#F3D9D9] rounded-2xl p-6 shadow"
      >
        <h1 className="text-4xl font-bold text-[#3B3B3B]">{hotel.name}</h1>
        <p className="text-[#6b6b6b]">{hotel.city}</p>
        {hotel.contactInfo?.address && (
          <p className="text-[#8d8d8d]">{hotel.contactInfo.address}</p>
        )}
        <div className="flex flex-wrap gap-3 text-sm text-[#7a7a7a] mt-2">
          {hotel.contactInfo?.phoneNumber && (
            <span>📞 {hotel.contactInfo.phoneNumber}</span>
          )}
          {hotel.contactInfo?.email && <span>✉️ {hotel.contactInfo.email}</span>}
        </div>
      </motion.div>

      {/* Photos */}
      {hotel.photos?.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {hotel.photos.map((photo, i) => (
            <motion.img
              key={i}
              whileHover={{ scale: 1.02 }}
              src={photo}
              className="rounded-2xl w-full h-64 object-cover shadow-md hover:shadow-xl"
              alt={`Hotel ${i}`}
            />
          ))}
        </motion.div>
      )}

      {/* Amenities */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-3">
          ✨ Amenities
        </h2>
        <div className="flex flex-wrap gap-2">
          {hotel.amenities?.map((a, i) => (
            <span
              key={i}
              className="bg-[#FBECEC] text-[#E28C8A] px-3 py-1 rounded-full text-sm border border-[#F3D9D9]"
            >
              {a}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Rooms */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-semibold text-[#3B3B3B] mb-6">
          🛏 Available Rooms
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rooms?.map((room) => (
            <motion.div
              key={room.id}
              whileHover={{ y: -3, scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Card className="rounded-2xl bg-white border border-[#F3D9D9] shadow hover:shadow-lg transition overflow-hidden">
                {room.photos?.[0] && (
                  <motion.img
                    src={room.photos[0]}
                    className="h-48 w-full object-cover"
                    whileHover={{ scale: 1.03 }}
                  />
                )}

                <CardContent className="p-5">
                  <CardHeader className="p-0 mb-2">
                    <CardTitle className="text-xl font-semibold text-[#3B3B3B]">
                      {room.type}
                    </CardTitle>
                  </CardHeader>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {room.amenities?.map((a, i) => (
                      <span
                        key={i}
                        className="bg-[#FFF1EC] text-[#E28C8A] px-2 py-1 rounded-full text-xs border border-[#F3D9D9]"
                      >
                        {a}
                      </span>
                    ))}
                  </div>

                  <p className="mt-3 text-lg font-bold text-[#E28C8A]">
                    ₹{room.price}
                  </p>

                  <Button
                    onClick={() => handleBookNow(room.id)}
                    className="mt-4 w-full bg-gradient-to-r from-[#E8B4B8] to-[#B7CADB] text-[#3B3B3B] rounded-xl py-2 shadow"
                  >
                    Book Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HotelInfo;
