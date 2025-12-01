import React, { useEffect, useState } from "react";
import axios from "axios";

function Artstyle() {
  const [styles, setStyles] = useState([]);
  const [selected, setSelected] = useState(
    localStorage.getItem("selectedArtstyle") || ""
  );

  // Fetch list of artstyles on mount
  useEffect(() => {
    const fetchStyles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/gemini/artstyles");
        setStyles(res.data.styles || []);
      } catch (err) {
        console.error("Error fetching artstyles:", err);
      }
    };

    fetchStyles();
  }, []);

  const handleSelect = async (name) => {
    try {
      setSelected(name);
      localStorage.setItem("selectedArtstyle", name);

      const res = await axios.get(
        `http://localhost:5000/api/gemini/artstyles/${encodeURIComponent(name)}`
      );

      const prompt = res.data.prompt;

      localStorage.setItem("selectedArtstylePrompt", prompt);

    } catch (err) {
      console.error("Error fetching prompt:", err);
    }
  };

  return (
    <div className="ml-4 rounded-lg max-h-80 overflow-y-scroll scrollbar-hide bg-black/40 border border-white/10 backdrop-blur-2xl">
      <ul className="cursor-pointer font-fustat font-bold tracking-tight flex flex-col gap-1">
        {styles.map((style, index) => (
          <li
            key={index}
            onClick={() => handleSelect(style.name)}
            className={`px-4 py-2 hover:bg-primary-dark ${
              selected === style.name
                ? "bg-black text-white"
                : "text-gray-200"
            }`}
          >
            {style.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Artstyle;
