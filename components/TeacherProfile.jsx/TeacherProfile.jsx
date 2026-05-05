import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import Image from "next/image";
import { FaLinkedin } from "react-icons/fa";
import { CldUploadWidget } from "next-cloudinary";
import TeacherUpdate from "../TeacherUpdate/TeacherUpdate";
import NotifyStudents from "../notifyStudents/NotifyStudents";
import Navbar from "../Navbar/Navbar";

const TeacherProfile = () => {
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isUpdateDetailsModalOpen, setIsUpdateDetailsModalOpen] =
    useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const fetchUser = async () => {
    const response = await axios.get("/api/teachers/me");
    const data = response.data.user;
    console.log(data);

    setUser(data);
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "/api/users/logout",
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        router.push("/teacherLogin");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  const saveImageUrl = async (url) => {
    try {
      const response = await axios.post("/api/teachers/uploadImage", {
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
  if (!user) return <h1>Loading.....</h1>;
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white p-4 md:px-8 lg:px-16">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:space-x-12 space-y-6 lg:space-y-0">
          <div className="flex flex-col items-center lg:items-start">
            <div className="h-60 w-60 lg:h-80 lg:w-80 bg-pink-50 rounded-md relative overflow-hidden mb-4 flex items-center justify-center text-gray-400">
              {user.profile ? (
                <Image
                  src={user.profile}
                  alt="Teacher's Profile"
                  className="rounded-sm object-cover"
                  width={320}
                  height={320}
                />
              ) : (
                <span>No Image</span>
              )}
            </div>

            <div className="flex justify-center items-center gap-[30px]">
              <div>
                <h1 className="text-2xl mt-2 lg:text-3xl font-semibold">
                  {user.name}
                </h1>
                <h2 className="text-lg lg:text-xl text-blue-500">
                  {user.designation}
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
                Phone: <span className="text-white">{user.phoneNumber}</span>
              </p>
              <p className="text-blue-600 text-lg lg:text-xl">
                Email: <span className="text-white">{user.email}</span>
              </p>
              <p>{user.about}</p>
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

              <button
                onClick={() => setIsUpdateDetailsModalOpen(true)}
                className="bg-green-300 text-black px-4 rounded-lg py-2 font-semibold"
              >
                Update Details
              </button>
              <button
                onClick={() => setIsNotifyModalOpen(true)}
                className="flex justify-center items-center bg-green-300 px-4 py-2 text-black font-semibold rounded-lg"
              >
                Notify Students
              </button>
              <CldUploadWidget
                uploadPreset="akapeer"
                options={{ folder: "teacher_profile" }}
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
          </div>
        </div>

        {isUpdateDetailsModalOpen && (
          <TeacherUpdate
            isOpen={isUpdateDetailsModalOpen}
            fetchUser={fetchUser}
            userId={user._id}
            onClose={() => setIsUpdateDetailsModalOpen()}
          />
        )}
        {isNotifyModalOpen && (
          <NotifyStudents
            isOpen={isNotifyModalOpen}
            fetchUser={fetchUser}
            onClose={() => setIsNotifyModalOpen()}
          />
        )}
      </div>
    </>
  );
};

export default TeacherProfile;
