"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Navbar from "@/components/Navbar/Navbar";
import AdminUpdateUser from "@/components/AdminUpdateUser/AdminUpdateUser";
import AdminUpdateTeacher from "@/components/AdminUpdateTeacher/AdminUpdateTeacher";
import Image from "next/image";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("students");
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [adminUsers, setAdminUsers] = useState([]);

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [alumniModal, setAlumniModal] = useState(null);
  const [alumniForm, setAlumniForm] = useState({ graduationYear: "", currentCompany: "", currentRole: "" });
  const [subAdminForm, setSubAdminForm] = useState({ userName: "", email: "", password: "" });

  const router = useRouter();

  const verifyAdmin = async () => {
    try {
      const res = await axios.get("/api/users/me");
      if (res.data.success && res.data.user.isAdmin) {
        setIsAdmin(true);
        if (res.data.user.isSuperAdmin) {
          setIsSuperAdmin(true);
        }
      } else {
        router.push("/");
      }
    } catch (error) {
      router.push("/");
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get("/api/users/allProfiles");
      if (res.data.success) {
        const allUsers = res.data.users;
        setStudents(allUsers.filter((u) => !u.isAdmin));
        setAdminUsers(allUsers.filter((u) => u.isAdmin));
      }
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("/api/teachers/allTeachers");
      if (res.data.success) {
        setTeachers(res.data.teachers || res.data.users || []);
      }
    } catch (error) {
      console.error("Failed to fetch teachers", error);
    }
  };

  const handleDeleteStudent = async (userId) => {
    if (window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      try {
        const res = await axios.delete(`/api/admin/deleteUser?userId=${userId}`);
        if (res.data.success) {
          toast.success(res.data.message);
          fetchStudents();
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        toast.error("Failed to delete student.");
      }
    }
  };

  const handleDeleteTeacher = async (teacherId) => {
    if (window.confirm("Are you sure you want to delete this teacher? This action cannot be undone.")) {
      try {
        const res = await axios.delete(`/api/admin/deleteTeacher?teacherId=${teacherId}`);
        if (res.data.success) {
          toast.success(res.data.message);
          fetchTeachers();
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        toast.error("Failed to delete teacher.");
      }
    }
  };

  const fetchAlumni = async () => {
    try {
      const res = await axios.get("/api/alumni/all");
      if (res.data.success) {
        setAlumni(res.data.alumni);
      }
    } catch (error) {
      console.error("Failed to fetch alumni", error);
    }
  };

  const handleConvertToAlumni = async () => {
    if (!alumniModal) return;
    try {
      const res = await axios.post("/api/alumni/convert", {
        userId: alumniModal._id,
        graduationYear: alumniForm.graduationYear,
        currentCompany: alumniForm.currentCompany,
        currentRole: alumniForm.currentRole,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setAlumniModal(null);
        setAlumniForm({ graduationYear: "", currentCompany: "", currentRole: "" });
        fetchStudents();
        fetchAlumni();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to convert to alumni.");
    }
  };

  const handleCreateSubAdmin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/admin/createSubAdmin", subAdminForm);
      if (res.data.success) {
        toast.success(res.data.message);
        setSubAdminForm({ userName: "", email: "", password: "" });
        fetchStudents(); // Refresh admin list
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to create sub admin.");
    }
  };

  const handleImpersonate = async (userId, role) => {
    try {
      const res = await axios.post("/api/admin/impersonate", { targetUserId: userId, role });
      if (res.data.success) {
        toast.success(res.data.message);
        // Small delay to allow cookies to settle
        setTimeout(() => {
          if (role === "teacher") {
            window.location.href = "/teacherProfile";
          } else {
            window.location.href = "/profile";
          }
        }, 500);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to impersonate user.");
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await verifyAdmin();
      await fetchStudents();
      await fetchTeachers();
      await fetchAlumni();
      setLoading(false);
    };
    initialize();
  }, []);

  if (loading || !isAdmin) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <h2 className="text-3xl font-semibold">Loading Admin Dashboard...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white p-6 md:p-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <button
            className={`px-6 py-2 font-semibold rounded-l-lg transition-colors duration-200 ${
              activeTab === "students"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("students")}
          >
            Students ({students.length})
          </button>
          <button
            className={`px-6 py-2 font-semibold transition-colors duration-200 ${
              activeTab === "teachers"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
            onClick={() => setActiveTab("teachers")}
          >
            Teachers ({teachers.length})
          </button>
          <button
            className={`px-6 py-2 font-semibold transition-colors duration-200 ${
              activeTab === "alumni"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            } ${!isSuperAdmin ? "rounded-r-lg" : ""}`}
            onClick={() => setActiveTab("alumni")}
          >
            Alumni ({alumni.length})
          </button>
          {isSuperAdmin && (
            <button
              className={`px-6 py-2 font-semibold rounded-r-lg transition-colors duration-200 ${
                activeTab === "admins"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
              onClick={() => setActiveTab("admins")}
            >
              Admins ({adminUsers.length})
            </button>
          )}
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {activeTab === "students" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <div
                  key={student._id}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex flex-col items-center shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-800 flex items-center justify-center">
                    {student.profile ? (
                      <Image
                        src={student.profile}
                        alt={student.userName}
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-sm">No Image</span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-1">
                    {student.userName}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">{student.email}</p>
                  <div className="w-full text-sm text-gray-300 mb-4 space-y-1">
                    <p>
                      <span className="font-semibold">Batch:</span> {student.batch}
                    </p>
                    <p>
                      <span className="font-semibold">Section:</span> {student.section}
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span> {student.phoneNumber}
                    </p>
                  </div>
                  <div className="mt-auto w-full flex gap-2">
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-medium transition-colors text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setAlumniModal(student);
                        setAlumniForm({ graduationYear: "", currentCompany: "", currentRole: "" });
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium transition-colors text-sm"
                    >
                      Alumni
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-medium transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                  <button
                    onClick={() => handleImpersonate(student._id, "student")}
                    className="w-full mt-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-200 py-1.5 rounded font-medium transition-colors text-sm"
                  >
                    Login As
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "teachers" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map((teacher) => (
                <div
                  key={teacher._id}
                  className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex flex-col items-center shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-800 flex items-center justify-center">
                    {teacher.profile ? (
                      <Image
                        src={teacher.profile}
                        alt={teacher.name}
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-sm">No Image</span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-1">
                    {teacher.name}
                  </h3>
                  <p className="text-blue-400 text-sm font-medium mb-1">
                    {teacher.designation}
                  </p>
                  <p className="text-gray-400 text-sm mb-4">{teacher.email}</p>
                  <div className="w-full text-sm text-gray-300 mb-4 space-y-1">
                    <p>
                      <span className="font-semibold">Phone:</span> {teacher.phoneNumber}
                    </p>
                  </div>
                  <div className="mt-auto w-full flex gap-2">
                    <button
                      onClick={() => setSelectedTeacher(teacher)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTeacher(teacher._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                  <button
                    onClick={() => handleImpersonate(teacher._id, "teacher")}
                    className="w-full mt-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-200 py-1.5 rounded font-medium transition-colors text-sm"
                  >
                    Login As
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "alumni" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumni.length === 0 ? (
                <p className="text-gray-500 col-span-3 text-center py-10">No alumni yet. Convert students from the Students tab.</p>
              ) : (
                alumni.map((person) => (
                  <div
                    key={person._id}
                    className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex flex-col items-center shadow-lg"
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-800 flex items-center justify-center">
                      {person.profile ? (
                        <Image src={person.profile} alt={person.userName} width={96} height={96} className="object-cover" />
                      ) : (
                        <span className="text-gray-500 text-sm">No Image</span>
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-center mb-1">{person.userName}</h3>
                    <p className="text-blue-400 text-sm">{person.currentRole || "N/A"}</p>
                    <p className="text-gray-400 text-sm mb-3">at {person.currentCompany || "N/A"}</p>
                    <p className="text-gray-500 text-xs">🎓 Class of {person.graduationYear || "N/A"}</p>
                  </div>
                ))
              )}
            </div>
          )}
          {activeTab === "admins" && isSuperAdmin && (
            <div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Create Sub Admin</h2>
                <form onSubmit={handleCreateSubAdmin} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Name</label>
                    <input
                      type="text"
                      value={subAdminForm.userName}
                      onChange={(e) => setSubAdminForm({ ...subAdminForm, userName: e.target.value })}
                      className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={subAdminForm.email}
                      onChange={(e) => setSubAdminForm({ ...subAdminForm, email: e.target.value })}
                      className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Password</label>
                    <input
                      type="password"
                      value={subAdminForm.password}
                      onChange={(e) => setSubAdminForm({ ...subAdminForm, password: e.target.value })}
                      className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg mt-4">
                    Create Sub Admin
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {adminUsers.map((admin) => (
                  <div
                    key={admin._id}
                    className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex flex-col items-center shadow-lg hover:shadow-xl transition-shadow relative"
                  >
                    {admin.isSuperAdmin && (
                      <span className="absolute top-2 right-2 bg-yellow-600 text-white text-xs font-bold px-2 py-1 rounded">Super Admin</span>
                    )}
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-800 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                    <h3 className="text-xl font-semibold text-center mb-1">
                      {admin.userName}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">{admin.email}</p>
                    
                    {!admin.isSuperAdmin && (
                      <div className="mt-auto w-full flex flex-col gap-2">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDeleteStudent(admin._id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded font-medium transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </div>
                        <button
                          onClick={() => handleImpersonate(admin._id, "student")}
                          className="w-full bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-200 py-1.5 rounded font-medium transition-colors text-sm"
                        >
                          Login As
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {selectedStudent && (
        <AdminUpdateUser
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          user={selectedStudent}
          fetchUsers={fetchStudents}
        />
      )}
      {selectedTeacher && (
        <AdminUpdateTeacher
          isOpen={!!selectedTeacher}
          onClose={() => setSelectedTeacher(null)}
          teacher={selectedTeacher}
          fetchTeachers={fetchTeachers}
        />
      )}

      {/* Alumni Conversion Modal */}
      {alumniModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md relative">
            <button onClick={() => setAlumniModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
            <h2 className="text-2xl font-semibold mb-4 text-white">🎓 Convert to Alumni</h2>
            <p className="text-gray-400 mb-4">Converting: <strong className="text-white">{alumniModal.userName}</strong></p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Graduation Year</label>
                <input type="text" value={alumniForm.graduationYear} onChange={(e) => setAlumniForm({ ...alumniForm, graduationYear: e.target.value })} className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none" placeholder="e.g. 2024" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Current Company</label>
                <input type="text" value={alumniForm.currentCompany} onChange={(e) => setAlumniForm({ ...alumniForm, currentCompany: e.target.value })} className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none" placeholder="e.g. Google" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Current Role</label>
                <input type="text" value={alumniForm.currentRole} onChange={(e) => setAlumniForm({ ...alumniForm, currentRole: e.target.value })} className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none" placeholder="e.g. Software Engineer" />
              </div>
              <button onClick={handleConvertToAlumni} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg mt-2">
                Convert to Alumni
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
