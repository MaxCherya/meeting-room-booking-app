import { Router } from "express";
import * as ctrl from "../controllers/room";
import { requireAuth } from "../middlewares/requireAuth";

const router = Router();

router.get("/", requireAuth, ctrl.listRooms);
router.post("/", requireAuth, ctrl.createRoom);
router.put("/:id", requireAuth, ctrl.updateRoom);
router.delete("/:id", requireAuth, ctrl.deleteRoom);

export default router;