"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import { FaSearch } from "react-icons/fa";

const Page = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const token = Cookies.get("token");
  const router = useRouter();

  const fetchTeachers = async () => {
    try {
      const response = await axios.get("/api/teachers/allTeachers");
      const data = response.data;
      setTeachers(data.users || data.teachers || []);
      setFilteredTeachers(data.users || data.teachers || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredTeachers(teachers);
      return;
    }
    const filtered = teachers.filter(
      (t) =>
        t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.skills?.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
    setFilteredTeachers(filtered);
  }, [searchQuery, teachers]);

  const changePage = (userId) => {
    router.push(`/teacherProfile/${userId}`);
  };

  return (
    <>
      <Navbar />
      <div className="bg-black min-h-screen">
        {/* Hero Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 via-teal-900/20 to-black"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Faculty{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Directory
              </span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Meet the faculty and staff of the MCA Department
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-xl mx-auto">
              <div className="flex items-center bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-full px-5 py-3 focus-within:border-emerald-500 transition-colors">
                <FaSearch className="text-gray-500 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, designation, or skill..."
                  className="flex-1 bg-transparent text-white outline-none placeholder-gray-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-t-3 border-emerald-500 border-solid rounded-full animate-spin"></div>
              <p className="text-gray-500 ml-3">Loading faculty...</p>
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">👨‍🏫</p>
              <p className="text-gray-500 text-lg">
                No teachers found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredTeachers.map((teacher) => (
                <div
                  key={teacher._id}
                  className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 hover:shadow-xl hover:shadow-emerald-900/10 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Top Gradient Bar */}
                  <div className="h-24 bg-gradient-to-br from-emerald-600 to-teal-700 relative">
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                      <div className="w-20 h-20 rounded-full ring-4 ring-gray-900 overflow-hidden bg-gray-800">
                        {teacher.profile ? (
                          <Image
                            src={teacher.profile}
                            alt={teacher.name}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">
                            {teacher.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-12 pb-5 px-5 flex flex-col items-center">
                    <h3 className="text-white font-semibold text-lg text-center mb-1">
                      {teacher.name}
                    </h3>
                    <p className="text-emerald-400 text-sm font-medium mb-3">
                      {teacher.designation}
                    </p>

                    {teacher.skills?.length > 0 && (
                      <div className="flex flex-wrap justify-center gap-1 mb-4">
                        {teacher.skills.slice(0, 3).map((skill, i) => (
                          <span
                            key={i}
                            className="bg-gray-800 text-gray-400 text-[10px] px-2 py-0.5 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {teacher.skills.length > 3 && (
                          <span className="text-gray-600 text-[10px] px-1">
                            +{teacher.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => changePage(teacher._id)}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-2 rounded-xl text-sm font-medium transition-all"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
