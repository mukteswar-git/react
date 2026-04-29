import React, { forwardRef } from "react";

const ImageCard = React.memo(
  forwardRef(function ImageCard({ src, alt }, ref) {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className="w-full rounded-2xl mb-4 break-inside-avoid"
        loading="lazy"
      />
    );
  }),
);

export default ImageCard;
