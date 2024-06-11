import React from "react";

const MiddleLine = ({ index }) => {
  return (
    <div
      style={{
        width: index === 2 || index === 5 ? "278%" : "140%",
        height: "2px",
        backgroundColor: "transparent",
        borderBottom: "2px dotted #000",
        position: "absolute",
        top: "-3.5rem",
        left: "50%",
      }}
    />
  );
};

export default MiddleLine;
