"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProductById,
    fetchRelatedProducts,
    resetProductDetail,
} from "@/store/slices/productDetailSlice";
import { addToCart } from "@/store/slices/cartSlices";
import ProductImage from "@/components/details/ProductImage";
import ProductInfo from "@/components/details/ProductInfo";
import RelatedProducts from "@/components/details/RelatedProducts";
import LoadingSpinner from "@/components/loadingSpinner";

export default function ProductDetail({ params }) {
    const dispatch = useDispatch();
    const { id } = params;

    const { product, relatedProducts, status, relatedStatus, error } =
        useSelector((state) => state.productDetail);

    useEffect(() => {
        dispatch(resetProductDetail());
        dispatch(fetchProductById(id));
    }, [id, dispatch]);

    useEffect(() => {
        if (product?.category) {
            dispatch(fetchRelatedProducts(product.category));
        }
    }, [product?.category, dispatch]);

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500 text-lg">Producto no encontrado.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary p-6">
            <div className="max-w-screen-lg mx-auto bg-tercery rounded-lg shadow-lg p-6 md:flex gap-10">
                <ProductImage image={product.image} title={product.title} />
                <ProductInfo
                    product={product}
                    onAddToCart={() => dispatch(addToCart(product))}
                />
            </div>

            <RelatedProducts
                products={relatedProducts}
                status={relatedStatus}
                currentProductId={product.id}
                onAddToCart={(relatedProduct) =>
                    dispatch(addToCart(relatedProduct))
                }
            />
        </div>
    );
}
