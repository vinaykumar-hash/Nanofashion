import React, { useState } from "react";
import { supabase } from "../supaBase";

export default function SetupProfile() {
  const avatars = [
    "/src/assets/Profile/Profile.png",
    "/src/assets/Profile/Profile.png",
    "/src/assets/Profile/Profile.png",
    "/src/assets/Profile/Profile.png",
    "/src/assets/Profile/Profile.png",
  ];

  const [selected, setSelected] = useState(2); // Default middle avatar
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name) {
      alert("Please enter your name");
      return;
    }

    setLoading(true);

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("No user found!");
      setLoading(false);
      return;
    }

    // Update profile data in 'profiles' table
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: name,
        avatar_url: avatars[selected],
      })
      .eq("id", user.id);

    if (error) {
      console.error(error);
      alert("Error saving profile");
    } else {
      alert("Profile setup complete!");
      // You can redirect to dashboard here, e.g.:
      // navigate("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#111] text-white font-kollektif">
      <h2 className="text-2xl font-bold mb-8">Setup Your Avatar</h2>

      {/* Avatar Selection */}
      <div className="flex items-center justify-center gap-6 mb-8">
        {avatars.map((avatar, index) => (
          <button
            key={index}
            onClick={() => setSelected(index)}
            className={`rounded-full p-[4px] transition-all duration-300 ${
              selected === index
                ? "border-2 border-pink-400 scale-110"
                : "opacity-60 hover:opacity-100"
            }`}
          >
            <img
              src={avatar}
              alt={`Avatar ${index + 1}`}
              className="w-24 h-24 rounded-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Name Input */}
      <input
        type="text"
        placeholder="NAME"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-[#1a1a1a] text-center text-gray-200 w-60 py-2 rounded-md outline-none border border-gray-700 focus:border-pink-400 placeholder-gray-500 tracking-wide uppercase"
      />

      {/* Continue Button */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="mt-8 w-12 h-12 rounded-full bg-pink-400 text-black flex items-center justify-center hover:bg-pink-500 transition disabled:opacity-50"
      >
        {loading ? "..." : "➜"}
      </button>
    </div>
  );
}
