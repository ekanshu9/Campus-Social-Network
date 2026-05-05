import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import Cookies from "js-cookie";
import Navbar from "../Navbar/Navbar";

const AllProfiles = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [batchFilter, setBatchFilter] = useState(null);
  const [sectionFilter, setSectionFilter] = useState(null);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(`/api/users/allProfiles`);
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
        setIsDataFetched(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setIsLoading(false);
      }
    };

    fetchAllUsers();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/users/filter", {
          params: {
            batch: batchFilter,
            section: sectionFilter,
          },
        });
        setFilteredUsers(response.data.users);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (batchFilter || sectionFilter) {
      fetchUsers();
    } else {
      setFilteredUsers(users);
    }
  }, [batchFilter, sectionFilter, users]);

  const handleSearch = async () => {
    if (searchQuery.trim() === "") return;

    setIsLoading(true);

    try {
      const response = await axios.get(
        `/api/users/searchUser?query=${searchQuery}`
      );
      setFilteredUsers(response.data.users);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching searched users:", error);
      setIsLoading(false);
    }
  };

  const handleBatchChange = (batch) => {
    setBatchFilter(batchFilter === batch ? null : batch);
  };

  const handleSectionChange = (section) => {
    setSectionFilter(sectionFilter === section ? null : section);
  };

  const changePage = (userId) => {
    router.push(`/profile/${userId}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setBatchFilter(null);
    setSectionFilter(null);
    setSearchQuery("");
    setFilteredUsers(users);
  };

  return (
    <>
      <Navbar />
      <div className="bg-black min-h-screen">
        {/* Hero Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-black"></div>
          <div className="relative max-w-7xl mx-auto px-6 py-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Student <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Directory</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Discover your peers, explore skills, and connect with fellow students
            </p>

            {/* Search Bar */}
            <div className="mt-8 max-w-xl mx-auto">
              <div className="flex items-center bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-full px-5 py-3 focus-within:border-blue-500 transition-colors">
                <FaSearch className="text-gray-500 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search by name or skills..."
                  className="flex-1 bg-transparent text-white outline-none placeholder-gray-500"
                />
                <button
                  onClick={handleSearch}
                  className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-1.5 rounded-full text-sm font-medium transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="mt-6 flex flex-col items-center gap-3">
              <div className="flex flex-wrap justify-center gap-2">
                {["2023-2025", "2024-2026"].map((batch) => (
                  <button
                    key={batch}
                    onClick={() => handleBatchChange(batch)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                      batchFilter === batch
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    Batch {batch}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {["A", "B", "C", "D"].map((section) => (
                  <button
                    key={section}
                    onClick={() => handleSectionChange(section)}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                      sectionFilter === section
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-600/25"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    Section {section}
                  </button>
                ))}
              </div>
              {(batchFilter || sectionFilter || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-400 hover:text-red-300 transition-colors"
                >
                  ✕ Clear All Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-t-3 border-blue-500 border-solid rounded-full animate-spin"></div>
              <p className="text-gray-500 ml-3">Discovering peers...</p>
            </div>
          ) : isDataFetched && filteredUsers.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-gray-500 text-lg">No students found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {filteredUsers.map((usr) => (
                <div
                  key={usr._id}
                  className="group bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col items-center hover:border-gray-600 hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative w-24 h-24 rounded-full mb-4 ring-2 ring-gray-700 group-hover:ring-blue-500 transition-all overflow-hidden">
                    {usr.profile ? (
                      <Image
                        src={usr.profile}
                        alt={usr.userName}
                        fill
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                        {usr.userName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <h3 className="text-white font-semibold text-center text-lg mb-1">
                    {usr.userName}
                  </h3>
                  <p className="text-gray-500 text-sm mb-1">{usr.batch}</p>
                  <p className="text-gray-600 text-xs mb-3">Section {usr.section}</p>

                  {usr.skills?.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1 mb-4">
                      {usr.skills.slice(0, 3).map((skill, i) => (
                        <span
                          key={i}
                          className="bg-gray-800 text-gray-400 text-[10px] px-2 py-0.5 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {usr.skills.length > 3 && (
                        <span className="text-gray-600 text-[10px] px-1">
                          +{usr.skills.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <button
                    onClick={() => changePage(usr._id)}
                    className="mt-auto w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white py-2 rounded-xl text-sm font-medium transition-all"
                  >
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AllProfiles;
