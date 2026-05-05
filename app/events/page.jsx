"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [canCreate, setCanCreate] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    category: "other",
  });
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      try {
        const role = Cookies.get("role");
        const meRes = await axios.get("/api/users/me");
        if (meRes.data.success) {
          setCurrentUserId(meRes.data.user._id);
          if (meRes.data.user.isAdmin) {
            setIsAdmin(true);
            setCanCreate(true);
          } else if (role === "teacher") {
            setCanCreate(true);
          }
        }
      } catch (err) {
        // Check if teacher
        const role = Cookies.get("role");
        if (role === "teacher") {
          setCanCreate(true);
        }
      }
      await fetchEvents();
      setLoading(false);
    };
    init();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/api/events/all");
      if (res.data.success) {
        setEvents(res.data.events);
      }
    } catch (error) {
      console.error("Failed to fetch events");
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/events/create", formData);
      if (res.data.success) {
        toast.success("Event created!");
        setShowCreateModal(false);
        setFormData({ title: "", description: "", date: "", time: "", venue: "", category: "other" });
        fetchEvents();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to create event");
    }
  };

  const handleRsvp = async (eventId) => {
    try {
      const res = await axios.post("/api/events/rsvp", { eventId });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchEvents();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Login required to RSVP");
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await axios.delete(`/api/admin/deleteEvent?id=${eventId}`);
      if (res.data.success) {
        toast.success("Event deleted");
        fetchEvents();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      hackathon: "bg-purple-600",
      workshop: "bg-blue-600",
      seminar: "bg-green-600",
      cultural: "bg-pink-600",
      sports: "bg-orange-600",
      other: "bg-gray-600",
    };
    return colors[category] || "bg-gray-600";
  };

  const getCategoryEmoji = (category) => {
    const emojis = {
      hackathon: "💻",
      workshop: "🔧",
      seminar: "📚",
      cultural: "🎭",
      sports: "⚽",
      other: "📌",
    };
    return emojis[category] || "📌";
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <p className="text-xl">Loading Events...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">📅 Campus Events</h1>
            {canCreate && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                + Create Event
              </button>
            )}
          </div>

          {events.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-6xl mb-4">📅</p>
              <p className="text-gray-500 text-lg">No events scheduled yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {events.map((event) => {
                const eventDate = new Date(event.date);
                const isPast = eventDate < new Date();
                const hasRsvped = event.rsvps?.includes(currentUserId);

                return (
                  <div
                    key={event._id}
                    className={`bg-gray-900 border border-gray-800 rounded-xl p-6 ${isPast ? "opacity-60" : ""}`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`${getCategoryColor(event.category)} px-3 py-1 rounded-full text-xs font-semibold uppercase`}>
                            {getCategoryEmoji(event.category)} {event.category}
                          </span>
                          {isPast && (
                            <span className="bg-red-900 text-red-300 px-3 py-1 rounded-full text-xs">
                              Event Ended
                            </span>
                          )}
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
                        <p className="text-gray-400 mb-3">{event.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <span>📅 {eventDate.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
                          <span>⏰ {event.time}</span>
                          <span>📍 {event.venue}</span>
                          <span>👤 {event.organizerName}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-blue-400">{event.rsvps?.length || 0}</p>
                          <p className="text-xs text-gray-500">RSVPs</p>
                        </div>
                        {!isPast && (
                          <button
                            onClick={() => handleRsvp(event._id)}
                            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                              hasRsvped
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-blue-600 hover:bg-blue-700 text-white"
                            }`}
                          >
                            {hasRsvped ? "✓ Going" : "RSVP"}
                          </button>
                        )}
                        {isAdmin && (
                          <button
                            onClick={() => handleDelete(event._id)}
                            className="bg-red-900/30 text-red-500 hover:bg-red-900/50 hover:text-red-400 px-6 py-1 rounded-lg text-sm transition-colors border border-red-900/50 mt-1"
                          >
                            Delete Event
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            <button onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
            <h2 className="text-2xl font-semibold mb-6 text-white">📅 Create New Event</h2>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Event Title*</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description*</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Date*</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Time*</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Venue*</label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none"
                >
                  <option value="hackathon">💻 Hackathon</option>
                  <option value="workshop">🔧 Workshop</option>
                  <option value="seminar">📚 Seminar</option>
                  <option value="cultural">🎭 Cultural</option>
                  <option value="sports">⚽ Sports</option>
                  <option value="other">📌 Other</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-4">
                Create Event
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EventsPage;
