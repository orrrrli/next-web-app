import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // Buscar al usuario por email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Validar si el usuario existe y la contraseña es correcta
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ error: 'Credenciales incorrectas' }, { status: 401 });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET, // Verifica que JWT_SECRET esté definido en tu archivo .env
      { expiresIn: '1h' }
    );

    return NextResponse.json({ message: 'Login exitoso', token });
  } catch (error) {
    console.error("Error en el login:", error.message); // Añade detalles del error en el log
    return NextResponse.json({ error: 'Error interno del servidor', details: error.message }, { status: 500 });
  }
}
