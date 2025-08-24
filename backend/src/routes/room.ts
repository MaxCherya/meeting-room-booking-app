import { Router } from "express";
import * as ctrl from "../controllers/room";
import * as members from "../controllers/members";
import * as bookings from "../controllers/booking";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

// Rooms (list/create)
router.get("/", requireAuth, ctrl.listRooms);
router.post("/", requireAuth, ctrl.createRoom);

// Single room
router.get("/:id", requireAuth, ctrl.getRoom);
router.put("/:id", requireAuth, ctrl.updateRoom);
router.delete("/:id", requireAuth, ctrl.deleteRoom);

// Members
router.get("/:roomId/members", requireAuth, members.listMembers);
router.post("/:roomId/members", requireAuth, members.addMember);
router.delete("/:roomId/members/:userId", requireAuth, members.removeMember);

// Bookings (nested)
router.get("/:roomId/bookings", requireAuth, bookings.listRoomBookings);
router.post("/:roomId/bookings", requireAuth, bookings.createBooking);

// Booking item (flat route for convenience)
router.put("/bookings/:id", requireAuth, bookings.updateBooking);
router.delete("/bookings/:id", requireAuth, bookings.deleteBooking);

export default router;