import React, { useEffect, useRef } from "react";

import loadingGif from "../../assets/images/powerUserLoading.gif";

const ChatWindowLoading = () => {
  let loadingRef = useRef(null);

  useEffect(() => {
    let loadingTimeoutId;
    if (loadingRef.current) {
      loadingTimeoutId = setTimeout(() => {
        loadingRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }, 10);
    }

    return () => clearTimeout(loadingTimeoutId);
  }, []);
  return (
    <div className="h-full flex justify-center items-center" ref={loadingRef}>
      <img src={loadingGif} alt="loadingGif" className="h-[150px]" />
    </div>
  );
};

export default ChatWindowLoading;
