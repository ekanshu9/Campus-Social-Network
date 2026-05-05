"use client";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const AdminUpdateTeacher = ({ isOpen, onClose, teacher, fetchTeachers }) => {
  const [formData, setFormData] = useState({
    teacherId: teacher._id,
    name: teacher.name || "",
    email: teacher.email || "",
    designation: teacher.designation || "",
    phoneNumber: teacher.phoneNumber || "",
    skills: teacher.skills ? teacher.skills.join(", ") : "",
    about: teacher.about || "",
    linkedIn: teacher.linkedIn || "",
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
      };

      const response = await axios.patch("/api/admin/updateTeacher", payload);

      if (response.data.success) {
        toast.success("Teacher updated successfully");
        fetchTeachers();
        onClose();
      } else {
        toast.error(response.data.message || "Failed to update");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ✕
        </button>
        <h2 className="text-2xl font-semibold mb-6 text-white">Edit Teacher (Admin)</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-400 mb-1">LinkedIn URL</label>
              <input
                type="text"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-400 mb-1">Skills (comma separated)</label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm text-gray-400 mb-1">About</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={3}
                className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-6"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminUpdateTeacher;
