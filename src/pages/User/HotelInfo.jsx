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
    console.log("Search Params:", searchParams);

  if (!hotelData)
    return (
      <p className="text-center mt-10 text-gray-500">
        No hotel data available.
      </p>
    );

  const { hotel, rooms } = hotelData.data;

  const handleBookNow = async (roomId) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!searchParams) {
        toast.error("Search details missing! Please search again.");
        return;
      }

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

      toast.success("Booking initiated successfully!");
      navigate("/booking-details", { state: { bookingDetails: res.data } });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error booking room. Please try again."
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 bg-gradient-to-br bg-gray-400 min-h-screen">
      {/* Back Button */}
      <Button
        onClick={() => navigate("/search-results")}
        variant="outline"
        className="mb-6 border-indigo-200 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 transition-all duration-200"
      >
        ← Back to Results
      </Button>

      {/* Hotel Header */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <h1 className="text-4xl font-bold text-indigo-700 mb-2 tracking-tight">
          {hotel.name}
        </h1>
        <p className="text-gray-600 mb-1">{hotel.city}</p>
        {hotel.contactInfo?.address && (
          <p className="text-gray-500 mb-1">{hotel.contactInfo.address}</p>
        )}
        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-2">
          {hotel.contactInfo?.phoneNumber && (
            <span>📞 {hotel.contactInfo.phoneNumber}</span>
          )}
          {hotel.contactInfo?.email && <span>✉️ {hotel.contactInfo.email}</span>}
        </div>
      </motion.div>

      {/* Hotel Photos */}
      {hotel.photos && hotel.photos.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {hotel.photos.map((photo, index) => (
            <motion.img
              key={index}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              src={photo}
              alt={`${hotel.name} photo ${index + 1}`}
              className="rounded-2xl w-full h-64 object-cover shadow-md hover:shadow-xl transition-all duration-300"
            />
          ))}
        </motion.div>
      )}

      {/* Amenities */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-semibold text-indigo-700 mb-3 flex items-center gap-2">
          <span>✨ Amenities</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {hotel.amenities?.map((amenity, index) => (
            <motion.span
              whileHover={{ scale: 1.05 }}
              key={index}
              className="bg-gradient-to-r from-indigo-100 to-sky-100 border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
            >
              {amenity}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Rooms Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold text-indigo-700 mb-6">
          🛏 Available Rooms
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {rooms?.map((room) => (
            <motion.div
              key={room.id}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Card className="rounded-2xl border bg-gray-300 border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
                {room.photos && room.photos[0] && (
                  <motion.img
                    src={room.photos[0]}
                    alt={room.type}
                    className="h-52 w-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
                <CardContent className="p-5">
                  <CardHeader className="p-0 mb-2">
                    <CardTitle className="text-xl font-semibold text-indigo-700">
                      {room.type}
                    </CardTitle>
                  </CardHeader>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {room.amenities?.map((amenity, index) => (
                      <span
                        key={index}
                        className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-1 rounded-full text-xs"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <p className="mt-3 text-lg font-bold text-indigo-600">
                    ${room.price}
                  </p>

                  <Button
                    onClick={() => handleBookNow(room.id)}
                    className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-700 hover:to-sky-700 text-white font-semibold rounded-xl py-2 shadow-sm hover:shadow-md transition-all"
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
