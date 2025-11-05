import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../../config/axios.js";
import { toast } from "sonner";
import { AuthContext } from "../../context/authContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


import { Home, Heart, Coffee, CloudSun, KeyRound } from "lucide-react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must include uppercase, lowercase, number & special char"
      );
      return;
    }

    try {
      const res = await axiosInstance.post(
        "/auth/signup",
        { email, password, name },
        { withCredentials: true }
      );
      toast.success("Registered Successfully!");
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const float = {
    animate: {
      y: [0, -10, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };

  const rotate = {
    animate: {
      rotate: [0, 360],
      transition: { duration: 18, repeat: Infinity, ease: "linear" },
    },
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#FFF8F1] via-[#F4D9C6] to-[#FFEDEA]">
      
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-[#3B3B3B] text-4xl font-bold mb-3 z-10"
      >
        Create Your Cozy Stay 🌸
      </motion.h1>
      <p className="text-[#6b6b6b] text-lg mb-8 z-10 text-center">
        Join and explore homely stays & warm destinations
      </p>

      {/* Pastel floating icons */}
      <motion.div className="absolute top-24 left-16 text-[#E8B4B8]" variants={float} animate="animate">
        <Home size={44} />
      </motion.div>
      <motion.div className="absolute top-36 right-20 text-[#B7CADB]" variants={rotate} animate="animate">
        <CloudSun size={40} />
      </motion.div>
      <motion.div className="absolute bottom-36 left-20 text-[#E28C8A]" variants={float} animate="animate">
        <Heart size={42} />
      </motion.div>
      <motion.div className="absolute bottom-24 right-24 text-[#B7CADB]" variants={float} animate="animate">
        <Coffee size={42} />
      </motion.div>
      <motion.div className="absolute top-1/2 right-1/2 text-[#E8B4B8]" variants={float} animate="animate">
        <KeyRound size={44} />
      </motion.div>

      {/* pastel blobs */}
      <motion.div className="absolute -top-32 -left-20 w-96 h-96 bg-[#E8B4B8]/40 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 6, repeat: Infinity }} />
      <motion.div className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-[#B7CADB]/40 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} />

      {/* Star dots */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#E28C8A] rounded-full"
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="z-10 w-full max-w-md">
        <Card className="backdrop-blur-xl bg-white/80 border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-2xl p-2">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold text-[#3B3B3B]">
              Create Account
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <Label className="text-[#3B3B3B]">Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="bg-white border-[#E8B4B8] rounded-xl focus:ring-[#E28C8A]"
                  required
                />
              </div>

              <div>
                <Label className="text-[#3B3B3B]">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-white border-[#E8B4B8] rounded-xl focus:ring-[#B7CADB]"
                  required
                />
              </div>

              <div>
                <Label className="text-[#3B3B3B]">Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-white border-[#B7CADB] rounded-xl focus:ring-[#E8B4B8]"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[#E8B4B8] to-[#B7CADB] hover:opacity-90 py-2 font-medium shadow-sm"
              >
                Sign Up
              </Button>
            </form>

            <p className="mt-5 text-center text-[#6b6b6b]">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-[#E28C8A] underline">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignUp;
