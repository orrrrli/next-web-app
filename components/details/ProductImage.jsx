import React from "react";

export default function ProductImage({ image, title }) {
    return (
        <div className="md:w-1/2 flex justify-center mb-6 md:mb-0">
            <img
                src={image}
                alt={title}
                className="w-full h-full max-h-[500px] object-contain rounded-lg"
            />
        </div>
    );
}
