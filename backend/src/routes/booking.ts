// src/routes/booking.routes.ts
import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import * as bookings from "../controllers/booking";

const router = Router();

router.get("/:id", requireAuth, bookings.getBooking);
router.get("/:id/attendees", requireAuth, bookings.listAttendees);
router.post("/:id/attendees", requireAuth, bookings.addAttendee);
router.delete("/:id/attendees/:userId", requireAuth, bookings.removeAttendee);
router.post("/:id/join", requireAuth, bookings.joinBooking);
router.delete("/:id/join", requireAuth, bookings.leaveBooking);

export default router;