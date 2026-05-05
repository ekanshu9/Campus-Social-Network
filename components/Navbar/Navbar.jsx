"use client";

import Link from "next/link";
import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useRouter, usePathname } from "next/navigation";
import { IoIosNotifications, IoIosLogOut } from "react-icons/io";
import axios from "axios";
import Cookies from "js-cookie";
const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [unreadChats, setUnreadChats] = useState(0);

  React.useEffect(() => {
    const token = Cookies.get("token");
    const adminToken = Cookies.get("adminToken");
    if (adminToken) {
      setIsImpersonating(true);
    }
    if (token) {
      setIsLoggedIn(true);
      axios
        .get("/api/users/me")
        .then((res) => {
          if (res.data.success && res.data.user.isAdmin) {
            setIsAdmin(true);
          }
        })
        .catch((err) => console.log(err));

      // Fetch notification count
      axios
        .get("/api/getNotifications")
        .then((res) => {
          if (res.data.success) {
            // Check localStorage for viewed notifications
            const viewedIds = JSON.parse(localStorage.getItem("viewedNotifications") || "[]");
            const unread = res.data.notifications.filter((n) => !viewedIds.includes(n._id));
            setNotifCount(unread.length);
          }
        })
        .catch(() => {});

      // Fetch unread chat count
      axios
        .get("/api/messages/conversations")
        .then((res) => {
          if (res.data.success) {
            const total = res.data.conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
            setUnreadChats(total);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/users/logout", {}, { withCredentials: true });
      if (response.data.success) {
        Cookies.remove("token");
        Cookies.remove("role");
        router.push("/login");
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleReturnToAdmin = async () => {
    try {
      const response = await axios.post("/api/admin/revertImpersonation");
      if (response.data.success) {
        window.location.href = "/admin";
      }
    } catch (error) {
      console.error("Failed to return to admin");
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (href) => pathname === href;

  return (
    <>
      <nav className="border-gray-800 bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-semibold text-white">
              PeerView
            </span>
          </Link>
          <div className="flex gap-[10px] md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse items-center">
            {isImpersonating && (
              <button
                onClick={handleReturnToAdmin}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1 transition-colors"
                title="Return to Admin Dashboard"
              >
                <span>🔙</span> Admin
              </button>
            )}
            {isLoggedIn && !isImpersonating && (
              <button
                onClick={handleLogout}
                className="flex justify-center text-[25px] items-center text-red-500 hover:text-red-400"
                title="Logout"
              >
                <IoIosLogOut />
              </button>
            )}
            <Link
              className="flex justify-center text-[25px] items-center text-white ml-2"
              href="/mine"
            >
              <FaUser />
            </Link>
            <Link
              href="/notifications"
              className="relative flex justify-center items-center text-white text-[35px]"
            >
              <IoIosNotifications className="text-white" />
              {notifCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-400 rounded-lg md:hidden hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600"
              aria-controls="navbar-cta"
              aria-expanded={isOpen ? "true" : "false"}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>
          <div
            className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
              isOpen ? "block" : "hidden"
            }`}
            id="navbar-cta"
          >
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-800 rounded-lg bg-gray-900 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
              <li>
                <Link
                  href="/"
                  className={`block py-2 px-3 md:p-0 rounded ${
                    isActive("/") ? "text-blue-600" : "text-gray-400"
                  } hover:text-white`}
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className={`block py-2 px-3 md:p-0 rounded ${
                    isActive("/profile") ? "text-blue-600" : "text-gray-400"
                  } hover:text-white`}
                >
                  Students
                </Link>
              </li>
              <li>
                <Link
                  href="/teacherProfile"
                  className={`block py-2 px-3 md:p-0 rounded ${
                    isActive("/teacherProfile")
                      ? "text-blue-600"
                      : "text-gray-400"
                  } hover:text-white`}
                >
                  Teachers
                </Link>
              </li>
              <li>
                <Link
                  href="/showcase"
                  className={`block py-2 px-3 md:p-0 rounded ${
                    isActive("/showcase") ? "text-blue-600" : "text-gray-400"
                  } hover:text-white`}
                >
                  Showcase
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className={`block py-2 px-3 md:p-0 rounded ${
                    isActive("/events") ? "text-blue-600" : "text-gray-400"
                  } hover:text-white`}
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/allcommunities"
                  className={`block py-2 px-3 md:p-0 rounded ${
                    isActive("/allcommunities") ? "text-blue-600" : "text-gray-400"
                  } hover:text-white`}
                >
                  Communities
                </Link>
              </li>
              <li>
                <Link
                  href="/alumni"
                  className={`block py-2 px-3 md:p-0 rounded ${
                    isActive("/alumni") ? "text-blue-600" : "text-gray-400"
                  } hover:text-white`}
                >
                  Alumni
                </Link>
              </li>
              <li>
                <Link
                  href="/chat"
                  className={`block py-2 px-3 md:p-0 rounded relative ${
                    isActive("/chat") ? "text-blue-600" : "text-gray-400"
                  } hover:text-white`}
                >
                  Chat
                  {unreadChats > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                      {unreadChats}
                    </span>
                  )}
                </Link>
              </li>
              {isAdmin && (
                <li>
                  <Link
                    href="/admin"
                    className={`block py-2 px-3 md:p-0 rounded ${
                      isActive("/admin") ? "text-blue-600" : "text-gray-400"
                    } hover:text-white`}
                  >
                    Admin
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
