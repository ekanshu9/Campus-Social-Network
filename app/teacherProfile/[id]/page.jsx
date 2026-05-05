"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaLinkedin } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar/Navbar";

const Page = ({ params }) => {
  const { id: userId } = React.use(params);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/teachers/${userId}`);
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex justify-center items-center">
          <div className="w-10 h-10 border-t-3 border-emerald-500 border-solid rounded-full animate-spin"></div>
          <p className="text-gray-500 ml-3">Loading profile...</p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex justify-center items-center">
          <p className="text-xl">Teacher not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-5xl mx-auto px-6 pt-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Profile Card */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-gray-900 shadow-2xl bg-gray-800">
                {user.profile ? (
                  <Image
                    src={user.profile}
                    alt={user.name}
                    width={160}
                    height={160}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-6xl font-bold shadow-inner">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <h1 className="text-3xl font-bold mt-5">{user.name}</h1>
              <p className="text-emerald-400 text-lg font-medium">{user.designation}</p>

              {/* Contact */}
              <div className="mt-4 space-y-2 text-sm">
                <p className="text-gray-400">
                  📧 <span className="text-gray-300">{user.email}</span>
                </p>
                {user.phoneNumber && (
                  <p className="text-gray-400">
                    📱 <span className="text-gray-300">{user.phoneNumber}</span>
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-5">
                {user.linkedIn && (
                  <a
                    href={user.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
                  >
                    <FaLinkedin /> LinkedIn
                  </a>
                )}
                <button
                  onClick={() =>
                    router.push(
                      `/chat?partnerId=${user._id}&partnerName=${user.name}&partnerModel=Teacher`
                    )
                  }
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  💬 Message
                </button>
              </div>

              {/* Skills */}
              {user.skills?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-gray-800 border border-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Details */}
            <div className="flex-1 mt-4 lg:mt-24">
              {/* About */}
              {user.about && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3 text-gray-200">About</h2>
                  <p className="text-gray-400 leading-relaxed bg-gray-900 border border-gray-800 rounded-xl p-5">
                    {user.about}
                  </p>
                </div>
              )}

              {/* Projects */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-gray-200">Projects</h2>
                {user.projects?.length > 0 ? (
                  <div className="space-y-4">
                    {user.projects.map((project, i) => (
                      <div
                        key={i}
                        className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-emerald-400 mb-1">
                          {project.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                        {project.link && (
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={project.link}
                            className="text-sm text-blue-400 hover:text-blue-300"
                          >
                            View Project ↗
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 bg-gray-900 border border-gray-800 rounded-xl p-5">
                    No projects added yet.
                  </p>
                )}
              </div>

              {/* Books & Patents */}
              {user.books?.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3 text-gray-200">📚 Books</h2>
                  <div className="flex flex-wrap gap-2">
                    {user.books.map((book, i) => (
                      <span key={i} className="bg-gray-900 border border-gray-800 text-gray-300 px-4 py-2 rounded-xl text-sm">
                        {book}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {user.patents?.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-3 text-gray-200">📜 Patents</h2>
                  <div className="flex flex-wrap gap-2">
                    {user.patents.map((patent, i) => (
                      <span key={i} className="bg-gray-900 border border-gray-800 text-gray-300 px-4 py-2 rounded-xl text-sm">
                        {patent}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
