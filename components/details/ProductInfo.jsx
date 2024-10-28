import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "@/store/slices/cartSlices";

export default function ProductInfo({ product }) {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            toast.error(
                "Por favor, inicia sesión para añadir productos al carrito."
            );
            return;
        }

        dispatch(addToCart(product));
        toast.success("Producto añadido al carrito.");
    };

    return (
        <div className="md:w-1/2 flex flex-col justify-between bg-gray-800 p-6 rounded-lg shadow-lg">
            <div>
                <h1 className="text-3xl font-bold text-white mb-4">
                    {product.title}
                </h1>
                <p className="text-sm text-gray-400 mb-2">
                    <span className="font-semibold text-blue-400">
                        Categoría:
                    </span>{" "}
                    {product.category}
                </p>
                <p className="text-md text-gray-300 mb-4 leading-relaxed">
                    {product.description}
                </p>
                <p className="text-3xl font-semibold text-blue-400 mb-6">
                    ${product.price.toFixed(2)}
                </p>
            </div>
            <button
                className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-bold shadow-md w-full mt-4 md:mt-0 transition-all duration-300"
                onClick={handleAddToCart}>
                Añadir al Carrito
            </button>
        </div>
    );
}
