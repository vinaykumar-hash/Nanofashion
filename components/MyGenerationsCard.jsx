import React, { useEffect, useState } from "react";

function MyGenerationsCard({ url }) {

  
  return (
    <div
      className={`w-full aspect-square overflow-hidden cursor-pointer relative transition-all duration-200 `}
    >
      <img
        src={url}
        alt="Generated Creation"
        className="w-40 h-40 object-cover hover:scale-110 transition-all duration-200 "
      />

      
    </div>
  );
}

export default MyGenerationsCard;
