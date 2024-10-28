"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const validateForm = () => {
        const errors = {};

        if (!formData.username || formData.username.length < 3) {
            errors.username =
                "El nombre de usuario debe tener al menos 3 caracteres.";
        }
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Por favor, ingresa un correo electrónico válido.";
        }
        if (!formData.password || formData.password.length < 8) {
            errors.password = "La contraseña debe tener al menos 8 caracteres.";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setFieldErrors({
            ...fieldErrors,
            [name]: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const { error } = await response.json();
                setError(error);
                toast.error(error || "Ocurrió un error en el registro.");
            } else {
                setSuccess(true);
                setShowModal(true);
                setFormData({ username: "", email: "", password: "" });
                toast.success("¡Registro exitoso!");
            }
        } catch (error) {
            setError("Ocurrió un error al registrar el usuario.");
            toast.error(
                "Ocurrió un error en el servidor. Inténtalo más tarde."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLoginRedirect = () => {
        setShowModal(false);
        router.push("/auth/login");
    };

    return (
        <div className="min-h-screen bg-gray-900 flex justify-center items-center p-6">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-2xl">
                <h1 className="text-3xl text-white text-center font-bold mb-6">
                    Registro
                </h1>

                <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Nombre de usuario"
                    className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                {fieldErrors.username && (
                    <p className="text-red-500 text-sm mb-4">
                        {fieldErrors.username}
                    </p>
                )}

                <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Correo electrónico"
                    className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                {fieldErrors.email && (
                    <p className="text-red-500 text-sm mb-4">
                        {fieldErrors.email}
                    </p>
                )}

                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Contraseña"
                    className="w-full p-3 mb-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                {fieldErrors.password && (
                    <p className="text-red-500 text-sm mb-4">
                        {fieldErrors.password}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full p-3 font-bold rounded-lg transition-all duration-300 ${
                        loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}>
                    {loading ? "Registrando..." : "Registrarse"}
                </button>

                {error && (
                    <p className="text-red-500 mt-4 text-center">{error}</p>
                )}
                {success && !showModal && (
                    <p className="text-green-500 mt-4 text-center">
                        ¡Registro exitoso!
                    </p>
                )}
            </form>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4 text-white">
                            ¡Registro exitoso!
                        </h2>
                        <p className="mb-6 text-gray-300">
                            ¿Quieres iniciar sesión ahora?
                        </p>
                        <button
                            onClick={handleLoginRedirect}
                            className="w-full p-3 mb-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all duration-300">
                            Sí, iniciar sesión
                        </button>
                        <button
                            onClick={() => setShowModal(false)}
                            className="w-full p-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition-all duration-300">
                            No, gracias
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RegisterPage;
