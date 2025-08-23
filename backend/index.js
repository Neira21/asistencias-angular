import express from "express";
import cors from "cors";

import { PrismaClient } from "@prisma/client";
import { authRouter } from "./router/authRouter.js";

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


// authentication routes

app.use(authRouter);


// attendance routes

// Mark attendance
app.post("/attendance/mark", async (req, res) => {
  const { userId } = req.body;
  console.log("user for assistance ", userId);

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
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  try {
    // el attendanceRecord da el primer registro de asistencia del usuario para el día actual
    let attendanceRecord = await prisma.attendance.findFirst({
      where: {
        userId: parseInt(userId),
        date: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });
    console.log("Attendance record found:", attendanceRecord);

    if (attendanceRecord) {
      // Record exists for today
      if (attendanceRecord.status === "PRESENT") {
        return res.status(200).json({ message: "Attendance already marked as PRESENT for today.", attendance: attendanceRecord });
      } else {
        // si no tiene present se actualiza a PRESENT
        attendanceRecord = await prisma.attendance.update({
          where: { id: attendanceRecord.id },
          data: {
            status: "PRESENT",
            entryTime: now,
          },
        });
        return res.status(200).json({ message: "Attendance updated to PRESENT!", attendance: attendanceRecord });
      }
    } else {
      // No record for today, create a new one as PRESENT
      const newAttendance = await prisma.attendance.create({
        data: {
          userId: parseInt(userId), // <-- Agrega esto
          date: now,
          status: "PRESENT",
          entryTime: now,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });
      console.log("Attendance marked AAAAAAAAA:", newAttendance);
      return res.status(201).json({ message: "Attendance marked successfully!", attendance: newAttendance });
    }
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

app.get("/attendance/range", async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "Both startDate and endDate are required query parameters (YYYY-MM-DD)." });
  }

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Set time to end of day for endDate to include records on that day
    end.setHours(23, 59, 59, 999);

    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        date: {
          gte: start,
          lte: end,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });
    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance records by range:", error);
    res.status(500).json({ error: "Failed to fetch attendance records by date range. Ensure dates are in YYYY-MM-DD format." });
  }
});

// Function to mark daily absences
async function markDailyAbsences() {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  try {
    const users = await prisma.user.findMany();

    for (const user of users) {
      const attendanceRecord = await prisma.attendance.findFirst({
        where: {
          userId: user.id,
          date: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      });

      if (!attendanceRecord) {
        // No attendance record for today, mark as ABSENT
        await prisma.attendance.create({
          data: {
            userId: user.id,
            date: today,
            status: "ABSENT",
            entryTime: null, // No entry time for absent records
          },
        });
        console.log(`Marked user ${user.email} as ABSENT for ${today.toDateString()}`);
      }
    }
    console.log("Daily absence marking complete.");
  } catch (error) {
    console.error("Error marking daily absences:", error);
  }
}

// This function would typically be called by a cron job or scheduler
// For example, using 'node-cron':
// import cron from 'node-cron';
// cron.schedule('0 0 * * *', () => { // Runs every day at midnight
//   markDailyAbsences();
// });

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
