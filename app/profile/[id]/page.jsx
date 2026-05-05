"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import Navbar from "@/components/Navbar/Navbar";

const ProfileSingle = ({ params }) => {
  const { id: userId } = React.use(params);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const router = useRouter();
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}`);
        setUser(response.data.user);
        setProjects(response.data.user.projects);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, router, token]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white p-4 md:px-8 lg:px-16">
        {loading ? (
          <div className="flex justify-center items-center space-x-2">
            <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : !user ? (
          <div className="flex justify-center items-center h-screen">
            <p className="text-xl font-semibold">User not found</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:space-x-12 space-y-6 lg:space-y-0">
            {/* Profile Section */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="h-60 w-60 lg:h-80 lg:w-80 bg-pink-50 rounded-md relative overflow-hidden mb-4">
                <Image
                  src={user.profile}
                  alt="Profile"
                  layout="fill"
                  className="object-cover"
                />
              </div>
              <h1 className="text-2xl lg:text-3xl font-semibold">
                {user.userName}
              </h1>
              <h2 className="text-lg lg:text-xl text-blue-500">
                Software Engineer
              </h2>
              <div className="mt-4">
                <h3 className="text-xl lg:text-2xl font-semibold mb-2">
                  Skills:
                </h3>
                <ul className="flex flex-wrap lg:flex-col gap-2">
                  {user.skills.map((skill) => (
                    <li
                      key={skill}
                      className="text-lg lg:text-xl bg-white text-black py-2 px-3 rounded-md"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1">
              <div className="space-y-2 mb-6">
                <p className="text-blue-600 text-lg lg:text-xl">
                  Batch: <span className="text-white">{user.batch}</span>
                </p>
                <p className="text-blue-600 text-lg lg:text-xl">
                  Section:{" "}
                  <span className="uppercase text-white">{user.section}</span>
                </p>
                <p className="text-blue-600 text-lg lg:text-xl">
                  Phone: <span className="text-white">{user.phoneNumber}</span>
                </p>
                <p className="text-blue-600 text-lg lg:text-xl">
                  Email: <span className="text-white">{user.email}</span>
                </p>
              </div>

              {/* Social Links */}
              <div className="flex gap-4 flex-wrap items-center mb-6">
                <a
                  href={user.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-3xl lg:text-4xl"
                >
                  <FaLinkedin />
                </a>
                <a
                  href={user.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 text-3xl lg:text-4xl"
                >
                  <SiLeetcode />
                </a>
                {user.portFolio && (
                  <a
                    href={user.portFolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 px-4 py-2 rounded text-white font-semibold text-lg"
                  >
                    Portfolio
                  </a>
                )}
                <p className="text-lg lg:text-xl">
                  Placed:{" "}
                  <span className="text-blue-500">
                    {user.placedCompanies?.join(", ") || "Not yet"}
                  </span>
                </p>
                {user.isAdmin && user.instaId && (
                  <a
                    href={user.instaId}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-500 px-4 py-2 rounded text-white font-semibold text-lg"
                  >
                    Instagram
                  </a>
                )}
                <button
                  onClick={() => router.push(`/chat?partnerId=${user._id}&partnerName=${user.userName}&partnerModel=User`)}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white font-semibold text-lg"
                >
                  💬 Message
                </button>
              </div>

              {/* Projects */}
              <div>
                <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
                  Projects
                </h2>
                {projects.length > 0 ? (
                  <div className="space-y-4">
                    {projects.map((project) => (
                      <div
                        key={project.id}
                        className="bg-gray-800 p-4 rounded-lg shadow-md"
                      >
                        <h3 className="text-xl lg:text-2xl font-bold text-blue-500">
                          {project.title}
                        </h3>
                        <p className="mb-2 text-sm lg:text-base">
                          {project.description}
                        </p>
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline font-semibold"
                        >
                          Live Preview
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-lg lg:text-xl">
                    {user.userName} hasn&apos;t added any projects yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileSingle;
