import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function PATCH(req, { params }) {
    try {
        const { productId } = params;
        const { quantity } = await req.json();
        const token = req.headers.get('authorization')?.split(" ")[1];

        if (!token) {
            return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Buscar el carrito del usuario y actualizar la cantidad del item
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: true },
        });

        if (!cart) {
            return NextResponse.json({ error: "Carrito no encontrado" }, { status: 404 });
        }

        const updatedItem = await prisma.cartItem.updateMany({
            where: {
                cartId: cart.id,
                productId: parseInt(productId, 10),
            },
            data: { quantity },
        });

        return NextResponse.json({ message: 'Cantidad actualizada', item: updatedItem });
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto:", error);
        return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const { productId } = params;
        const token = req.headers.get('authorization')?.split(" ")[1];
        
        if (!token) {
            return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        // Buscar el carrito del usuario y eliminar el item
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: true },
        });

        if (!cart) {
            return NextResponse.json({ error: "Carrito no encontrado" }, { status: 404 });
        }

        await prisma.cartItem.deleteMany({
            where: {
                cartId: cart.id,
                productId: parseInt(productId, 10),
            },
        });

        return NextResponse.json({ message: 'Producto eliminado del carrito' });
    } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
        return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
    }
}
