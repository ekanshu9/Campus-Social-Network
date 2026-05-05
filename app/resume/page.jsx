"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";

const ResumePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/users/me");
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <p className="text-xl">Generating Resume...</p>
        </div>
      </>
    );
  }

  if (!user) return null;

  return (
    <>
      {/* Navbar only shown on screen, hidden during print */}
      <div className="print:hidden">
        <Navbar />
        <div className="bg-black p-4 text-center">
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold text-lg"
          >
            📄 Download Resume as PDF
          </button>
          <p className="text-gray-500 text-sm mt-2">Click the button above, then choose &quot;Save as PDF&quot; in the print dialog.</p>
        </div>
      </div>

      {/* Resume Content */}
      <div className="bg-white text-black min-h-screen print:min-h-0" id="resume-content">
        <div className="max-w-[800px] mx-auto p-8 print:p-6 print:max-w-none">
          {/* Header */}
          <div className="border-b-2 border-gray-800 pb-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-wide">
              {user.userName}
            </h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
              <span>📧 {user.email}</span>
              <span>📱 {user.phoneNumber}</span>
              {user.linkedIn && <span>🔗 LinkedIn: {user.linkedIn}</span>}
              {user.portFolio && <span>🌐 Portfolio: {user.portFolio}</span>}
            </div>
          </div>

          {/* Education */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wider">
              Education
            </h2>
            <div className="ml-2">
              <p className="font-semibold">Batch: {user.batch}</p>
              <p className="text-gray-600">Section: {user.section}</p>
            </div>
          </div>

          {/* Skills */}
          {user.skills?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wider">
                Technical Skills
              </h2>
              <div className="flex flex-wrap gap-2 ml-2">
                {user.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm border border-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {user.projects?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wider">
                Projects
              </h2>
              {user.projects.map((project, i) => (
                <div key={i} className="ml-2 mb-3">
                  <p className="font-semibold">{project.title}</p>
                  <p className="text-gray-600 text-sm">{project.description}</p>
                  {project.link && (
                    <p className="text-blue-600 text-sm">{project.link}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {user.certifications?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wider">
                Certifications
              </h2>
              <ul className="list-disc list-inside ml-2 text-gray-700">
                {user.certifications.map((cert, i) => (
                  <li key={i}>{cert}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Placed Companies */}
          {user.placedCompanies?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wider">
                Placement
              </h2>
              <div className="flex flex-wrap gap-2 ml-2">
                {user.placedCompanies.map((company, i) => (
                  <span
                    key={i}
                    className="bg-green-50 text-green-800 px-3 py-1 rounded text-sm border border-green-300"
                  >
                    {company}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Online Profiles */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-300 pb-1 mb-3 uppercase tracking-wider">
              Online Profiles
            </h2>
            <div className="ml-2 text-sm text-gray-700 space-y-1">
              {user.linkedIn && <p>LinkedIn: {user.linkedIn}</p>}
              {user.portFolio && <p>Portfolio: {user.portFolio}</p>}
              {user.leetcode && <p>LeetCode: {user.leetcode}</p>}
              {user.hackerRank && <p>HackerRank: {user.hackerRank}</p>}
              {user.instaId && <p>Instagram: {user.instaId}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Print-specific styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:min-h-0 {
            min-height: 0 !important;
          }
          .print\\:p-6 {
            padding: 1.5rem !important;
          }
          .print\\:max-w-none {
            max-width: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default ResumePage;
