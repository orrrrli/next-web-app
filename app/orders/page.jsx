"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/loadingSpinner";

function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState("loading");
    const router = useRouter();

    // Función para obtener los detalles del producto desde la API de FakeStore
    const fetchProductDetails = async (productId) => {
        const response = await fetch(`https://fakestoreapi.com/products/${productId}`);
        if (!response.ok) {
            throw new Error("Error al obtener detalles del producto.");
        }
        return response.json();
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    toast.error("Por favor inicia sesión para ver tus órdenes.");
                    router.push("/auth/login");
                    return;
                }

                const response = await fetch("/api/orders", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Error al cargar las órdenes.");
                }

                const data = await response.json();

                // Enriquecer cada artículo en las órdenes con los detalles de FakeStore
                const enrichedOrders = await Promise.all(
                    data.map(async (order) => {
                        const enrichedItems = await Promise.all(
                            order.items.map(async (item) => {
                                const productDetails = await fetchProductDetails(item.productId);
                                return {
                                    ...item,
                                    title: productDetails.title,
                                    image: productDetails.image,
                                    description: productDetails.description,
                                };
                            })
                        );
                        return { ...order, items: enrichedItems };
                    })
                );

                setOrders(enrichedOrders);
                setStatus("succeeded");
            } catch (error) {
                toast.error("Ocurrió un error al cargar las órdenes.");
                setStatus("failed");
            }
        };

        fetchOrders();
    }, [router]);

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <LoadingSpinner />
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-900">
                <p className="text-red-500 text-lg">No se pudieron cargar tus órdenes.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <h1 className="text-3xl font-bold text-center text-blue-400 mb-8">Mis Órdenes</h1>

            {orders.length === 0 ? (
                <p className="text-center text-gray-300 text-lg">
                    No tienes órdenes realizadas.
                </p>
            ) : (
                <div className="max-w-4xl mx-auto space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-gray-800 p-6 rounded-lg shadow-lg">
                            <h2 className="text-2xl font-semibold text-blue-300 mb-4">
                                Orden #{order.id}
                            </h2>
                            <p className="text-gray-400 mb-2">
                                Estado:{" "}
                                <span className="text-white font-medium">{order.status}</span>
                            </p>
                            <p className="text-gray-400 mb-4">
                                Total:{" "}
                                <span className="text-white font-semibold">${order.totalAmount}</span>
                            </p>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between items-start p-3 bg-gray-700 rounded-md"
                                    >
                                        <div className="flex items-start space-x-4">
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-16 h-16 object-cover rounded-lg"
                                            />
                                            <div>
                                                <p className="text-white font-medium">
                                                    {item.title}
                                                </p>
                                                <p className="text-gray-400 text-sm">
                                                    Cantidad: {item.quantity}
                                                </p>
                                                <p className="text-gray-300 text-sm">
                                                    Descripción: {item.description}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-gray-300 font-medium">
                                            ${item.price.toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OrdersPage;
