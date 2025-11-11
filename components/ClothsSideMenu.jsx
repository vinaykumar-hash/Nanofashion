import React, { useEffect, useState } from "react";
import ClothCard from "./ClothCard";
import axios from "axios";

function ClothsSideMenu() {
  const [cloths, setCloths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    const fetchCloths = async () => {
      try {
        setLoading(true);
        const response = await axios.get(import.meta.env.VITE_BACKEND_URL+"/api/gemini/generated-cloths");
        if (response.data.success) setCloths(response.data.cloths);
        else setError("Failed to fetch images");
      } catch (err) {
        console.error("Error fetching cloths:", err);
        setError("Error fetching cloths");
      } finally {
        setLoading(false);
      }
    };
    fetchCloths();
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return alert("Enter a prompt!");
    try {
      setLoading(true);
      const response = await axios.post(import.meta.env.VITE_BACKEND_URL+"/api/gemini/generate-cloth", { prompt });
      if (response.data.success) {
        setLoading(false);
        setCloths((prev) => [response.data, ...prev]);
        setPrompt("");
        await fetchCloths();
      }
    } catch (error) {
      console.error("Error generating cloth:", error);
      alert("Error generating cloth");
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {loading ? <div className="absolute h-full w-full bg-white/10 backdrop-blur-3xl z-10 flex justify-center items-center">
        <div className="h-10 w-10 bg-white animate-spin"></div>
      </div> : null}
      <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide">
        <h2 className="text-sm font-semibold mb-2 text-gray-200">
          Community Picks
        </h2>

        <div className="grid grid-cols-2">
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : error ? (
            <p className="text-red-400">{error}</p>
          ) : cloths.length === 0 ? (
            <p className="text-gray-400">No generated outfits yet.</p>
          ) : (
            cloths.map((cloth) => (
              <ClothCard key={cloth.id} url={cloth.image_url} />
            ))
          )}
        </div>
      </div>

      <div className="p-4 border-t border-white/10 bg-[#1a1a1a]">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your outfit..."
          className="w-full px-4 p-3 bg-white/10 text-white rounded-t-md translate-y-1 outline-none placeholder-gray-400"
        />

        <button
          onClick={handleGenerate}
          className="w-full text-lg py-2 bg-primary-tint text-black font-kollektif font-bold rounded-lg transition"
        >
          Generate
        </button>
      </div>
    </div>
  );
}

export default ClothsSideMenu;
