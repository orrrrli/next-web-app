"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/authSlice";
import { toast } from "react-toastify";

function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const router = useRouter();
    const dispatch = useDispatch();

    const validateForm = () => {
        const errors = {};

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

        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const { error } = await response.json();
                setError(error);
                toast.error("Credenciales incorrectas. Inténtalo de nuevo.");
            } else {
                const data = await response.json();
                const token = data.token;

                localStorage.setItem("token", token);

                dispatch(login(token));

                toast.success("Inicio de sesión exitoso. Bienvenido!");
                router.push("/");
            }
        } catch (error) {
            setError("Ocurrió un error al iniciar sesión.");
            toast.error("Error en el servidor. Inténtalo más tarde.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex justify-center items-center p-6">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-2xl">
                <h1 className="text-3xl text-white text-center font-bold mb-6">
                    Iniciar sesión
                </h1>

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
                    {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>

                {error && (
                    <p className="text-red-500 mt-4 text-center">{error}</p>
                )}
            </form>
        </div>
    );
}

export default LoginPage;
