import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Navbar from "../Navbar/Navbar";

const UpdateDetails = ({ isOpen, onClose, fetchMine }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [skills, setSkills] = useState("");
  const [leetcode, setLeetcode] = useState("");
  const [companies, setCompanies] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const updatedDetails = {
      phoneNumber,
      skills: skills ? skills.split(",").map((skill) => skill.trim()) : [],
      leetcode,
      placedCompanies: companies
        ? companies.split(",").map((company) => company.trim())
        : [],
    };

    try {
      setLoading(true);
      const response = await axios.patch(
        "/api/users/updateDetail",
        updatedDetails
      );

      if (response.data.success) {
        toast.success(response.data.message);
        onClose();
        fetchMine();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating details:", error);

      toast.error("Error updating details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Navbar />
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
        <div className="bg-gray-900 rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-[15px] text-center text-white">
            Update Details
          </h2>
          <p className="text-center mb-[10px] text-blue-600">
            It&apos;s not mandatory to update all the details
          </p>
          <form className="flex flex-col" onSubmit={handleUpdate}>
            <label className="mb-2 text-sm font-medium text-gray-300">
              Phone Number
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="9996565896"
              className="border border-gray-600 rounded-md p-2 mb-4 bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-600"
            />

            <label className="mb-2 text-sm font-medium text-gray-300">
              Add More Skills
            </label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Skills (comma separated)"
              className="border border-gray-600 rounded-md p-2 mb-4 bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-600"
            />

            <label className="mb-2 text-sm font-medium text-gray-300">
              Add or Update Leetcode Profile
            </label>
            <input
              type="url"
              value={leetcode}
              onChange={(e) => setLeetcode(e.target.value)}
              placeholder="https://example.com"
              className="border border-gray-600 rounded-md p-2 mb-4 bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-600"
            />

            <label className="mb-2 text-sm font-medium text-gray-300">
              Name of companies in which you are placed
            </label>
            <input
              type="text"
              value={companies}
              onChange={(e) => setCompanies(e.target.value)}
              placeholder="Accenture, TechMahindra"
              className="border border-gray-600 rounded-md p-2 mb-4 bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-600"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white rounded-md py-2 hover:bg-blue-500 transition duration-200"
            >
              {loading ? "Updating Details..." : "Update Details"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 text-gray-400 underline hover:text-gray-200"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateDetails;
