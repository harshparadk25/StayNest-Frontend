import React, { useState, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext.jsx";
import axios from "../../config/axios.js";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { toast } from "sonner";
import { Menu, X, User, Hotel } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hotels, setHotels] = useState([]);
  const { user } = useContext(AuthContext);

  const [hotelName, setHotelName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState([]);
  const [amenities, setAmenities] = useState([]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const fetchHotels = async () => {
    try {
      const res = await axios.get("/admin/hotels");
      setHotels(res.data.data);
      console.log(res.data);
      toast.success("Fetched all hotels");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch hotels");
    }
  };


  const handleAddHotel = async (e) => {
    e.preventDefault();
    const hotelData = {
      name: hotelName,
      city: city.toLowerCase(),
      photos: photo ? [photo] : [],
      amenities: amenities.map((item) => item.trim()),
      contactInfo: { address, phoneNumber, email, location: location.toLowerCase() },
      active: false,
    };

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return toast.error("You are not logged in!");

      const res = await axios.post("/admin/hotels", hotelData);
      console.log(res.data);
      toast.success("Hotel added successfully!");
      setIsSidebarOpen(false);
      setHotelName(""); setCity(""); setDescription(""); setAddress("");
      setPhoneNumber(""); setEmail(""); setLocation(""); setPhoto([]); setAmenities([]);
      fetchHotels();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add hotel");
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => { fetchHotels(); }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-20">
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
          <Hotel size={24} /> StayNest
        </div>
        <div className="flex items-center gap-4">
          <p className="hidden sm:block font-medium text-gray-700">
            Welcome, {user?.name || "Admin"}!
          </p>
          <Button variant="outline" onClick={toggleProfile} className="flex items-center gap-1">
            <User className="h-4 w-4" /> Profile
          </Button>
        </div>
      </header>

      {/* Profile Modal */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 w-96"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <h2 className="text-lg font-semibold mb-4">Admin Profile</h2>
              <p className="text-sm">ID: {user?.sub}</p>
              <p className="text-sm">Email: {user?.email}</p>
              <p className="text-sm">Role: {user?.roles?.[0]}</p>
              <div className="flex justify-end mt-4">
                <Button onClick={toggleProfile}>Close</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Hotel Button */}
      <div className="flex justify-center my-6">
        <Button onClick={toggleSidebar} size="lg" className="flex items-center gap-2">
          <Menu size={18} /> Add Hotel
        </Button>
      </div>

      {/* Hotel List */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <motion.div
            key={hotel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow"
          >
           <Link to={`/manager-dashboard/hotels/${hotel.id}`}>
             <img
               src={hotel.photos[0] || ""}
               alt={hotel.name}
               className="h-48 w-full object-cover"
             />
             <div className="p-4">
               <h3 className="font-bold text-lg text-indigo-600">{hotel.name}</h3>
               <p className="text-gray-600">{hotel.city}</p>
             </div>
           </Link>
          </motion.div>
        ))}
      </div>

      {/* Sidebar Form */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-white shadow-2xl p-6 z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Add New Hotel</h2>
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <X size={20} />
              </Button>
            </div>
            <form onSubmit={handleAddHotel} className="space-y-4">
              <div>
                <Label>Hotel Name</Label>
                <Input type="text" value={hotelName} onChange={(e) => setHotelName(e.target.value)} required />
              </div>
              <div>
                <Label>City</Label>
                <Input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
              </div>
              <div>
                <Label>Address</Label>
                <Input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label>Location</Label>
                <Input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
              <div>
                <Label>Photo URL</Label>
                <Input type="text" value={photo} onChange={(e) => setPhoto(e.target.value)} required />
              </div>
              <div>
                <Label>Amenities (comma separated)</Label>
                <Input type="text" value={amenities} onChange={(e) => setAmenities(e.target.value.split(","))} required />
              </div>
              <Button type="submit" className="w-full">Add Hotel</Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
