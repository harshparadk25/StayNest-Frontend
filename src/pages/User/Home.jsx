import React from "react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "../../config/axios";


const Home = () => {

  const [location, setLocation] = useState("dewas");
const [checkIn, setCheckIn] = useState("2025-10-10");
const [checkOut, setCheckOut] = useState("2025-10-12");
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

    navigate("/search-results", { state: { hotels: res.data.content || [], searchParams: body } });
  } catch (error) {
    toast.error("Error searching for stays. Please try again.");
    console.error("Search Error:", error);
  }
};



  return (
    <div
      className="relative h-screen w-full bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')",
      }}
    >
      {/* Frosted Overlay for Depth */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* Glassy Header */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center px-8 py-4 bg-white/10 backdrop-blur-md border-b border-white/20 text-white z-20">
        <h1 className="text-3xl font-semibold tracking-wide">StayNest</h1>
        <Link to="/user-profile">
          <Button className="bg-white/20 hover:bg-white/30 border border-white/30 text-white font-medium rounded-full px-6 py-2 backdrop-blur-md transition-all duration-300">
            View Profile
          </Button>
        </Link>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
          Welcome to StayNest! <br /> Find the Perfect Place to Stay
        </h2>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
          Discover cozy stays, luxury retreats, and unique homes — all in one place.
        </p>

        
      </div>

      {/* Glassy Search Bar */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 p-4 rounded-2xl w-[90%] md:w-[50%] shadow-lg z-20">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-4">
          <div>
            <Label className="text-white mb-1">Location</Label>
            <Input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search your dream stay..."
              className="w-full p-3 bg-transparent text-white placeholder-white focus:outline-none text-lg"
            />
          </div>
          <div>
            <Label className="text-white mb-1" >Check-In</Label>
            <Input
              type="date"
              id="checkin"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full p-3 bg-transparent text-white focus:outline-none text-lg"
            />  
          </div>
          <div>
            <Label className="text-white mb-1" >Check-Out</Label>
            <Input
              type="date" 
              id="checkout"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full p-3 bg-transparent text-white focus:outline-none text-lg"
            />
          </div>
          <div>
            <Label className="text-white mb-1" >Rooms</Label>
            <Input
              type="number"
              id="rooms"
              min="1"
              placeholder="1"
              value={rooms}
              onChange={(e) => setRooms(e.target.value)}
              className="w-full p-3 bg-transparent text-white placeholder-white focus:outline-none text-lg"
            />
          </div>
        </form>
        <Button type="submit" onClick={handleSearch} className="mt-4 w-full md:w-auto bg-white/30 hover:bg-white/40 border border-white/30 text-white font-medium rounded-full px-6 py-3 backdrop-blur-md transition-all duration-300">
          Search
        </Button>
      </div>
    </div>
  );
};

export default Home;
