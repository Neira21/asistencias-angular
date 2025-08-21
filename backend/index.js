import express from "express";
import cors from "cors";

import { PrismaClient } from "@prisma/client";

const app = express();
const port = 3000;

// Async IIFE to initialize Prisma and start the server

const prisma = new PrismaClient();

app.use(
  cors({
    origin: ["http://localhost:4200"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware para enviar JSON en las solicitudes
app.use(express.json());


app.get("/", (_req, res) => {
  res.json({
    register: "http://localhost:3000/register",
    login: "http://localhost:3000/login",
    markAttendance: "http://localhost:3000/attendance/mark",
    getAttendance: "http://localhost:3000/attendance/:userId",
    getUsers: "http://localhost:3000/users",
  })
});

// Basic user registration (for testing)
app.post("/register", async (req, res) => {

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
    console.log("User registered:", user);
    res.status(201).json(user);

  } catch (error) {
    console.error("User registration failed:", error); // Log the actual error for debugging
    res.status(400).json({ error: "User registration failed. Email might already be in use." });
  }
});

// Basic login (for testing)
app.post("/login", async (req, res) => {
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

// Mark attendance
app.post("/attendance/mark", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required." });
  }

  const userExists = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
  });
  if (!userExists) {
    return res.status(404).json({ error: "User not found." });
  }  


  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  console.log(today.toISOString().split('T')[0])
  // Verificar si ya existe asistencia para hoy
  const alreadyMarked = await prisma.attendance.findFirst({
    where: {
      userId: parseInt(userId),
      date: today.toISOString().split('T')[0], // Format date to YYYY-MM-DD
    },
  });


  if (alreadyMarked) {
    console.log("Attendance already marked for today:", alreadyMarked);
    return res.status(400).json({ error: "Attendance already marked for today." });
  }

  try {
    
    const pad = (n) => n.toString().padStart(2, '0');
    const entryTime = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const attendance = await prisma.attendance.create({
      data: {
        userId: parseInt(userId),
        date: now, // Solo la fecha, la hora se ignora en el campo date
        entryTime: entryTime // Solo la hora en formato string
      },
    });

    console.log("Attendance marked:", now);

    res
      .status(201)
      .json({ message: "Attendance marked successfully!", attendance });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ error: "Failed to mark attendance." });
  }
});

// Get attendance records for a user
app.get("/attendance/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const attendanceRecords = await prisma.attendance.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { date: "desc" }, // Order by date descending
    });
    const formatedRecords = attendanceRecords.map(record => {
      return {
        ...record,
      }
    })
    res.status(200).json(formatedRecords);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ error: "Failed to fetch attendance records." });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
