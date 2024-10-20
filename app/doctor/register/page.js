"use client";

import { useState } from "react";
import { Button, TextField, Typography, AppBar, Toolbar } from "@mui/material";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore"; 
import { auth, db } from "../../../firebase";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DoctorRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    clinicAddress: "",
    phone: "",
    email: "",
    specialization: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      await setDoc(doc(db, "doctors", user.uid), {
        name: formData.name,
        clinicAddress: formData.clinicAddress,
        phone: formData.phone,
        specialization: formData.specialization,
        role: "doctor",
      });

      toast.success("Doctor registered successfully!");
      router.push("/doctor/login");

    } catch (error) {
      console.error("Error registering doctor:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col h-auto bg-gray-100">
      {/* Toast Container */}
      <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={true} closeOnClick pauseOnHover draggable />

      {/* AppBar */}
      <AppBar position="static" sx={{ backgroundColor: "black", color: "#d81b60" }}>
        <Toolbar className="flex justify-between">
          <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} className="cursor-pointer">
            MedBot
          </Typography>
          <Link href="/doctor/login" passHref>
            <Button sx={{ color: "white", backgroundColor: "#d81b60" }}>Login</Button>
          </Link>
        </Toolbar>
      </AppBar>

      {/* Registration Form */}
      <div className="flex justify-center items-center flex-grow mt-5 mb-5">
        <form
          className="bg-white shadow-lg p-8 rounded-lg space-y-4 w-full max-w-lg"
          onSubmit={handleSubmit}
        >
          <Typography variant="h4" className="mb-4 text-pink-600 font-bold" align="center">
            Doctor Registration
          </Typography>

          <TextField
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Clinic Address"
            name="clinicAddress"
            value={formData.clinicAddress}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ backgroundColor: "#d81b60", color: "white", mt: 2 }}
          >
            Create account
          </Button>

          <Typography className="mt-4 text-center">
            Already have an account?{" "}
            <Link href="/doctor/login" passHref>
              <span style={{ color: "#d81b60", fontWeight: "bold", cursor: "pointer" }}>
                Login
              </span>
            </Link>
          </Typography>

        </form>
      </div>
    </div>
  );
}
