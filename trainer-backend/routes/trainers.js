const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const requireRole = require("../middleware/roleMiddleware");
const trainerProfileController = require("../controllers/trainerProfileController");
const trainerController = require("../controllers/trainerController");

const router = express.Router();
const trainerOnly = [authMiddleware, requireRole("trainer")];

router.get("/profile", trainerOnly, trainerProfileController.getProfile);
router.put("/profile", trainerOnly, trainerProfileController.updateProfile);
router.get("/clients", trainerOnly, trainerController.listClients);
router.get("/clients/:clientId", trainerOnly, trainerController.getClient);
router.post("/clients/:clientId/assign", trainerOnly, trainerController.assignClient);
router.delete("/clients/:clientId/assign", trainerOnly, trainerController.unassignClient);

module.exports = router;
