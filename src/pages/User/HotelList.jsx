import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axios from "../../config/axios";
import { motion } from "framer-motion";

const HotelList = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { searchParams: stateParams } = location.state || {};
  const [searchParams, setSearchParams] = useState(stateParams || null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch hotels
  const fetchHotels = async (params) => {
    if (!params) return;
    setLoading(true);
    try {
      const res = await axios.post("/hotels/search", params);
      const fetchedHotels = res.data.data?.content || [];
      setHotels(fetchedHotels);
      // ✅ Save data after successful fetch
      localStorage.setItem("hotelsList", JSON.stringify(fetchedHotels));
      localStorage.setItem("searchParams", JSON.stringify(params));
      toast.success("Hotels fetched successfully!");
      console.log("Fetched Hotels:", fetchedHotels);
    } catch (error) {
      toast.error("Error fetching hotels. Please try again.");
      console.error("Fetch Hotels Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Restore from localStorage if state is empty
  useEffect(() => {
    const savedHotels = JSON.parse(localStorage.getItem("hotelsList"));
    const savedParams = JSON.parse(localStorage.getItem("searchParams"));

    if (stateParams) {
      setSearchParams(stateParams);
      fetchHotels(stateParams);
    } else if (savedHotels && savedParams) {
      setHotels(savedHotels);
      setSearchParams(savedParams);
    } else {
      toast.error("No search results found. Please search again.");
      navigate("/home");
    }
  }, []);

  // ✅ Fetch details
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
      navigate(`/hotels/${hotelId}/info`, {
        state: { hotelDetails: res.data, searchParams },
      });
      console.log("Hotel Details:", res.data);
      toast.success("Hotel details fetched successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching hotel details.");
    }
  };

  // ✅ Loading & empty states
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-700 text-lg font-medium">
        Loading hotels...
      </div>
    );

  if (!hotels.length)
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-gray-700 text-lg font-medium">
        <p>No hotels found for your search.</p>
        <Button
          onClick={() => navigate("/home")}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full px-6 py-3 shadow-md transition-all duration-300"
        >
          Go to Home
        </Button>
      </div>
    );

  // ✅ Main layout
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-6">
      {/* Header */}
      <header className="flex justify-between items-center max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Available Stays in{" "}
          <span className="text-blue-700 capitalize">
            {searchParams?.city || "your area"}
          </span>
        </h1>
        <Button
          onClick={() => navigate("/home")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full px-6 py-2 shadow-md transition-all duration-300"
        >
          Go to Home
        </Button>
      </header>

      {/* Hotel Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hotels.map((hotel, index) => (
          <motion.div
            key={hotel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            <Card className="overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              {hotel.photos?.[0] && (
                <motion.img
                  src={hotel.photos[0]}
                  alt={hotel.name}
                  className="h-56 w-full object-cover rounded-t-2xl"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.4 }}
                />
              )}
              <CardContent className="p-5">
                <CardHeader className="p-0 mb-3">
                  <CardTitle className="text-xl font-semibold text-gray-900 truncate">
                    {hotel.name}
                  </CardTitle>
                </CardHeader>

                <p className="text-sm text-gray-600 mb-1">
                  {hotel.contactInfo?.address || "Address not available"}
                </p>
                <p className="text-sm text-gray-500">{hotel.city}</p>

                <p className="mt-3 font-bold text-blue-700 text-lg">
                  ₹{hotel.price || "N/A"}{" "}
                  <span className="text-sm text-gray-500 font-medium">/ night</span>
                </p>

                <div className="mt-4 flex gap-2 flex-wrap">
                  {hotel.amenities?.slice(0, 5).map((item, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium border border-blue-200"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <Button
                  className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg py-2.5 transition-all duration-300"
                  onClick={() => handleGetDetails(hotel.id)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HotelList;
