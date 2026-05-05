"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";
import AddProjects from "../AddProjectModal/AddProjects";
import UpdateDetails from "../UpdateDetails/UpdateDetails";
import { FaLinkedin } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";
import { IoIosLogOut } from "react-icons/io";
import Cookies from "js-cookie";
import { FaShareAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Navbar from "../Navbar/Navbar";

const StudenProfile = () => {
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isUpdateDetailsModalOpen, setIsUpdateDetailsModalOpen] =
    useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const token = Cookies.get("token");

  // Fetch user data
  const fetchMine = async () => {
    try {
      const response = await axios.get("/api/users/me");
      if (response.data.success) {
        setProjects(response.data.user.projects);
        setUser(response.data.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMine();
  }, [router, token]);

  // Logout handler
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      const response = await axios.post(
        "/api/users/logout",
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        router.push("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLogoutLoading(false);
    }
  };

  // Save profile image URL
  const saveImageUrl = async (url) => {
    try {
      const response = await axios.post("/api/users/uploadImage", {
        userId: user._id,
        imageUrl: url,
      });
      if (response.data.success) {
        setUser((prevUser) => ({ ...prevUser, profile: url }));
        console.log("Image URL saved successfully");
      }
    } catch (error) {
      console.error("Error saving image URL", error);
    }
  };
  const shareProfile = () => {
    const profileUrl = `https://peerview.netlify.app/profile/${user._id}`;
    navigator.clipboard
      .writeText(profileUrl)
      .then(() => {
        toast.success("Profile url copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white p-4 md:px-8 lg:px-16">
        {loading ? (
          <div className="flex justify-center items-center space-x-2">
            <div className="w-8 h-8 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : !user ? (
          <div className="flex justify-center items-center h-32">
            <p className="text-xl font-semibold">User not found</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:space-x-12 space-y-6 lg:space-y-0">
            <div className="flex flex-col items-center lg:items-start">
              <div className="h-60 w-60 lg:h-80 lg:w-80 bg-pink-50 rounded-md relative overflow-hidden mb-4 flex items-center justify-center text-gray-400">
                {user.profile ? (
                  <Image
                    src={user.profile}
                    alt="Profile"
                    fill
                    className="rounded-sm object-cover"
                  />
                ) : (
                  <span>No Image</span>
                )}
              </div>

              <div className="flex justify-center items-center gap-[30px]">
                <div>
                  <h1 className="text-2xl mt-2 lg:text-3xl font-semibold">
                    {user.userName}
                  </h1>
                  <h2 className="text-lg lg:text-xl text-blue-500">
                    Software Engineer
                  </h2>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-500 text-[30px] "
                >
                  <IoIosLogOut />
                </button>
              </div>

              <div className="mt-4">
                <h3 className="text-xl lg:text-2xl font-semibold mb-2">
                  Skills:
                </h3>
                <ul className="flex flex-wrap lg:flex-col gap-2">
                  {user.skills.map((skill) => (
                    <li
                      key={skill}
                      className="text-lg lg:text-xl bg-white text-black py-2 px-3 rounded-md"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex-1">
              <div className="space-y-2 mb-6">
                <p className="text-blue-600 text-lg lg:text-xl">
                  Batch: <span className="text-white">{user.batch}</span>
                </p>
                <p className="text-blue-600 text-lg lg:text-xl">
                  Section:{" "}
                  <span className="uppercase text-white">{user.section}</span>
                </p>
                <p className="text-blue-600 text-lg lg:text-xl">
                  Phone: <span className="text-white">{user.phoneNumber}</span>
                </p>
                <p className="text-blue-600 text-lg lg:text-xl">
                  Email: <span className="text-white">{user.email}</span>
                </p>
              </div>

              <div className="flex gap-4 flex-wrap items-center mb-6">
                <a
                  href={user.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-3xl lg:text-4xl"
                >
                  <FaLinkedin />
                </a>
                <a
                  href={user.leetcode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 text-3xl lg:text-4xl"
                >
                  <SiLeetcode />
                </a>
                {user.portFolio && (
                  <a
                    href={user.portFolio}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 px-4 py-2 rounded text-white font-semibold text-lg"
                  >
                    Portfolio
                  </a>
                )}
                <p className="text-lg lg:text-xl">
                  Placed:{" "}
                  <span className="text-blue-500">
                    {user.placedCompanies?.join(", ") || "Not yet"}
                  </span>
                </p>
                <button
                  onClick={() => setIsUpdateDetailsModalOpen(true)}
                  className="bg-green-300 text-black px-4 rounded-lg py-2 font-semibold"
                >
                  Update Details
                </button>
                <FaShareAlt onClick={shareProfile} className="text-[25px]" />
                <CldUploadWidget
                  uploadPreset="akapeer"
                  options={{ folder: "user_profiles" }}
                  onSuccess={({ event, info }) => {
                    const uploadImageUrl = info.secure_url;
                    setImageUrl(uploadImageUrl);
                    saveImageUrl(uploadImageUrl);
                  }}
                >
                  {({ open }) => (
                    <button
                      className="bg-white text-black px-4 py-2 font-semibold rounded-lg"
                      onClick={() => open()}
                    >
                      {user.profile ? "Update Profile" : "Upload Profile"}
                    </button>
                  )}
                </CldUploadWidget>
              </div>

              <hr className="w-full mt-[20px] ml-[10px]" />

              <div className="mt-[20px]">
                <div className="flex justify-between items-center">
                  <h1 className="text-[30px]">Projects</h1>
                  <button
                    onClick={() => setIsAddProjectModalOpen(true)}
                    className="bg-white px-4 py-2 text-blue-500 font-semibold"
                  >
                    Add Project
                  </button>
                </div>
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <div
                      className="bg-gray-900 p-[10px] mt-[10px]"
                      key={project.id}
                    >
                      <h1 className="text-[25px] font-bold text-blue-600">
                        {project.title}
                      </h1>
                      <p className="mb-[15px]">{project.description}</p>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={project.link}
                        className="bg-white px-4 py-2 text-blue-600 font-semibold"
                      >
                        Live Preview
                      </a>
                    </div>
                  ))
                ) : (
                  <h1>No projects added yet</h1>
                )}
              </div>
            </div>
          </div>
        )}

        {isAddProjectModalOpen && (
          <AddProjects
            isOpen={isAddProjectModalOpen}
            userId={user._id}
            onClose={() => setIsAddProjectModalOpen(false)}
          />
        )}
        {isUpdateDetailsModalOpen && (
          <UpdateDetails
            isOpen={isUpdateDetailsModalOpen}
            fetchMine={fetchMine}
            userId={user._id}
            onClose={() => setIsUpdateDetailsModalOpen()}
          />
        )}
      </div>
    </>
  );
};

export default StudenProfile;
