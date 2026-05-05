"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar/Navbar";

const SignupPage = () => {
  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: "",
    batch: "",
    section: "",
    skills: "",
    phoneNumber: "",
    linkedIn: "",
    portFolio: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post("/api/users/signUp", {
        ...user,
        skills: user.skills.split(",").map((skill) => skill.trim()),
      });

      if (response.data.success) {
        localStorage.setItem("email", response.data.newUser.email);
        router.push("/otp_verification");
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
    <>
      <Navbar />
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
            <div>
              <select
                value={user.batch}
                onChange={(e) => setUser({ ...user, batch: e.target.value })}
                className="w-full px-4 py-2 rounded-md shadow-sm text-black"
                required
              >
                <option value="" disabled>
                  Choose your batch
                </option>
                <option value="2023-2025">2023-2025</option>
                <option value="2024-2026">2024-2026</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                placeholder="Section"
                value={user.section}
                onChange={(e) => setUser({ ...user, section: e.target.value })}
                className="w-full px-4 py-2 rounded-md shadow-sm text-black"
                required
              />
            </div>
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Skills (comma separated)"
                value={user.skills}
                onChange={(e) => setUser({ ...user, skills: e.target.value })}
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

            <div>
              <input
                type="text"
                placeholder="LinkedIn Profile"
                value={user.linkedIn}
                onChange={(e) => setUser({ ...user, linkedIn: e.target.value })}
                className="w-full px-4 py-2 rounded-md shadow-sm text-black"
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Portfolio URL"
                value={user.portFolio}
                onChange={(e) =>
                  setUser({ ...user, portFolio: e.target.value })
                }
                className="w-full px-4 py-2 rounded-md shadow-sm text-black"
                required
              />
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
          <div className="mt-4 text-center space-y-2">
            <p className="text-sm text-white">
              Already have an account?{" "}
              <Link href="/login" className="text-orange-500">
                Sign In
              </Link>
            </p>
            <p className="text-sm text-white">
              Are you a Teacher?{" "}
              <Link href="/teacherSignUp" className="text-blue-500">
                Sign Up as Teacher
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignupPage;
