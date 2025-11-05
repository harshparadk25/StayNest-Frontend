import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "../../config/axios";
import { motion } from "framer-motion";
import { Sparkles, LogOut, User, Heart, Coffee, Home as HomeIcon } from "lucide-react";

const Home = () => {
  const [location, setLocation] = useState("dewas");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState(1);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      if (!location || !checkIn || !checkOut || !rooms) {
        toast.error("Please fill in all fields.");
        return;
      }

      const body = {
        city: location.toLowerCase(),
        startDate: new Date(checkIn).toISOString().split("T")[0],
        endDate: new Date(checkOut).toISOString().split("T")[0],
        roomsCount: parseInt(rooms),
        page: 0,
        size: 10,
      };

      localStorage.setItem("lastSearch", JSON.stringify(body));
      const res = await axios.post("/hotels/search", body);

      navigate("/search-results", {
        state: { hotels: res.data.content || [], searchParams: body },
      });
    } catch (error) {
      toast.error("Error searching for stays. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  const float = {
    animate: {
      y: [0, -10, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-[#FFF8F1] via-[#F4D9C6] to-[#FFEDEA]">

      {/* Pastel floating icons */}
      <motion.div className="absolute top-32 left-12 text-[#E28C8A]" variants={float} animate="animate">
        <HomeIcon size={42} />
      </motion.div>
      <motion.div className="absolute top-24 right-16 text-[#B7CADB]" variants={float} animate="animate">
        <Sparkles size={40} />
      </motion.div>
      <motion.div className="absolute bottom-40 left-20 text-[#E8B4B8]" variants={float} animate="animate">
        <Heart size={42} />
      </motion.div>
      <motion.div className="absolute bottom-20 right-24 text-[#B7CADB]" variants={float} animate="animate">
        <Coffee size={42} />
      </motion.div>

      {/* Pastel blur blobs */}
      <motion.div className="absolute -top-32 -left-20 w-96 h-96 bg-[#E8B4B8]/40 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 6, repeat: Infinity }} />
      <motion.div className="absolute bottom-0 right-0 w-[26rem] h-[26rem] bg-[#B7CADB]/40 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} />

      {/* Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="absolute top-0 left-0 w-full flex justify-between items-center px-8 py-4 bg-white/50 backdrop-blur-xl border-b border-white/60 z-20"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="text-[#E28C8A] w-6 h-6" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#E28C8A] to-[#B7CADB] bg-clip-text text-transparent">
            StayNest
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/user-profile">
            <Button className="bg-[#FFE4E1] hover:bg-[#F9D6D2] text-[#C26A6A] rounded-full px-5 py-2 border border-[#E8B4B8]">
              <User size={18} /> Profile
            </Button>
          </Link>

          <Button
            onClick={handleLogout}
            className="bg-[#FDE2E4] hover:bg-[#F4CFCF] text-[#D46A6A] rounded-full px-5 py-2 border border-[#F8AFA6]"
          >
            <LogOut size={18} /> Logout
          </Button>
        </div>
      </motion.header>

      {/* Center Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6"
      >
        <h2 className="text-5xl md:text-6xl font-bold mb-3 text-[#3B3B3B] drop-shadow-sm">
          Welcome to StayNest 
        </h2>
        <p className="text-lg md:text-xl text-[#6b6b6b] mb-12 max-w-2xl">
          Find cozy homestays, charming cottages and warm stays for your next getaway
        </p>
      </motion.div>

      {/* Search Card */}
      <motion.div
        initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl border border-white/50 p-6 rounded-2xl w-[90%] md:w-[60%] shadow-lg z-20"
      >
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-6">

          <div className="w-full">
            <Label className="text-[#3B3B3B] mb-1">Location</Label>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where to?"
              className="w-full bg-white border-[#E8B4B8] rounded-xl"
            />
          </div>

          <div className="w-full">
            <Label className="text-[#3B3B3B] mb-1">Check-In</Label>
            <Input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-white border-[#E8B4B8] rounded-xl"
            />
          </div>

          <div className="w-full">
            <Label className="text-[#3B3B3B] mb-1">Check-Out</Label>
            <Input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-white border-[#B7CADB] rounded-xl"
            />
          </div>

          <div className="w-full">
            <Label className="text-[#3B3B3B] mb-1">Rooms</Label>
            <Input
              type="number"
              min="1"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              className="w-full bg-white border-[#B7CADB] rounded-xl"
            />
          </div>

        </form>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="flex justify-center mt-6">
          <Button
            onClick={handleSearch}
            className="bg-gradient-to-r from-[#E8B4B8] to-[#B7CADB] hover:opacity-90 text-[#3B3B3B] font-semibold rounded-full px-10 py-3 shadow-sm"
          >
            Search
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
