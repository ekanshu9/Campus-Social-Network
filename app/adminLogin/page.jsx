"use client";

import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import Navbar from "@/components/Navbar/Navbar";

const AdminLoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();
  const token = Cookies.get("token");

  useEffect(() => {
    if (token) {
      router.push("/");
    }
  }, [token, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/admin/login", {
        email: user.email,
        password: user.password,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/admin"); // Redirect straight to the admin dashboard
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred while logging in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="bg-gray-900 text-white shadow-md rounded-lg p-8 max-w-sm w-full border border-red-900">
          <h2 className="text-3xl font-semibold text-center mb-8 text-red-500">
            Admin Login
          </h2>

          <form>
            <div className="mb-6">
              <label htmlFor="text" className="block text-sm font-medium ">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="admin@example.com"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium ">
                Password
              </label>
              <input
                type="password"
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="********"
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-red-600 hover:text-red-500"
                >
                  Forgot your password?
                </a>
              </div>
              <div className="flex justify-centermt-6 text-center">
                <Link href={"/login"}>
                  <p className="text-sm ">
                    Login As <span className="text-orange-500">Student</span>
                  </p>
                </Link>
              </div>
            </div>

            <button
              type="submit"
              onClick={handleLogin}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {loading ? "Please Wait..." : "Secure Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-red-500">
              Only authorized administrators may log in here.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;
