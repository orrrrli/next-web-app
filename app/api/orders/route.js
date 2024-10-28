import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decoded.userId;

        const orders = await prisma.order.findMany({
            where: { userId },
            include: { items: true },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(orders, { status: 200 });
    } catch (error) {
        console.error("Error al obtener órdenes:", error.message, error.stack);
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return NextResponse.json({ error: "Token inválido o expirado" }, { status: 401 });
        }
        return NextResponse.json({ error: "Error al obtener las órdenes del usuario" }, { status: 500 });
    }
}
