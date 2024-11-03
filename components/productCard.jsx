import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { addToCart } from "@/store/slices/cartSlices";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

export default function ProductCard({ product }) {
    const dispatch = useDispatch();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const cartItems = useSelector((state) => state.cart.items || []);
    console.log("Cart items:", cartItems);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.info("Please log in to add products to the cart.");
            router.push("/auth/login");
            return;
        }
    
        setIsLoading(true);
        setTimeout(() => {
            dispatch(addToCart(product));
            setIsLoading(false);
            toast.success("Product added to cart!");
        }, 1000);
    };
    

    return (
        <div className="max-w-sm rounded-2xl overflow-hidden shadow-lg bg-gray-800 relative cursor-pointer">
            {/* Image Container with Hover Effect */}
            <div className="relative group rounded-t-2xl overflow-hidden">
                <Image
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    src={product.image}
                    alt={product.title}
                    width={500}
                    height={300}
                    loading="lazy"
                />
                {/* Description and "Show Product" Button: Visible on Hover */}
                <div className="absolute inset-0 bg-gray-900 bg-opacity-70 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-gray-300 text-sm mb-6 text-center">
                        {product.description.length > 100
                            ? `${product.description.substring(0, 100)}...`
                            : product.description}
                    </p>
                    <Link
                        href={`/product/${product.id}`}
                        className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-2xl text-center">
                        Show Product
                    </Link>
                </div>
            </div>
            {/* Basic Info: Always Visible */}
            <div className="p-4 flex flex-col items-center">
                <h2 className="font-semibold text-xl text-white mb-2 text-center h-12 overflow-hidden line-clamp-2">
                    {product.title}
                </h2>
                <span className="text-blue-300 font-bold text-lg mb-4">
                    ${product.price}
                </span>
                <button
                    onClick={handleAddToCart}
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-2xl ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}>
                    {isLoading ? (
                        <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full"></div>
                    ) : (
                        "Add to Cart"
                    )}
                </button>
            </div>
        </div>
    );
}
