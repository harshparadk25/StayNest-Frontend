import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import axios from "../../config/axios.js";
import { toast } from "sonner";
import { AuthContext } from "../../context/authContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Label } from "../../components/ui/label.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { jwtDecode } from "jwt-decode";


import { Key, User, Coffee, Heart, Home } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      const res = await axios.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );

      localStorage.setItem("accessToken", res.data.data.accessToken);

      const token = res.data.data.accessToken;
      const user = jwtDecode(token);

      const rawRoles = user.roles;
      let role = "";

      if (typeof rawRoles === "string") {
        role = rawRoles.replace(/\[|\]/g, "").trim();
      } else if (Array.isArray(rawRoles)) {
        role = rawRoles[0];
      } else {
        role = rawRoles || "";
      }

      const userWithRole = { ...user, role };

      localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(userWithRole));

      setUser(userWithRole);
      toast.success("Login Successful");

      if (role === "HOTEL_MANAGER") {
        navigate("/manager-dashboard");
      } else {
        navigate("/home");
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#FFF8F1] to-[#F4D9C6]">
      
      {/* Floating Pastel Icons */}
      <motion.div className="absolute top-28 left-16 text-[#E28C8A]/80" variants={float} animate="animate">
        <Heart size={42} />
      </motion.div>
      <motion.div className="absolute top-36 right-20 text-[#B7CADB]/90" variants={rotate} animate="animate">
        <Home size={38} />
      </motion.div>
      <motion.div className="absolute bottom-40 left-12 text-[#E8B4B8]" variants={float} animate="animate">
        <Coffee size={42} />
      </motion.div>
      <motion.div className="absolute bottom-16 right-24 text-[#B7CADB]" variants={float} animate="animate">
        <Key size={44} />
      </motion.div>
      <motion.div className="absolute bottom-24 left-1/2 text-[#E28C8A]" variants={float} animate="animate">
        <User size={46} />
      </motion.div>

      {/* Soft bubble background blobs */}
      <motion.div className="absolute -top-32 -left-20 w-72 h-72 bg-[#E8B4B8]/40 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 6, repeat: Infinity }} />
      <motion.div className="absolute bottom-0 right-0 w-96 h-96 bg-[#B7CADB]/40 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} />

      {/* Heading */}
      <motion.h1
        initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}
        className="text-[#3B3B3B] text-4xl font-bold mb-4 z-10"
      >
        Welcome Back 🤍
      </motion.h1>
      <p className="text-[#5a5a5a] text-lg mb-6 z-10">Log in to your cozy stay</p>

      {/* Login Card */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
        className="z-10 w-full max-w-md">
        
        <Card className="backdrop-blur-xl bg-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-white/40 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold text-[#3B3B3B]">
              Login
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <Label htmlFor="email" className="text-[#3B3B3B]">Email</Label>
                <div className="flex items-center gap-2">
                  <User className="text-[#E28C8A]" />
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    required className="bg-white border-[#E8B4B8] rounded-xl focus:ring-[#E28C8A]" />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-[#3B3B3B]">Password</Label>
                <div className="flex items-center gap-2">
                  <Key className="text-[#B7CADB]" />
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    required className="bg-white border-[#B7CADB] rounded-xl focus:ring-[#E8B4B8]" />
                </div>
              </div>

              <Button type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[#E8B4B8] to-[#B7CADB] hover:opacity-90 shadow-md py-2">
                Login
              </Button>

            </form>

            <p className="mt-4 text-center text-[#5a5a5a]">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-[#E28C8A] underline">
                Sign Up
              </Link>
            </p>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
