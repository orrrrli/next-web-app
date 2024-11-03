"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BsCart2 } from "react-icons/bs";
import Cart from "./Cart";
import ModalLogout from "./ModalLogout";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "@/store/slices/categorySlices";
import { fetchProductsByCategory } from "@/store/slices/productSlices";
import { logout, checkAuth } from "@/store/slices/authSlice";

export default function Navbar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const dispatch = useDispatch();

    const { isAuthenticated, username } = useSelector((state) => state.auth);
    const cartItems = useSelector((state) => state.cart.items);
    const totalItems = (cartItems || []).reduce(
        (total, item) => total + item.quantity,
        0
    );
    const categories = useSelector((state) => state.categories.items);
    const categoriesStatus = useSelector((state) => state.categories.status);

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        if (categoriesStatus === "idle") {
            dispatch(fetchCategories());
        }
    }, [categoriesStatus, dispatch]);

    const handleCategoryClick = (category) => {
        dispatch(fetchProductsByCategory(category));
    };

    const handleLogout = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        dispatch(logout());
        setShowLogoutConfirm(false);
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <>
            <div
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                    isScrolled ? "bg-gray-900 shadow-lg" : "bg-gray-800"
                }`}>
                <div className="container mx-auto py-4 px-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">
                        <Link href="/" className="hover:text-blue-400">
                            Fake Store
                        </Link>
                    </h1>
                    <div className="flex space-x-6">
                        {categories.map((category) => (
                            <span
                                key={category}
                                onClick={() => handleCategoryClick(category)}
                                className="text-gray-300 hover:text-white transition-colors cursor-pointer">
                                <Link href={`/category/${category}`}>
                                    {category}
                                </Link>
                            </span>
                        ))}
                    </div>

                    <div className="flex space-x-6 items-center">
                        {isAuthenticated && (
                            <Link
                                href="/orders"
                                className="text-gray-300 hover:text-blue-400 transition-colors">
                                Mis Órdenes
                            </Link>
                        )}
                        <button
                            onClick={toggleModal}
                            className="relative text-white hover:text-blue-400 transition-colors">
                            <BsCart2 size={24} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                        {isAuthenticated ? (
                            <>
                                <span className="text-gray-300">{username}</span>
                                <button
                                    onClick={handleLogout}
                                    className="text-gray-300 hover:text-blue-400 transition-colors">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/auth/login"
                                    className="text-gray-300 hover:text-blue-400 transition-colors">
                                    Login
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="text-gray-300 hover:text-blue-400 transition-colors">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <Cart onClose={() => setIsModalOpen(false)} />
                </div>
            )}

            {showLogoutConfirm && (
                <ModalLogout
                    onConfirm={confirmLogout}
                    onCancel={cancelLogout}
                />
            )}
        </>
    );
}
