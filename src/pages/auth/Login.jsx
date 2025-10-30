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


import { Key, User, Moon, Star, Coffee } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();


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

      console.log(res.data);
      localStorage.setItem("accessToken", res.data.data.accessToken);

      const token = res.data.data.accessToken;

      const user = jwtDecode(token);
      console.log(user);


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
      console.log(err);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-purple-800 via-indigo-900 to-black">
      {/* Headline */}
      <motion.h1
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-white text-4xl font-bold drop-shadow-lg z-10 mb-4"
      >
        Welcome Back Adventurer
      </motion.h1>
      <p className="text-white/80 text-lg mb-8 z-10 text-center">
        Login to explore cozy lodges, night stays, and adventure spots
      </p>

      {/* Gradient Blobs */}
      <motion.div
        className="absolute -top-24 -left-20 w-72 h-72 bg-indigo-500/40 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/40 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Floating Adventure Icons */}
      <motion.div
        className="absolute top-24 left-16 text-white/80"
        variants={float}
        animate="animate"
      >
        <Moon size={42} />
      </motion.div>
      <motion.div
        className="absolute top-32 right-20 text-white/80"
        variants={rotate}
        animate="animate"
      >
        <Star size={36} />
      </motion.div>
      <motion.div
        className="absolute bottom-40 left-12 text-white/80"
        variants={float}
        animate="animate"
      >
        <Coffee size={42} />
      </motion.div>
      <motion.div
        className="absolute bottom-16 right-24 text-white/80"
        variants={float}
        animate="animate"
      >
        <Key size={42} />
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-1/2 text-white/80"
        variants={float}
        animate="animate"
      >
        <User size={46} />
      </motion.div>

      {/* Stars */}
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

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="z-10 w-full max-w-md"
      >
        <Card className="backdrop-blur-xl bg-white/20 shadow-2xl border-0 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-white">
              Login to Your Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <div className="flex items-center gap-2">
                  <User className="text-white/80" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-white/70"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="flex items-center gap-2">
                  <Key className="text-white/80" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white/70"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                Login
              </Button>
            </form>
            <p className="mt-4 text-center text-white">
              Don't have an account?{" "}
              <Link to="/signup" className="underline font-medium">
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
