import React from "react";

const ConversionRate = ({ rate, type }) => {
  return (
    <div
      style={{
        width: "60px",
        height: "20px",
        backgroundColor: "rgba(209, 213, 219, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "10px",
        position: "absolute",
        bottom: type === "rate" ? "-5rem" : "-7rem",
        left: "125%",
        transform: "translateX(-50%)",
      }}
    >
      {`${rate}${type === "rate" ? "%" : ""}`}
    </div>
  );
};

export default ConversionRate;
