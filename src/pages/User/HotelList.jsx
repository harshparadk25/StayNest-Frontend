/* ✅ Only CSS changed — logic restored */

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

  const fetchHotels = async (params) => {
    if (!params) return;
    setLoading(true);
    try {
      const res = await axios.post("/hotels/search", params);
      const fetchedHotels = res.data.data?.content || [];
      setHotels(fetchedHotels);
      localStorage.setItem("hotelsList", JSON.stringify(fetchedHotels));
      localStorage.setItem("searchParams", JSON.stringify(params));
      toast.success("Hotels found!");
    } catch {
      toast.error("Error fetching hotels");
    } finally {
      setLoading(false);
    }
  };

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
      toast.error("Search again");
      navigate("/home");
    }
  }, []);

  
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
      toast.success("Hotel details fetched successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching hotel details.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-[#5a5a5a] text-lg">
        Loading cozy stays...
      </div>
    );

  if (!hotels.length)
    return (
      <div className="flex flex-col justify-center items-center h-screen text-[#5a5a5a]">
        <p>No stays found.</p>
        <Button
          onClick={() => navigate("/home")}
          className="mt-4 bg-gradient-to-r from-[#E8B4B8] to-[#B7CADB] text-[#3B3B3B] rounded-full px-6 py-3"
        >
          Search Again
        </Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F1] to-[#F4D9C6] py-12 px-6">
      <header className="flex justify-between items-center max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-[#3B3B3B]">
          Stays in <span className="text-[#E28C8A] capitalize">{searchParams?.city}</span>
        </h1>

        <Button
          onClick={() => navigate("/home")}
          className="bg-gradient-to-r from-[#E8B4B8] to-[#B7CADB] text-[#3B3B3B] rounded-full px-6 py-2 shadow"
        >
          Home
        </Button>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {hotels.map((hotel, i) => (
          <motion.div key={hotel.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="rounded-2xl border border-[#f3d5c5] bg-white shadow hover:shadow-lg transition duration-300 hover:-translate-y-1">
              {hotel.photos?.[0] && (
                <motion.img
                  src={hotel.photos[0]}
                  alt={hotel.name}
                  className="h-56 w-full object-cover rounded-t-2xl"
                  whileHover={{ scale: 1.03 }}
                />
              )}

              <CardContent className="p-5">
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-lg font-semibold text-[#3B3B3B] truncate">
                    {hotel.name}
                  </CardTitle>
                </CardHeader>

                <p className="text-sm text-[#6b6b6b] mb-1">{hotel.contactInfo?.address}</p>
                <p className="text-xs text-[#7a7a7a]">{hotel.city}</p>

                <p className="mt-2 font-bold text-[#E28C8A] text-lg">
                  ₹{hotel.price}
                  <span className="text-xs text-[#6b6b6b] font-normal"> / night</span>
                </p>

                <div className="mt-3 flex gap-2 flex-wrap">
                  {hotel.amenities?.slice(0, 5).map((item, idx) => (
                    <span
                      key={idx}
                      className="bg-[#FBECEC] text-[#E28C8A] px-3 py-1 rounded-full text-xs border border-[#F3D9D9]"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* ✅ RESTORED: use handleGetDetails to fetch + navigate with hotelDetails */}
                <Button
                  className="mt-4 w-full bg-gradient-to-r from-[#E8B4B8] to-[#B7CADB] text-[#3B3B3B] rounded-xl py-2"
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
