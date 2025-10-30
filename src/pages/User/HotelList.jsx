import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "../../config/axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios";

const HotelList = () => {
  const location = useLocation();
  const { searchParams } = location.state || {}; // get search parameters from Home
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchHotels = async () => {
    if (!searchParams) return;
    setLoading(true);
    try {
      const res = await axios.post("/hotels/search", searchParams);
      setHotels(res.data.data?.content || []);
      console.log("Fetched Hotels:", res.data);
    } catch (error) {
      toast.error("Error fetching hotels. Please try again.");
      console.error("Fetch Hotels Error:", error);
    } finally {
      setLoading(false);
    }
  };

 const handleGetDetails = async (hotelId) => {
  try {
    const token = localStorage.getItem("accessToken");
    const res = await axios.post(
      `/hotels/${hotelId}/info`,
      {
        startDate: searchParams.startDate,
        endDate: searchParams.endDate,
        roomsCount: searchParams.roomsCount,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    localStorage.setItem("searchParams", JSON.stringify(searchParams));
    console.log("Hotel Details Response:", res.data);
    navigate(`/hotels/${hotelId}/info`, { state: { hotelDetails: res.data , searchParams } });
  } catch (error) {
    toast.error(error.response?.data?.message || "Error fetching hotel details.");
  }
};



  useEffect(() => {
    fetchHotels();
  }, [searchParams]);

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading hotels...</p>;

  if (!hotels.length)
    return <p className="text-center mt-10 text-gray-600">No hotels found for your search.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hotels.map((hotel) => (
        <motion.div
          key={hotel.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="hover:shadow-xl transition-shadow">
            {hotel.photos && hotel.photos[0] && (
              <img
                src={hotel.photos[0]}
                alt={hotel.name}
                className="h-48 w-full object-cover rounded-t-lg"
              />
            )}
            <CardContent className="p-4">
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-lg font-semibold text-indigo-600">
                  {hotel.name}
                </CardTitle>
              </CardHeader>
              <p className="text-gray-600">{hotel.city}</p>
              <p className="mt-2 text-sm text-gray-500">
                {hotel.contactInfo?.address || "No address available"}
              </p>
              <p className="mt-2 font-bold text-indigo-600">${hotel.price || "N/A"}</p>
              <div className="mt-4 flex gap-2 flex-wrap">
                {hotel.amenities?.map((item, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <Button className="mt-4 w-full" onClick={() => handleGetDetails(hotel.id)}>
                Get Details
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default HotelList;
