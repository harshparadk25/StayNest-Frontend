import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "../../config/axios";
import { motion } from "framer-motion";
import { Sparkles, LogOut, User } from "lucide-react";

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
      console.log("Search Response:", res.data);

      navigate("/search-results", {
        state: { hotels: res.data.content || [], searchParams: body },
      });
    } catch (error) {
      toast.error("Error searching for stays. Please try again.");
      console.error("Search Error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    toast.success("Logged out successfully.");
    navigate("/login");
  };

  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-black to-gray-900"
    >
      
      <div className="absolute inset-0 z-0">
        <div className="absolute w-[600px] h-[600px] bg-indigo-500/30 rounded-full blur-3xl top-1/4 left-[-200px] animate-pulse"></div>
        <div className="absolute w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl bottom-1/3 right-[-150px] animate-pulse"></div>
      </div>

     
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-0 left-0 w-full flex justify-between items-center px-8 py-4 bg-white/10 backdrop-blur-xl border-b border-white/10 text-white z-20"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="text-indigo-400 w-6 h-6" />
          <h1 className="text-3xl font-semibold tracking-wide bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
            StayNest
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/user-profile">
            <Button className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-800 font-medium rounded-full px-5 py-2 backdrop-blur-md transition-all duration-300">
              <User size={18} /> Profile
            </Button>
          </Link>

          <Button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-800 font-medium rounded-full px-5 py-2 backdrop-blur-md transition-all duration-300"
          >
            <LogOut size={18} /> Logout
          </Button>
        </div>
      </motion.header>

      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 text-white"
      >
        <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
          Welcome to StayNest
        </h2>
        <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl">
          Discover futuristic stays and next-gen comfort — wherever your journey takes you.
        </p>
      </motion.div>

     
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-2xl border border-white/20 p-6 rounded-3xl w-[90%] md:w-[55%] shadow-[0_0_40px_rgba(99,102,241,0.3)] z-20"
      >
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full">
            <Label className="text-gray-600 mb-1">Location</Label>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search your dream stay..."
              className="w-full p-3 bg-transparent text-black placeholder-gray-700 focus:outline-none border-b border-white/30 focus:border-indigo-400 transition-all"
            />
          </div>

          <div className="w-full">
            <Label className="text-gray-600 mb-1">Check-In</Label>
            <Input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              placeholder="Check-In Date"
              className="w-full p-3 bg-transparent text-black border-b border-white/30 focus:border-indigo-400 focus:outline-none transition-all"
            />
          </div>

          <div className="w-full">
            <Label className="text-gray-600 mb-1">Check-Out</Label>
            <Input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              placeholder="Select check-out date"
              className="w-full p-3 bg-transparent text-black border-b border-white/30 focus:border-indigo-400 focus:outline-none transition-all"
            />
          </div>

          <div className="w-full">
            <Label className="text-gray-600 mb-1">Rooms</Label>
            <Input
              type="number"
              min="1"
              value={rooms}
              placeholder="Number of rooms"
              onChange={(e) => setRooms(e.target.value)}
              className="w-full p-3 bg-transparent text-black border-b border-white/30 focus:border-indigo-400 focus:outline-none transition-all"
            />
          </div>
        </form>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="flex justify-center mt-6"
        >
          <Button
            type="submit"
            onClick={handleSearch}
            className="w-full md:w-auto bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-pink-400 text-white font-semibold rounded-full px-10 py-3 shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all"
          >
            Search
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
