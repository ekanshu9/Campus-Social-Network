import React, { useEffect, useState } from "react";

const CommunityStudent = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await fetch("/api/getAllCommunities");
        const data = await response.json();

        if (data.success) {
          setCommunities(data.data);
        } else {
          setError(data.message || "Failed to fetch communities.");
        }
      } catch (err) {
        setError("An error occurred while fetching communities.");
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Communities</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {communities.map((community) => (
          <div
            key={community._id}
            className="border rounded-lg shadow-md p-4 flex flex-col justify-between"
          >
            <h2 className="text-lg font-semibold mb-2">{community.name}</h2>
            <p className="text-gray-700 mb-4">{community.about}</p>
            <p className="text-white mb-4">{community.ownerName}</p>
            <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Learn More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityStudent;
