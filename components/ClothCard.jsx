import React from "react";

function ClothCard({ url }) {
  const handleSelect = () => {
  const stored = JSON.parse(localStorage.getItem("selectedCloths")) || [];
  let updated;

  if (stored.includes(url)) {
    updated = stored.filter((c) => c !== url); // remove
  } else {
    updated = [...stored, url]; // add
  }

  localStorage.setItem("selectedCloths", JSON.stringify(updated));
  window.dispatchEvent(new Event("clothsUpdated"));
};


  return (
    <div className="aspect-square bg-white/20 rounded-xl w-42 overflow-hidden" onClick={handleSelect}> 
      <img src={url} alt="" />
    </div>
  );
}

export default ClothCard;


{/* <div className="aspect-square bg-white/20 rounded-xl w-42 overflow-hidden">
      <img src={url} alt="" />
    </div> */}