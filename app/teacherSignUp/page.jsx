"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: "",
    phoneNumber: "",
    designation: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post("/api/teachers/signUp", {
        name: user.userName, // Mapping userName to name
        email: user.email,
        password: user.password,
        phoneNumber: user.phoneNumber,
        designation: user.designation,
      });

      if (response.data.success) {
        toast.success("Signup successful! Redirecting...");
        router.push("/");
      } else {
        toast.error(
          response.data.message || "Signup failed. Please try again."
        );
      }
    } catch (error) {
      setError("An error occurred during signup.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      <div className="bg-gray-800 shadow-md rounded-lg p-6 max-w-lg w-full">
        <h2 className="text-3xl font-semibold text-center text-white mb-6">
          Sign Up
        </h2>
        <form onSubmit={handleSignUp} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <input
              type="text"
              placeholder="Full Name"
              value={user.userName}
              onChange={(e) => setUser({ ...user, userName: e.target.value })}
              className="w-full px-4 py-2 rounded-md shadow-sm text-black"
              required
            />
          </div>
          <div className="col-span-2">
            <input
              type="email"
              placeholder="Email Address"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              className="w-full px-4 py-2 rounded-md shadow-sm text-black"
              required
            />
          </div>
          <div className="col-span-2">
            <input
              type="password"
              placeholder="Password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              className="w-full px-4 py-2 rounded-md shadow-sm text-black"
              required
            />
          </div>
          <div className="col-span-2">
            <input
              type="text"
              placeholder="Phone Number"
              value={user.phoneNumber}
              onChange={(e) =>
                setUser({ ...user, phoneNumber: e.target.value })
              }
              className="w-full px-4 py-2 rounded-md shadow-sm text-black"
              required
            />
          </div>
          <div className="col-span-2">
            <select
              value={user.designation}
              onChange={(e) =>
                setUser({ ...user, designation: e.target.value })
              }
              className="w-full px-4 py-2 rounded-md shadow-sm text-black"
              required
            >
              <option value="" disabled>
                Choose your designation
              </option>
              <option value="Professor">Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Teaching Assistant">Teaching Assistant</option>
              <option value="Assistant Manager">Assistant Manager</option>

              <option value="Officer Academic Support">
                Officer Academic Support
              </option>
            </select>
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700"
            >
              {loading ? "Please Wait..." : "Sign Up"}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-white">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-500">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
