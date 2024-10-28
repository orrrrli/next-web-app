import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const token = req.headers.get('authorization')?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 401 });
    }

    // Decodificar el token JWT para obtener el ID del usuario
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Obtener los datos del cuerpo de la solicitud
    const { items, totalAmount } = await req.json();

    // Validación de los datos de items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'La lista de items está vacía o es inválida' }, { status: 400 });
    }

    // Validar que cada item tenga productId, quantity y price definidos y válidos
    const invalidItem = items.find(
      item => typeof item.productId !== 'number' || 
              typeof item.quantity !== 'number' || 
              typeof item.price !== 'number'
    );

    if (invalidItem) {
      return NextResponse.json({ error: 'Cada item debe tener productId, quantity y price válidos' }, { status: 400 });
    }

    // Crear la orden en la base de datos
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount: parseFloat(totalAmount),
      },
    });

    // Crear los items de la orden en la tabla OrderItem
    const orderItems = items.map((item) => ({
      orderId: order.id,
      productId: item.productId,
      quantity: item.quantity,
      price: parseFloat(item.price),
    }));

    // Insertar todos los items en la base de datos
    await prisma.orderItem.createMany({
      data: orderItems,
    });

    return NextResponse.json({ message: 'Orden guardada exitosamente', order });
  } catch (error) {
    console.error("Error en el checkout:", error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
