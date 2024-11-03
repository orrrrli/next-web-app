import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        // Obtener el token de autorización
        const token = req.headers.get('authorization')?.split(" ")[1];
        if (!token) {
            console.error("Token no proporcionado");
            return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
        }

        // Verificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const { productId, quantity, price } = await req.json();
        console.log("Parsed request body:", { productId, quantity, price });

        // Validar campos requeridos
        if (!productId || !quantity || !price) {
            console.error("Campos requeridos faltantes");
            return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
        }

        // Buscar o crear el carrito del usuario
        let cart = await prisma.cart.findUnique({
            where: { userId },
        });

        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
            });
            console.log("Nuevo carrito creado:", cart);
        } else {
            console.log("Carrito existente encontrado:", cart);
        }

        // Crear un nuevo item en el carrito
        const cartItem = await prisma.cartItem.create({
            data: {
                cartId: cart.id,
                productId,
                quantity,
                price,
            },
        });
        console.log("Item del carrito creado:", cartItem);

        return NextResponse.json({ message: "Producto agregado al carrito", cartItem });
    } catch (error) {
        console.error("Error en POST /api/cart:", error);
        return NextResponse.json({ error: "Error del servidor", details: error.message }, { status: 500 });
    }
}



export async function GET(req) {
    try {
        // Obtener y verificar el token
        const token = req.headers.get('authorization')?.split(" ")[1];
        if (!token) {
            return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
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
            return NextResponse.json({ message: 'Carrito vacío', items: [] });
        }

        return NextResponse.json({ items: cart.items });
    } catch (error) {
        console.error("Error al obtener los items del carrito:", error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}