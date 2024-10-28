import React from "react";
import RelatedProductCard from "./RelatedProductCard";
import LoadingSpinner from "../loadingSpinner";

export default function RelatedProducts({
    products,
    status,
    currentProductId,
    onAddToCart,
}) {
    if (status === "loading") {
        return (
            <div className="flex justify-center items-center mt-12">
                <LoadingSpinner />
            </div>
        );
    }

    if (status === "failed") {
        return (
            <p className="text-red-500 mt-12 text-center text-lg font-semibold">
                Error al cargar productos relacionados.
            </p>
        );
    }

    const filteredProducts = products.filter((p) => p.id !== currentProductId);

    if (filteredProducts.length === 0) {
        return null;
    }

    return (
        <div className="max-w-screen-lg mx-auto mt-16 px-4">
            <h2 className="text-2xl font-bold text-white mb-8 text-center md:text-left">
                Productos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    <RelatedProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={() => onAddToCart(product)}
                    />
                ))}
            </div>
        </div>
    );
}
