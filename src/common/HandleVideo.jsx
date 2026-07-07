import { IconPlayerPlayFilled } from "@tabler/icons-react";
import React, { useState } from "react";
import LazyImage from "./ImageFallback";
import { resolveMediaUrl } from "../util/config";

const HandleVideo = ({ thumbnail, videoUrl }) => {
  const [show, setShow] = useState(false);
  return (
    <>
      {show ? (
        <>
          <video
            controls
            width="150px"
            height="100px"
            style={{ borderRadius: "5px" }}
            src={resolveMediaUrl(videoUrl)}
          />
        </>
      ) : (
        <div
          style={{
            position: "relative",
            width: "150px",
            height: "100px",
            cursor : "pointer"
          }}
          onClick={() => {
            setShow(true);
          }}
        >
          <IconPlayerPlayFilled
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)", // centers it
              zIndex: 1,
              fontSize: "24px", // adjust size as needed
              color: "white", // optional: make it visible
            }}
          />
          <LazyImage
            imageSrc={thumbnail}
            width="150px"
            height="100px"
            style={{ filter: "brightness(0.5)" }}
          />
        </div>
      )}
    </>
  );
};

export default HandleVideo;
