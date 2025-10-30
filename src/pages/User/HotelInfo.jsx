import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import axios from "../../config/axios";
import { useNavigate } from "react-router-dom";

const HotelInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hotelId } = useParams(); // 👈 get hotelId from URL
  const hotelData = location.state?.hotelDetails;
 const searchParams =
  location.state?.searchParams ||
  JSON.parse(localStorage.getItem("searchParams") || "{}");


  if (!hotelData) return <p className="text-center mt-10">No hotel data available.</p>;

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
          hotelId: hotelId,
          roomId,
          checkInDate: searchParams.startDate,
          checkOutDate: searchParams.endDate,
          roomsCount: searchParams.roomsCount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );



      toast.success("Booking initiated successfully!");
      console.log("Booking Response:", res.data);
      navigate("/booking-details", { state: { bookingDetails: res.data } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Error booking room. Please try again.");
      console.error("Booking Error:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hotel Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-indigo-600 mb-2">{hotel.name}</h1>
        <p className="text-gray-600 mb-1">{hotel.city}</p>
        <p className="text-gray-500">{hotel.contactInfo?.address}</p>
        <p className="text-gray-500">{hotel.contactInfo?.phoneNumber}</p>
        <p className="text-gray-500">{hotel.contactInfo?.email}</p>
      </div>

      {/* Hotel Photos */}
      {hotel.photos && hotel.photos.length > 0 && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {hotel.photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`${hotel.name} photo ${index + 1}`}
              className="rounded-lg w-full h-64 object-cover"
            />
          ))}
        </div>
      )}

      {/* Amenities */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Amenities</h2>
        <div className="flex flex-wrap gap-2">
          {hotel.amenities?.map((amenity, index) => (
            <span
              key={index}
              className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
            >
              {amenity}
            </span>
          ))}
        </div>
      </div>

      {/* Rooms */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rooms?.map((room) => (
            <Card key={room.id} className="hover:shadow-xl transition-shadow">
              {room.photos && room.photos[0] && (
                <img
                  src={room.photos[0]}
                  alt={room.type}
                  className="h-48 w-full object-cover rounded-t-lg"
                />
              )}
              <CardContent className="p-4">
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-lg font-semibold text-indigo-600">{room.type}</CardTitle>
                </CardHeader>
                <div className="mt-2 flex flex-wrap gap-2">
                  {room.amenities?.map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
                <p className="mt-2 font-bold text-indigo-600">${room.price}</p>
                <Button
                  className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
                  onClick={() => handleBookNow(room.id)}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelInfo;
