"use client";

import Navbar from "@/components/Navbar/Navbar";
import { useEffect, useState } from "react";

const Page = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const response = await fetch("/api/getNotifications");
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
        // Mark all as viewed in localStorage
        const ids = data.notifications.map((n) => n._id);
        localStorage.setItem("viewedNotifications", JSON.stringify(ids));
      }
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-3xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-2">🔔 Notifications</h1>
          <p className="text-gray-500 mb-8">
            Stay updated with the latest announcements
          </p>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
              <p className="text-gray-500 ml-3">Loading...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔕</p>
              <p className="text-gray-500 text-lg">
                No notifications yet. Check back later!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications
                .sort(
                  (a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                )
                .map((notification) => (
                  <div
                    key={notification._id}
                    className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-lg font-semibold text-blue-400">
                        {notification.title}
                      </h2>
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm mb-3">
                      {notification.content}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">
                          {notification.teacher?.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <span className="text-xs text-gray-400">
                          {notification.teacher?.name || "Unknown"}
                        </span>
                      </div>

                      {notification.url && (
                        <a
                          href={notification.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                        >
                          Learn more ↗
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

export default Page;
