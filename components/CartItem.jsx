import React from "react";
import { toast } from "react-toastify";

export default function CartItem({ item, onIncrement, onDecrement, onRemove }) {
    const handleRemove = () => {
        onRemove();
        toast.info("Producto eliminado del carrito.");
    };

    return (
        <li className="flex justify-between items-center py-4 border-b border-gray-700">
            <div className="flex items-center">
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-14 object-cover rounded-lg"
                />
                <div className="ml-4">
                    <p className="text-white font-semibold">{item.title}</p>
                    <p className="text-gray-400">{`$${item.price.toFixed(2)}`}</p>
                </div>
            </div>
            <div className="flex items-center space-x-3">
                <button
                    onClick={onDecrement}
                    className="text-white bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded-full transition duration-300 ease-in-out">
                    -
                </button>
                <p className="text-base font-medium text-white">{item.quantity}</p>
                <button
                    onClick={onIncrement}
                    className="text-white bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded-full transition duration-300 ease-in-out">
                    +
                </button>
                <button
                    onClick={handleRemove}
                    className="text-red-500 hover:text-red-700 transition duration-300 ease-in-out ml-2">
                    🗑️
                </button>
            </div>
        </li>
    );
}
