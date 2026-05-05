"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar/Navbar";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const handleOTPVerification = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/api/users/otp", {
        email: localStorage.getItem("email"),
        otp,
      });

      if (response.data.success) {
        toast.success("OTP verified successfully!");
        router.push("/login");
      } else {
        setError(response.data.message || "OTP verification failed.");
      }
    } catch (error) {
      setError("An error occurred during OTP verification.");
      console.error(error);
    }
  };
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-gray-900 shadow-md rounded-lg p-8 max-w-sm w-full">
          <h2 className="text-3xl font-semibold text-center text-white mb-8">
            OTP Verification
          </h2>

          <form onSubmit={handleOTPVerification}>
            <div className="mb-6">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-white"
              >
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-black focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your OTP"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default OTPVerification;
