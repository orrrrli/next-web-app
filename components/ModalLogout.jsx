import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ModalLogout({ onConfirm, onCancel }) {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onCancel, 300);
    };

    const handleConfirmLogout = () => {
        onConfirm();
        toast.success("Has cerrado sesión correctamente.");
    };

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300 ${
                isVisible ? "modal-overlay-fade-in" : "modal-overlay-fade-out"
            }`}>
            <div
                className={`bg-gray-800 p-8 rounded-lg shadow-2xl text-center max-w-sm w-full transform transition-transform duration-300 ${
                    isVisible ? "scale-100" : "scale-90"
                }`}>
                <h2 className="text-2xl font-bold mb-4 text-white">
                    ¿Cerrar sesión?
                </h2>
                <p className="mb-6 text-gray-300">
                    ¿Estás seguro de que deseas cerrar sesión?
                </p>
                <button
                    onClick={handleConfirmLogout}
                    className="w-full p-3 mb-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-300">
                    Sí, cerrar sesión
                </button>
                <button
                    onClick={handleClose}
                    className="w-full p-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all duration-300">
                    Cancelar
                </button>
            </div>
        </div>
    );
}
