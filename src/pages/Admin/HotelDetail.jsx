import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../config/axios";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Link } from "react-router-dom";


const HotelDetail = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [reports, setReports] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [activeSection, setActiveSection] = useState("report");

  const [hotel, setHotel] = useState(null);
  const [hotelName, setHotelName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState([]);
  const [amenities, setAmenities] = useState([]);

  const [roomType, setRoomType] = useState("");
  const [price, setPrice] = useState("");
  const [maxOccupancy, setMaxOccupancy] = useState("");
  const [roomPhoto, setRoomPhoto] = useState("");
  const [roomAmenities, setRoomAmenities] = useState([]);
  const [roomCount, setRoomCount] = useState("");
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  const [rooms, setRooms] = useState([]);

  const fetchReports = async () => {
    try {
      const res = await axios.get(`/admin/hotels/${hotelId}/reports`);
      setReports(res.data);
      console.log(res.data);
      toast.success("Fetched reports");
    } catch (error) {
      toast.error("Failed to fetch reports");
      console.error(error);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`/admin/hotels/${hotelId}/bookings`);
      setBookings(res.data);
      console.log(res.data);
      toast.success("Fetched bookings");
    } catch (error) {
      toast.error("Failed to fetch bookings");
      console.error(error);
    }
  };

  const toggleSidebar = () => {
    if (!isSidebarOpen && hotel) {
      setHotelName(hotel.name || "");
      setCity(hotel.city || "");
      setAddress(hotel.contactInfo?.address || "");

      setPhoneNumber(hotel.contactInfo?.phoneNumber || "");
      setEmail(hotel.contactInfo?.email || "");
      setLocation(hotel.contactInfo?.location || "");
      setPhoto(hotel.photos?.[0] || "");
      setAmenities(hotel.amenities || []);
    }
    setIsSidebarOpen(!isSidebarOpen);
  };


  const fetchHotel = async () => {
    try {
      const res = await axios.get(`/admin/hotels/${hotelId}`);
      setHotel(res.data.data);
      console.log(res.data);
      toast.success("Fetched hotel details");
    } catch (err) {
      toast.error("Failed to fetch hotel details");
    }
  };

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`/admin/hotels/${hotelId}/rooms`);
      setRooms(res.data.data);
      console.log(res.data);
      toast.success("Fetched room details");
    } catch (err) {
      toast.error("Failed to fetch room details");
    }
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    const hotelData = {
      name: hotelName,
      city: city.toLowerCase(),
      photos: photo ? [photo] : [],
      amenities: amenities.map((item) => item.trim()),
      contactInfo: { address, phoneNumber, email, location: location.toLowerCase() },
      active: true,
    };
    try {
      await axios.put(`/admin/hotels/${hotelId}`, hotelData);
      toast.success("Hotel updated successfully");
      fetchHotel();
      toggleSidebar();
      setHotelName(""); setCity(""); setAddress("");
      setPhoneNumber(""); setEmail(""); setLocation(""); setPhoto([]); setAmenities([]);
    } catch (error) {
      toast.error("Failed to update hotel");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/admin/hotels/${hotelId}`);
      toast.success("Hotel deleted successfully");
      navigate("/manager-dashboard");
    } catch (err) {
       console.error(err.response?.data || err.message);
  toast.error("Cannot delete this hotel. Check backend logs for details.");
    }
  };

  const toggleActive = async () => {
    try {
      await axios.patch(`/admin/hotels/${hotelId}/activate`);

      setHotel((prev) => {
        const newStatus = !prev.active;
        toast.success(
          `Hotel ${newStatus ? "activated" : "deactivated"} successfully`
        );
        return { ...prev, active: newStatus };
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    const RoomData = {
      type: roomType,
      basePrice: parseFloat(price),
      capacity: parseInt(maxOccupancy),
      photos: roomPhoto ? [roomPhoto] : [],
      amenities: roomAmenities.map((item) => item.trim()),
      totalCount: parseInt(roomCount),
    };
    try {
      const res = await axios.post(`/admin/hotels/${hotelId}/rooms`, RoomData);
      console.log(res.data);
      toast.success("Room created successfully");
      setRooms((prevRooms) => [...prevRooms, res.data]);
      fetchRooms();
    } catch (error) {
      toast.error("Failed to create room");
      console.error(error);
    }
  };


  const toggleRoomDialog = () => setRoomDialogOpen(!roomDialogOpen);



  useEffect(() => { fetchHotel(); fetchRooms(); fetchReports(); fetchBookings(); }, [hotelId]);

  if (!hotel) return <p className="p-6">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <img src={hotel.photos[0]} alt={hotel.name} className="w-full h-64 object-cover rounded-xl" />
      <h1 className="text-2xl font-bold mt-4">{hotel.name}</h1>
      <p className="text-gray-600">{hotel.city}</p>

      <div className="mt-4">
        <p><b>Address:</b> {hotel.contactInfo?.address}</p>
        <p><b>Email:</b> {hotel.contactInfo?.email}</p>
        <p><b>Phone:</b> {hotel.contactInfo?.phoneNumber}</p>
        <p><b>Location:</b> {hotel.contactInfo?.location}</p>
        <p><b>Amenities:</b> {hotel.amenities.join(", ")}</p>
        <p><b>Status:</b> {hotel.active ? "Active" : "Inactive"}</p>
      </div>

      <div className="flex gap-4 mt-6">
        <Button onClick={toggleActive}>
          {hotel.active ? "Deactivate" : "Activate"}
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Delete Hotel
        </Button>
        <Button onClick={toggleSidebar}>Edit Hotel</Button>
      </div>

      <div className="bg-black w-full h-1 mt-2">
        {rooms && <h2 className="text-2xl font-bold mt-4">Rooms</h2>}
      </div>

      <div className="room">
        <Button onClick={toggleRoomDialog}>Create Room</Button>
      </div>

      {/* Listing rooms */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {rooms.map((room) => (
          <div key={room.id} className="border rounded-lg p-4 shadow-sm">
            <Link
              to={`/manager-dashboard/hotels/${hotelId}/rooms/${room.id}`}
              className="text-blue-600 hover:underline"
            >


              <img
                src={room?.photos?.[0] || "https://via.placeholder.com/400x200?text=No+Room+Image"}
                alt={room?.type || "Room"}
                className="w-full h-40 object-cover rounded-md mb-2"
              />
              <h3 className="text-lg font-semibold">{room?.type}</h3>
            </Link>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mt-6">
        <Button onClick={() => setActiveSection("report")}>View Report</Button>
        <Button onClick={() => setActiveSection("booking")}>View Bookings</Button>
      </div>

      <div className="mt-8">
        {activeSection === "report" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Hotel Report</h2>
            {reports ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-100 rounded-lg shadow">
                  <p className="text-gray-500">Total Bookings</p>
                  <p className="text-xl font-semibold">{reports.bookingCount}</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg shadow">
                  <p className="text-gray-500">Total Revenue</p>
                  <p className="text-xl font-semibold">${reports.totalRevenue}</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg shadow">
                  <p className="text-gray-500">Average Revenue per Booking</p>
                  <p className="text-xl font-semibold">${reports.avgRevenue}</p>
                </div>
              </div>
            ) : (
              <p>Loading report...</p>
            )}
          </div>
        )}

        {activeSection === "booking" && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Hotel Bookings</h2>
            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 shadow">
                    <p><b>Booking ID:</b> {booking.id}</p>
                    <p><b>Status:</b> {booking.bookingStatus}</p>
                    <p><b>Rooms Booked:</b> {booking.roomsCount}</p>
                    <p><b>Check-in:</b> {new Date(booking.checkInDate).toLocaleDateString()}</p>
                    <p><b>Check-out:</b> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                    <p><b>Amount:</b> ${booking.amount}</p>
                    <div className="mt-2">
                      <p><b>Guests:</b></p>
                      <ul className="list-disc list-inside">
                        {booking.guests.map((guest) => (
                          <li key={guest.id}>
                            {guest.name} ({guest.gender}, {new Date(guest.dateOfBirth).toLocaleDateString()})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No bookings found</p>
            )}
          </div>
        )}
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
              <h2 className="text-xl font-semibold">Update Hotel</h2>
              <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                <X size={20} />
              </Button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
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
                <Input type="text" value={amenities.join(", ")} onChange={(e) => setAmenities(e.target.value.split(","))} required />
              </div>
              <Button type="submit" className="w-full" >Update Hotel</Button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialog for Creating Room */}
      <AnimatePresence>
        {roomDialogOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white p-6 rounded-lg w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-semibold mb-4">Create New Room</h2>
              <Button variant="ghost" size="icon" onClick={toggleRoomDialog} className="">
                <X size={20} />
              </Button>
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div>
                  <Label>Room Type</Label>
                  <Input type="text" value={roomType} onChange={(e) => setRoomType(e.target.value)} required />
                </div>
                <div>
                  <Label>Price</Label>
                  <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>
                <div>
                  <Label>Max Occupancy</Label>
                  <Input type="number" value={maxOccupancy} onChange={(e) => setMaxOccupancy(e.target.value)} required />
                </div>
                <div>
                  <Label>Photo URL</Label>
                  <Input type="text" value={roomPhoto} onChange={(e) => setRoomPhoto(e.target.value)} required />
                </div>
                <div>
                  <Label>Amenities (comma separated)</Label>
                  <Input type="text" value={roomAmenities.join(", ")} onChange={(e) => setRoomAmenities(e.target.value.split(","))} required />
                </div>
                <div>
                  <Label>Room Count</Label>
                  <Input type="number" value={roomCount} onChange={(e) => setRoomCount(e.target.value)} required />
                </div>
                <Button type="submit" onClick={toggleRoomDialog} className="w-full">Create Room</Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default HotelDetail;
