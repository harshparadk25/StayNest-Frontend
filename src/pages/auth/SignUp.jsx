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


import { Hotel, Tent, Plane, Mountain, Compass } from "lucide-react";

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
    toast.error("Please enter a valid email address");
    return;
  }

 
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    toast.error(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
    );
    return;
  }

    try {
      const res = await axiosInstance.post(
        "/auth/signup",
        { email, password, name },
        { withCredentials: true }
      );
      toast.success("Register Successful");
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
      console.log(err);
    }
  };

  const float = {
    animate: {
      y: [0, -12, 0],
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
  <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-indigo-900 to-gray-800">
    {/* Headline */}
    <motion.h1
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="text-white text-5xl font-extrabold drop-shadow-2xl z-10 mb-4 tracking-tight"
    >
      Start Your Journey ✨
    </motion.h1>
    <p className="text-white/80 text-lg mb-10 z-10 max-w-md text-center">
      Create your account and discover stays, adventures & hidden gems.
    </p>

    {/* Gradient Orbs */}
    <motion.div
      className="absolute -top-32 -left-32 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 6, repeat: Infinity }}
    />
    <motion.div
      className="absolute bottom-0 right-0 w-[28rem] h-[28rem] bg-purple-700/30 rounded-full blur-3xl"
      animate={{ scale: [1, 1.2, 1] }}
      transition={{ duration: 8, repeat: Infinity }}
    />

    {/* Adventure Icons */}
    <motion.div
      className="absolute top-28 left-20 text-pink-300/90"
      variants={float}
      animate="animate"
    >
      <Hotel size={42} />
    </motion.div>
    <motion.div
      className="absolute top-36 right-28 text-indigo-300/90"
      variants={rotate}
      animate="animate"
    >
      <Compass size={36} />
    </motion.div>
    <motion.div
      className="absolute bottom-44 left-16 text-purple-300/90"
      variants={float}
      animate="animate"
    >
      <Tent size={42} />
    </motion.div>
    <motion.div
      className="absolute bottom-20 right-28 text-pink-200/90"
      variants={float}
      animate="animate"
    >
      <Plane size={42} />
    </motion.div>
    <motion.div
      className="absolute bottom-24 left-1/2 text-indigo-200/90"
      variants={float}
      animate="animate"
    >
      <Mountain size={46} />
    </motion.div>

    {/* Shooting Stars */}
    <div className="absolute inset-0">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>

    {/* Signup Card */}
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="z-10 w-full max-w-md"
    >
      <Card className="backdrop-blur-2xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-semibold text-white">
            Create Your Adventure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name" className="text-white/90">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-white/20 border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-pink-400"
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-white/90">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/20 border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-pink-400"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-white/90">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/20 border-white/30 text-white placeholder-white/60 focus:ring-2 focus:ring-pink-400"
                placeholder="••••••••"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 text-white font-medium py-2 rounded-xl shadow-lg"
            >
              Sign Up
            </Button>
          </form>
          <p className="mt-5 text-center text-white/80">
            Already have an account?{" "}
            <Link to="/login" className="underline font-medium text-pink-300">
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
