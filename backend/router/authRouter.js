import { Router } from "express";
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const authRouter = Router();
// Registro de usuari
authRouter.post("/register", async (req, res) => {

  if(!req.body){
    return res.status(400).json({ error: "Debes ingresar los datos del usuario (email, password, role (Default: User))." });
  }

  const { email, password, role } = req.body;

  // Validate role
  const validRoles = ["USER", "ADMIN"];
  if (role && !validRoles.includes(role.toUpperCase())) {
    return res.status(400).json({ error: "Invalid role specified. Role must be 'USER' or 'ADMIN'." });
  }

  // validar email unico
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return res.status(400).json({ error: "El email ya está en uso." });
  }

  try {
    const user = await prisma.user.create({
      data: {
        email,
        password, // In a real app, hash this password!
        role: role ? role.toUpperCase() : "USER", // Ensure role is uppercase and defaults to USER
      },
    });
    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, email: user.email, role: user.role }
    });

  } catch (error) {
    console.error("User registration failed:", error); // Log the actual error for debugging
    res.status(400).json({ error: "User registration failed. Email might already be in use." });
  }
});

// Basic login (for testing)
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      // In a real app, compare hashed passwords!
      return res.status(401).json({ error: "Invalid credentials." });
    }

    res
      .status(200)
      .json({
        message: "Login successful",
        user: { id: user.id, email: user.email, role: user.role },
      });
  } catch (error) {
    res.status(500).json({ error: "Login failed." });
  }
});



// Get all users
// ToDo: Rol ADMIN abble to get all users
authRouter.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        attendances: true, // Include all attendance records for each user
      },
    });
    res.status(200).json({ message: "Users fetched successfully", users : users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users." });
  }
});