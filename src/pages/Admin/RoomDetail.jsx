import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const RoomDetail = () => {
  const { hotelId, roomId } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  
  const [roomType, setRoomType] = useState("");
  const [price, setPrice] = useState("");
  const [maxOccupancy, setMaxOccupancy] = useState("");
  const [roomPhoto, setRoomPhoto] = useState("");
  const [roomAmenities, setRoomAmenities] = useState([]);
  const [roomCount, setRoomCount] = useState("");

  const [inventory, setInventory] = useState([]);
  const [invStartDate, setInvStartDate] = useState("");
  const [invEndDate, setInvEndDate] = useState("");
  const [invSurge, setInvSurge] = useState(0);
  const [invClosed, setInvClosed] = useState(false);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/admin/hotels/${hotelId}/rooms/${roomId}`
      );
      const roomData = res.data.data;
      console.log(roomData);

      setRoom(roomData);
      setRoomType(roomData.type || "");
      setPrice(roomData.basePrice || "");
      setMaxOccupancy(roomData.capacity || "");
      setRoomPhoto(roomData.photos?.[0] || "");
      setRoomAmenities(roomData.amenities || []);
      setRoomCount(roomData.totalCount || "");

      setLoading(false);
      toast.success("Room details loaded");
    } catch (err) {
      setLoading(false);
      toast.error("Failed to load room");
      console.error(err);
    }
  };


  const updateRoom = async () => {
    const updatedData = {
      type: roomType,
      basePrice: parseFloat(price) || 0,
      capacity: parseInt(maxOccupancy) || 0,
      photos: roomPhoto ? [roomPhoto] : [],
      amenities: roomAmenities.map((a) => a.trim()),
      totalCount: parseInt(roomCount) || 0,
    };
    try {
      const res = await axiosInstance.put(
        `/admin/hotels/${hotelId}/rooms/${roomId}`,
        updatedData
      );
      setRoom(res.data);
      setEditMode(false);
      fetchRoom();
      console.log(res.data);
      toast.success("Room updated successfully");
    } catch (err) {
      toast.error("Failed to update room");
      console.error(err);
    }
  };

  const deleteRoom = async () => {
    try {
      await axiosInstance.delete(`/admin/hotels/${hotelId}/rooms/${roomId}`);
      toast.success("Room deleted");
      navigate(`/manager-dashboard/hotels/${hotelId}`);
    } catch (err) {
      toast.error("Failed to delete room");
      console.error(err);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await axiosInstance.get(`/admin/inventory/rooms/${roomId}`);
      setInventory(res.data.data || []);
        console.log(res.data);
        console.log("Sample inventory item:", res.data.data?.[0]);

        toast.success("Inventory loaded");
    } catch (err) {
      toast.error("Failed to fetch inventory");
      console.error(err);
    }
  };

  const updateInventory = async () => {
  try {
    const inventoryData = {
      startDate: invStartDate,
      endDate: invEndDate,
      surgeFactor: parseFloat(invSurge) || 1,
      closed: invClosed,
    };

    const res = await axiosInstance.patch(`/admin/inventory/rooms/${roomId}`, inventoryData);

    
    if (res.status === 204) {
      toast.success("Inventory updated successfully");
      console.log(res);
      fetchInventory();
    } else {
  
      toast.error("Unexpected response while updating inventory");
      console.warn(res);
    }

  } catch (err) {
    toast.error("Failed to update inventory");
    console.error(err);
  }
};

  useEffect(() => {
    fetchRoom();
    fetchInventory();
  }, [roomId]);

  if (loading)
    return <p className="text-center text-gray-500">Loading room...</p>;
  if (!room)
    return <p className="text-center text-red-500">Room not found.</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto p-4 space-y-6"
    >
    
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{room.type} Room</CardTitle>
          <p className="text-gray-500">Room ID: {roomId}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!editMode ? (
            <>
              {room.photos?.[0] && (
                <img
                  src={room.photos[0]}
                  alt={room.type}
                  className="w-full h-56 object-cover rounded-xl"
                />
              )}
              <p>
                <strong>Price:</strong> ₹{room.basePrice}
              </p>
              <p>
                <strong>Capacity:</strong> {room.capacity} guests
              </p>
              <p>
                <strong>Total Count:</strong> {room.totalCount}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {(room.amenities || []).map((a, i) => (
                  <Badge key={i} variant="secondary">
                    {a}
                  </Badge>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <Input
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                placeholder="Room Type"
              />
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Base Price"
              />
              <Input
                type="number"
                value={maxOccupancy}
                onChange={(e) => setMaxOccupancy(e.target.value)}
                placeholder="Capacity"
              />
              <Input
                type="number"
                value={roomCount}
                onChange={(e) => setRoomCount(e.target.value)}
                placeholder="Total Count"
              />
              <Input
                value={roomPhoto}
                onChange={(e) => setRoomPhoto(e.target.value)}
                placeholder="Room Photo URL"
              />
              <Textarea
                value={roomAmenities.join(", ")}
                onChange={(e) =>
                  setRoomAmenities(e.target.value.split(",").map((a) => a.trim()))
                }
                placeholder="Amenities (comma separated)"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {!editMode ? (
            <>
              <Button variant="default" onClick={() => setEditMode(true)}>
                Edit
              </Button>
              <Button variant="destructive" onClick={deleteRoom}>
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button onClick={updateRoom}>Save</Button>
              <Button variant="secondary" onClick={() => setEditMode(false)}>
                Cancel
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      {/* Inventory Management */}
      <Card className="shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle>Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-left border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">Date</th>
                  <th className="border px-2 py-1">Booked</th>
                  <th className="border px-2 py-1">Reserved</th>
                  <th className="border px-2 py-1">Total</th>
                  <th className="border px-2 py-1">Price</th>
                  <th className="border px-2 py-1">Closed</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((inv) => (
                  <tr key={inv.id}>
                    <td className="border px-2 py-1">{inv.date}</td>
                    <td className="border px-2 py-1">{inv.bookedCount}</td>
                    <td className="border px-2 py-1">{inv.reservedCount}</td>
                    <td className="border px-2 py-1">{inv.totalCount}</td>
                    <td className="border px-2 py-1">{inv.price}</td>
                    <td className="border px-2 py-1">{inv.closed ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Inventory Update Form */}
          <div className="space-y-2">
            <Input
              type="date"
              value={invStartDate}
              onChange={(e) => setInvStartDate(e.target.value)}
              placeholder="Start Date"
            />
            <Input
              type="date"
              value={invEndDate}
              onChange={(e) => setInvEndDate(e.target.value)}
              placeholder="End Date"
            />
            <Input
              type="number"
              step="0.1"
              value={invSurge}
              onChange={(e) => setInvSurge(e.target.value)}
              placeholder="Surge Factor"
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={invClosed}
                onChange={(e) => setInvClosed(e.target.checked)}
              />
              <label>Closed</label>
            </div>
            <Button onClick={updateInventory}>Update Inventory</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RoomDetail;
