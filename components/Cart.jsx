import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
    fetchCartItems,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
} from "@/store/slices/cartSlices";
import CartItem from "@/components/CartItem";
import LoadingSpinner from "@/components/loadingSpinner";

export default function Cart({ onClose }) {
    const dispatch = useDispatch();
    const { items: cartItems, status, error } = useSelector((state) => state.cart);
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const cartRef = useRef(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchCartItems());
    }, [dispatch]);

    useEffect(() => {
        setIsVisible(true);
        const handleClickOutside = (event) => {
            if (cartRef.current && !cartRef.current.contains(event.target)) {
                handleClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleCheckoutClick = () => {
        if (cartItems.length > 0) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                handleClose();
                router.push("/checkout");
            }, 1000);
        }
    };

    const totalAmount = cartItems
        .reduce((total, item) => total + item.price * item.quantity, 0)
        .toFixed(2);

    const handleIncrement = (item) => {
        dispatch(incrementQuantity(item.productId));
    };

    const handleDecrement = (item) => {
        dispatch(decrementQuantity(item.productId));
    };

    const handleRemove = (productId) => {
        dispatch(removeFromCart(productId));
    };

    return (
        <div
            className={`fixed inset-0 flex justify-end z-50 transition-transform transform ${
                isVisible ? "translate-x-0" : "translate-x-full"
            } duration-300 ease-in-out bg-black bg-opacity-60`}>
            <div
                ref={cartRef}
                className="bg-gray-800 shadow-2xl w-[320px] max-w-full h-screen m-4 rounded-lg overflow-hidden flex flex-col relative pb-6">
                
                {status === 'loading' && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
                        <LoadingSpinner />
                    </div>
                )}
                {status === 'failed' && <p>Error: {error}</p>}
                
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">
                        Shopping Cart
                    </h2>
                    <button
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        onClick={handleClose}>
                        ✕
                    </button>
                </div>
                <div className="p-4 flex-1 overflow-auto">
                    {cartItems.length === 0 ? (
                        <p className="text-gray-400">Your cart is empty.</p>
                    ) : (
                        <ul className="space-y-4">
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item.productId}
                                    item={item}
                                    onIncrement={() => handleIncrement(item)}
                                    onDecrement={() => handleDecrement(item)}
                                    onRemove={() => handleRemove(item.productId)}
                                />
                            ))}
                        </ul>
                    )}
                </div>
                {cartItems.length > 0 && (
                    <div className="p-4 border-t border-gray-700 pb-6">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-medium text-white">
                                Total
                            </span>
                            <span className="text-lg font-medium text-white">
                                ${totalAmount}
                            </span>
                        </div>
                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300"
                            onClick={handleCheckoutClick}
                            disabled={loading}>
                            {loading ? "Processing..." : "Checkout"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
