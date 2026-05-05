"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Navbar from "../Navbar/Navbar";
import { toast } from "react-hot-toast";

const AdminProfile = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const response = await axios.get("/api/users/me");
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/users/logout", {}, { withCredentials: true });
      if (response.data.success) {
        router.push("/adminLogin");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (!user) return <h1>Loading.....</h1>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white p-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:space-x-12 space-y-6 lg:space-y-0">
          <div className="flex flex-col items-center lg:items-start">
            <div className="h-60 w-60 lg:h-80 lg:w-80 bg-gray-900 border border-red-900 rounded-md relative overflow-hidden mb-4 flex items-center justify-center text-gray-400">
              {user.profile ? (
                <Image
                  src={user.profile}
                  alt="Admin Profile"
                  className="rounded-sm object-cover"
                  width={320}
                  height={320}
                />
              ) : (
                <span>No Image</span>
              )}
            </div>

            <div className="flex justify-center items-center gap-[30px]">
              <div>
                <h1 className="text-2xl mt-2 lg:text-3xl font-semibold">
                  {user.userName}
                  {user.isSuperAdmin && (
                    <span className="ml-2 text-sm bg-yellow-600 text-white px-2 py-1 rounded">Super Admin</span>
                  )}
                  {!user.isSuperAdmin && (
                    <span className="ml-2 text-sm bg-gray-600 text-white px-2 py-1 rounded">Sub Admin</span>
                  )}
                </h1>
              </div>
              <button onClick={handleLogout} className="text-red-500 text-[30px]">
                <IoIosLogOut />
              </button>
            </div>

            <div className="mt-4">
              <h3 className="text-xl lg:text-2xl font-semibold mb-2">Skills:</h3>
              <ul className="flex flex-wrap lg:flex-col gap-2">
                {user.skills?.map((skill) => (
                  <li key={skill} className="text-lg lg:text-xl bg-white text-black py-2 px-3 rounded-md">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex-1">
            <div className="space-y-2 mb-6">
              <p className="text-blue-600 text-lg lg:text-xl">
                Phone: <span className="text-white">{user.phoneNumber || "N/A"}</span>
              </p>
              <p className="text-blue-600 text-lg lg:text-xl">
                Email: <span className="text-white">{user.email}</span>
              </p>
            </div>

            <div className="flex gap-4 flex-wrap items-center mb-6">
              {user.linkedIn && user.linkedIn !== "N/A" && (
                <a href={user.linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-3xl lg:text-4xl">
                  <FaLinkedin />
                </a>
              )}

              {user.isSuperAdmin && (
                <button
                  onClick={() => toast("Profile updates for Super Admin should be done through direct DB edit for now.", { icon: "ℹ️" })}
                  className="bg-green-300 text-black px-4 rounded-lg py-2 font-semibold"
                >
                  Update Details
                </button>
              )}
            </div>
            
            <div className="mt-8 bg-gray-900 border border-gray-800 p-6 rounded-lg">
              <h3 className="text-2xl font-semibold text-red-500 mb-4">Admin Privileges</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li>Manage Students, Teachers, and Alumni</li>
                <li>Delete Projects, Events, and Communities</li>
                <li>Impersonate Users for auditing</li>
                {user.isSuperAdmin && (
                  <>
                    <li className="text-yellow-500">Create and Manage Sub Admins</li>
                    <li className="text-yellow-500">Exclusive Super Admin Authority</li>
                  </>
                )}
                {!user.isSuperAdmin && (
                  <li className="text-red-400">Cannot edit own profile or view Super Admin</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProfile;
