import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Navbar from "../Navbar/Navbar";

const NotifyStudents = ({ isOpen, onClose, fetchUser }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    const newNotification = {
      title,
      content,
      url,
    };

    try {
      setLoading(true);
      const response = await axios.post(
        "/api/teachers/addNotification",
        newNotification
      );

      if (response.data.success) {
        toast.success(
          response.data.message || "Notification sent successfully!"
        );
        onClose(); // Close modal after success
        fetchUser(); // Refresh the data
      } else {
        toast.error(response.data.message || "Failed to send notification.");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Error sending notification. Please try again.");
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
            Notify Students
          </h2>
          <form className="flex flex-col" onSubmit={handleUpload}>
            <label className="mb-2 text-sm font-medium text-gray-300">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title of the Notification"
              className="border border-gray-600 rounded-md p-2 mb-4 bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-600"
            />

            <label className="mb-2 text-sm font-medium text-gray-300">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Notification Content"
              className="border border-gray-600 rounded-md p-2 mb-4 bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-600"
            />

            <label className="mb-2 text-sm font-medium text-gray-300">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="border border-gray-600 rounded-md p-2 mb-4 bg-gray-800 text-white focus:outline-none focus:ring focus:ring-blue-600"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white rounded-md py-2 hover:bg-blue-500 transition duration-200"
            >
              {loading ? "Sending Notification..." : "Send Notification"}
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

export default NotifyStudents;
