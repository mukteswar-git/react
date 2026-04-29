import React, { forwardRef } from "react";

const ImageCard = React.memo(
  forwardRef(function ImageCard({ src, alt }, ref) {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className="w-full aspect-square object-cover rounded-2xl"
        loading="lazy"
      />
    );
  }),
);

export default ImageCard;
