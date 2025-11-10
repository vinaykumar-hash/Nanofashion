import React, { useState, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react"; // install with: npm i lucide-react
import SelectedCloths from "./SelectedCloth";
function Main() {
  const [avatar, setAvatar] = useState(localStorage.getItem("userAvatar") || "");
  const [cloths, setCloths] = useState([]);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const storedCloths = JSON.parse(localStorage.getItem("selectedCloths")) || [];
    setCloths(storedCloths);
  }, []);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        localStorage.setItem("userAvatar", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    document.getElementById("avatarUpload").click();
  };

  const handleDelete = () => {
    setAvatar("");
    localStorage.removeItem("userAvatar");
  };

  return (
    <div className="m-4  text-white flex flex-col items-start justify-start gap-4 px-4 w-full">
      <h1 className="text-xl  mb-2">Let's Start Fresh Today</h1>

      {/* Avatar + Cloths Section */}
      <div className="flex gap-6 w-full max-w-5xl flex-col sm:flex-row">
        {/* Avatar Section */}
        <div className="flex flex-col items-center w-full sm:w-60 rounded-lg overflow-hidden relative">
          <div
            className="relative w-60 h-60 bg-white/10  overflow-hidden flex items-center justify-center"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            {avatar ? (
              <>
                <img
                  src={avatar}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
                {hovering && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-4 transition-all">
                    <button
                      onClick={handleEdit}
                      className="bg-primary hover:bg-primary p-2 rounded-full"
                      title="Edit Avatar"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="bg-primary-tint hover:bg-primary-tint/80 p-2 rounded-full"
                      title="Delete Avatar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <label className="text-gray-400 cursor-pointer text-sm text-center">
                <input
                  id="avatarUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
                Click to upload Avatar
              </label>
            )}
          </div>

          <div className="absolute bottom-0 bg-blue-900/0 w-full py-2 rounded-b-xl text-center text-sm mt-[-4px]">
            Your Avatar
          </div>
        </div>

        {/* Cloths Selection Display */}
        <SelectedCloths />

      </div>

      {/* Input + Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-5xl mt-4">
        <input
          type="text"
          placeholder="Describe your expectations.."
          className="flex-1 bg-transparent border border-gray-700 rounded-md px-4 flex-wrap  placeholder-gray-500 focus:outline-none"
        />
        <div className="flex gap-2 flex-col">
          
          <button className="bg-primary text-white font-medium px-6 py-2 rounded-md w-full sm:w-auto">
            Enhance Prompt
          </button>
          <button className="bg-primary-tint text-black font-bold text-xl tracking-tight px-6 py-2 rounded-md w-full sm:w-auto">
            Generate
          </button>
        </div>
      </div>

      {/* Hidden input for edit */}
      <input
        id="avatarUpload"
        type="file"
        accept="image/*"
        onChange={handleAvatarUpload}
        className="hidden"
      />
    </div>
  );
}

export default Main;
