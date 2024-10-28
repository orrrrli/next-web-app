import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCardCategory({ product }) {
    return (
        <div className="max-w-sm rounded-2xl bg-gray-800 overflow-hidden shadow-lg p-6">
            <div className="relative mb-4 rounded-lg overflow-hidden">
                <Image
                    className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                    src={product.image}
                    alt={product.title}
                    width={500}
                    height={300}
                    loading="lazy"
                />
            </div>
            <div className="p-4">
                <h3 className="font-semibold text-lg text-white mb-2 leading-tight h-12 overflow-hidden line-clamp-2">
                    {product.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed h-10 overflow-hidden line-clamp-2">
                    {product.description.length > 90
                        ? `${product.description.substring(0, 90)}...`
                        : product.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-blue-300 font-bold text-lg mr-4">
                        ${product.price}
                    </span>
                    <Link href={`/product/${product.id}`}>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded-full shadow-md transition-all duration-300 text-sm">
                            Ver producto
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
