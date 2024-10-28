import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const prisma = new PrismaClient();

const userSchema = z.object({
  email: z.string().email("El email no es válido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres"),
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password, username } = userSchema.parse(body);

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'El usuario o el email ya existe' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });

    return NextResponse.json(newUser, { status: 201 });

  } catch (error) {
    console.error("Error en el registro:", error);

    // Manejar errores de validación de Zod
    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map((err) => err.message);
      return NextResponse.json({ error: 'Error de validación', details: validationErrors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 });
  }
}
