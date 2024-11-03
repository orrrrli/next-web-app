import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function PATCH(req, { params }) {
    try {
        const { productId } = params;
        const { quantity } = await req.json();
        const token = req.headers.get('authorization')?.split(" ")[1];

        if (!token) {
            return new Response(JSON.stringify({ error: 'Token no proporcionado' }), { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: true },
        });

        if (!cart) {
            return new Response(JSON.stringify({ error: "Carrito no encontrado" }), { status: 404 });
        }

        const updatedItem = await prisma.cartItem.updateMany({
            where: {
                cartId: cart.id,
                productId: parseInt(productId, 10),
            },
            data: { quantity },
        });

        return new Response(JSON.stringify({ message: 'Cantidad actualizada', item: updatedItem }), { status: 200 });
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto:", error);
        return new Response(JSON.stringify({ error: "Error del servidor" }), { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { productId } = params;
        const token = req.headers.get('authorization')?.split(" ")[1];
        
        if (!token) {
            return new Response(JSON.stringify({ error: 'Token no proporcionado' }), { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: true },
        });

        if (!cart) {
            return new Response(JSON.stringify({ error: "Carrito no encontrado" }), { status: 404 });
        }

        await prisma.cartItem.deleteMany({
            where: {
                cartId: cart.id,
                productId: parseInt(productId, 10),
            },
        });

        return new Response(JSON.stringify({ message: 'Producto eliminado del carrito' }), { status: 200 });
    } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
        return new Response(JSON.stringify({ error: "Error del servidor" }), { status: 500 });
    }
}

export async function GET(req) {
    try {
        // Obtener y verificar el token de autorización
        const token = req.headers.get('authorization')?.split(" ")[1];
        if (!token) {
            return new Response(JSON.stringify({ error: 'Token no proporcionado' }), { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Buscar el carrito del usuario y obtener los items
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: true, // Incluye los items del carrito
            },
        });

        if (!cart) {
            return new Response(JSON.stringify({ message: 'Carrito vacío', items: [] }), { status: 200 });
        }

        return new Response(JSON.stringify({ items: cart.items }), { status: 200 });
    } catch (error) {
        console.error("Error al obtener los items del carrito:", error);
        return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
    }
}

export async function POST(req) {
    try {
        const { productId, quantity, price } = await req.json();
        const token = req.headers.get('authorization')?.split(" ")[1];

        if (!token) {
            return new Response(JSON.stringify({ error: 'Token no proporcionado' }), { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Buscar el carrito del usuario
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: true },
        });

        if (!cart) {
            return new Response(JSON.stringify({ error: "Carrito no encontrado" }), { status: 404 });
        }

        // Buscar si el item ya existe en el carrito
        const existingItem = cart.items.find((item) => item.productId === productId);

        if (existingItem) {
            // Si ya existe, actualizar la cantidad
            const updatedItem = await prisma.cartItem.updateMany({
                where: {
                    cartId: cart.id,
                    productId,
                },
                data: {
                    quantity: {
                        increment: quantity,
                    },
                },
            });

            return new Response(JSON.stringify({ message: 'Cantidad actualizada', item: updatedItem }), { status: 200 });
        }

        // Si no existe, añadir un nuevo item al carrito
        const newItem = await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                quantity,
                price,
            },
        });

        return new Response(JSON.stringify({ message: 'Producto añadido al carrito', item: newItem }), { status: 201 });
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error);
        return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
    }
}