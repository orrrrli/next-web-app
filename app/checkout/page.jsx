"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { clearCart } from "@/store/slices/cartSlices";

const Checkout = () => {
    const cartItems = useSelector((state) => state.cart.items);
    const totalAmount = cartItems
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2);
    const router = useRouter();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        paymentMethod: "paypal", // Fijamos PayPal como el único método de pago
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name) errors.name = "Por favor, ingresa tu nombre.";
        if (!formData.address)
            errors.address = "Por favor, ingresa tu dirección.";

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setError("");
      
        if (!validateForm()) return;
      
        setIsLoading(true);
      
        // Convertir `id` a `productId` en los items antes de enviarlos
        const itemsWithProductId = cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        }));
      
        try {
          const token = localStorage.getItem("token");
          const response = await fetch("/api/checkout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              items: itemsWithProductId,
              totalAmount,
              name: formData.name,
              address: formData.address,
              paymentMethod: formData.paymentMethod,
            }),
          });
      
          if (!response.ok) {
            const { error } = await response.json();
            setError(error || "Error al procesar el pago.");
          } else {
            localStorage.setItem(
              "orderSummary",
              JSON.stringify({
                items: itemsWithProductId,
                totalAmount,
                name: formData.name,
                address: formData.address,
                paymentMethod: formData.paymentMethod,
              })
            );
      
            dispatch(clearCart());
            router.push("/thank-you");
          }
        } catch (err) {
          setError("Hubo un error al procesar el pago. Inténtalo de nuevo.");
        } finally {
          setIsLoading(false);
        }
      };
      

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
            <div className="w-full max-w-3xl bg-gray-800 text-white shadow-lg rounded-lg p-8">
                <h2 className="text-3xl font-semibold mb-6">Resumen de la Orden</h2>
                <ul className="divide-y divide-gray-700 mb-6">
                    {cartItems.map((item) => (
                        <li
                            key={item.id}
                            className="flex items-center py-4 space-x-4">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                                <h4 className="text-lg font-medium">
                                    {item.title}
                                </h4>
                                <p className="text-gray-400">
                                    {item.quantity} x ${item.price.toFixed(2)}
                                </p>
                            </div>
                            <div className="text-lg font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-between items-center border-t border-gray-700 pt-4 mb-8">
                    <span className="text-xl font-semibold">Total:</span>
                    <span className="text-xl font-semibold text-blue-400">
                        ${totalAmount}
                    </span>
                </div>

                <h3 className="text-2xl font-semibold mb-4">
                    Información de Envío y Pago
                </h3>
                <form onSubmit={handleCheckout} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre completo"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        required
                    />
                    {fieldErrors.name && (
                        <p className="text-red-500 text-sm">
                            {fieldErrors.name}
                        </p>
                    )}

                    <input
                        type="text"
                        name="address"
                        placeholder="Dirección de envío"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                        required
                    />
                    {fieldErrors.address && (
                        <p className="text-red-500 text-sm">
                            {fieldErrors.address}
                        </p>
                    )}

                    <input
                        type="text"
                        value="PayPal"
                        readOnly
                        className="w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-white cursor-not-allowed"
                    />

                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error}
                        </p>
                    )}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-4 rounded-lg font-semibold text-white ${
                            isLoading
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        } transition duration-300`}>
                        {isLoading ? "Procesando..." : "Realizar Pago"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
