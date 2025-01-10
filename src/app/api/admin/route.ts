import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = "your-secret-key"; // Replace with a secure key
const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { name, password } = await req.json();
    console.log("Received data:", { name, password });

    if (!name || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const user = await prisma.admins.findUnique({
      where: { name },
    });
    console.log("User found:", user);

    if (!user) {
      return NextResponse.json({ error: "Invalid name or password" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid name or password" }, { status: 401 });
    }

    if (!user.id || !user.name || !user.role) {
      return NextResponse.json({ error: "User data is incomplete" }, { status: 500 });
    }

    const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

    return NextResponse.json({ token, role: user.role });
  } catch (err) {
    console.error("Error processing request:", err);
    return NextResponse.json({ error: "Internal server error", details: err || err }, { status: 500 });
  }
};
