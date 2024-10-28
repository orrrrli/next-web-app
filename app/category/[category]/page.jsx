"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByCategory } from "@/store/slices/productSlices";
import ProductCardCategory from "@/components/ProductCardCategory";
import LoadingSpinner from "@/components/loadingSpinner";
import { toast } from "react-toastify";

export default function CategoryPage({ params }) {
    const { category } = params;
    const dispatch = useDispatch();

    const { filteredItems, categoryStatus, error } = useSelector(
        (state) => state.products
    );

    useEffect(() => {
        if (category) {
            dispatch(fetchProductsByCategory(category));
        }
    }, [category, dispatch]);

    useEffect(() => {
        if (categoryStatus === "failed") {
            toast.error("Error al cargar los productos de esta categoría.");
        }
    }, [categoryStatus]);

    if (categoryStatus === "loading") {
        return (
            <LoadingScreen message={`Cargando productos para ${category}...`} />
        );
    }

    if (categoryStatus === "failed") {
        return <ErrorMessage message={error} />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="max-w-screen-2xl mx-auto p-8">
                <h1 className="text-4xl font-extrabold text-blue-400 mb-10 capitalize text-center">
                    Categoría: {category}
                </h1>
                {filteredItems.length === 0 ? (
                    <p className="text-gray-400 text-center text-xl mt-10">
                        No se encontraron productos en esta categoría.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredItems.map((product) => (
                            <ProductCardCategory
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function LoadingScreen({ message }) {
    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-900">
            <LoadingSpinner />
            <p className="text-gray-300 text-lg mt-4">{message}</p>
        </div>
    );
}

function ErrorMessage({ message }) {
    return (
        <div className="flex justify-center items-center h-screen bg-gray-900">
            <p className="text-red-500 text-2xl font-semibold">{message}</p>
        </div>
    );
}
