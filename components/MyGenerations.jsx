import React, { useEffect, useState } from "react";
import MyGenerationsCard from "./MyGenerationsCard";
import axios from "axios";

function MyGenerations() {
  const [cloths, setCloths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const profileId = localStorage.getItem("ProfileID");

  useEffect(() => {
    const fetchCloths = async () => {
      if (!profileId) {
        setError("Profile ID not found in localStorage.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/gemini/generated-images/${profileId}`
        );

        if (response.data.success) {
          setCloths(response.data.cloths);
        } else {
          setError("Failed to fetch your images");
        }
      } catch (err) {
        console.error("Error fetching creations:", err);
        setError("Error fetching creations");
      } finally {
        setLoading(false);
      }
    };

    fetchCloths();
  }, [profileId]);

  return (
    <div className="flex flex-col h-full relative">
      {loading && (
        <div className="absolute h-full w-full bg-white/10 backdrop-blur-3xl z-10 flex justify-center items-center">
          <div className="h-10 w-10 bg-white animate-spin rounded-full"></div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide">
        <h2 className="text-sm font-semibold mb-2 text-gray-200">
          My Creations
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {error ? (
            <p className="text-red-400">{error}</p>
          ) : cloths.length === 0 ? (
            <p className="text-gray-400">No generated creations yet.</p>
          ) : (
            cloths.map((cloth) => (
              <MyGenerationsCard key={cloth.id} url={cloth.image_url} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default MyGenerations;
