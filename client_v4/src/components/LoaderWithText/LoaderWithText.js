import React, { useState, useEffect } from "react";
import loadingGif from '../../assets/images/loaderNew.gif';

const LoaderWithText = () => {
  const [loaderText, setLoaderText] = useState(
    "Gathering and cleaning relevant data"
  );
  const loaderTextOpt = [
    "Collecting user-provided details.",
    "Cleaning and organizing data.",
    "Analyzing customer demographics.",
    "Identifying common characteristics.",
    "Formulating initial insights.",
    "Refining insights for accuracy.",
    "Compiling actionable recommendations.",
    "Verifying analysis integrity.",
    "Finalizing your Ideal Customer Profile."
  ];

  useEffect(() => {
    let pos = 0;
    const loaderInterval = setInterval(() => {
      setLoaderText(loaderTextOpt[pos]);
      pos++;
      if (pos >= loaderTextOpt.length) {
        clearInterval(loaderInterval); // Stop the interval after reaching "Finalizing results"
      }
    }, 3000);

    return () => clearInterval(loaderInterval);
  }, []); // Empty dependency array to run only on mount

  return (
    <div className="flex justify-center" style={{ alignItems: "center" }}>
      <img src={loadingGif} alt="loadingGif" className="h-[80px]" />
      <div className="text-base">{loaderText}</div>
    </div>
  );
}

export default LoaderWithText;
