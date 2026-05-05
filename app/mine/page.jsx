"use client";

import StudenProfile from "@/components/StudentProfile/StudenProfile";
import TeacherProfile from "@/components/TeacherProfile.jsx/TeacherProfile";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AdminProfile from "@/components/AdminProfile/AdminProfile";

const MyProfile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
      setRole(role);
    }
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {role === "admin" ? (
        <AdminProfile />
      ) : role === "student" ? (
        <StudenProfile />
      ) : (
        <TeacherProfile />
      )}
    </>
  );
};

export default MyProfile;
