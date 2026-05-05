"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar/Navbar";
import Image from "next/image";

const AlumniPage = () => {
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterYear, setFilterYear] = useState("");

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const res = await axios.get("/api/alumni/all");
        if (res.data.success) {
          setAlumni(res.data.alumni);
        }
      } catch (error) {
        console.error("Failed to fetch alumni");
      } finally {
        setLoading(false);
      }
    };
    fetchAlumni();
  }, []);

  // Get unique companies and years for filters
  const companies = [...new Set(alumni.map((a) => a.currentCompany).filter(Boolean))];
  const years = [...new Set(alumni.map((a) => a.graduationYear).filter(Boolean))].sort().reverse();

  const filteredAlumni = alumni.filter((a) => {
    const matchesSearch =
      a.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.skills?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCompany = !filterCompany || a.currentCompany === filterCompany;
    const matchesYear = !filterYear || a.graduationYear === filterYear;
    return matchesSearch && matchesCompany && matchesYear;
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <p className="text-xl">Loading Alumni Network...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center">🎓 Alumni Network</h1>
          <p className="text-gray-400 text-center mb-8">Connect with graduates working in the industry</p>

          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-3xl mx-auto">
            <input
              type="text"
              placeholder="Search by name or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <select
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-800 focus:outline-none"
            >
              <option value="">All Companies</option>
              {companies.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="bg-gray-900 text-white rounded-lg px-4 py-2 border border-gray-800 focus:outline-none"
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          {filteredAlumni.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">🎓</p>
              <p className="text-gray-500 text-lg">No alumni found. Alumni can be promoted from the Admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlumni.map((person) => (
                <div
                  key={person._id}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                      {person.profile ? (
                        <Image
                          src={person.profile}
                          alt={person.userName}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-2xl font-bold text-gray-500">
                          {person.userName?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{person.userName}</h3>
                      {person.currentRole && (
                        <p className="text-blue-400 text-sm">{person.currentRole}</p>
                      )}
                      {person.currentCompany && (
                        <p className="text-gray-400 text-sm">at {person.currentCompany}</p>
                      )}
                    </div>
                  </div>

                  {person.graduationYear && (
                    <p className="text-sm text-gray-500 mb-3">
                      🎓 Class of {person.graduationYear}
                    </p>
                  )}

                  {person.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {person.skills.slice(0, 5).map((skill, i) => (
                        <span
                          key={i}
                          className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    {person.linkedIn && (
                      <a
                        href={person.linkedIn.startsWith("http") ? person.linkedIn : `https://${person.linkedIn}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        LinkedIn ↗
                      </a>
                    )}
                    {person.email && (
                      <a
                        href={`mailto:${person.email}`}
                        className="text-sm text-green-400 hover:text-green-300"
                      >
                        Email ↗
                      </a>
                    )}
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

export default AlumniPage;
