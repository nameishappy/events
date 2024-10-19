// routes/events.js
import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import { EventModel } from "../models/Event.js";

const router = express.Router();

export const createEventRoutes = (connection) => {
  const eventModel = new EventModel(connection);

  // Create a new event
  router.post("/", authenticateUser, async (req, res) => {
    try {
      const { title, description, event_date, event_time } = req.body;

      // Validate required fields
      if (!title || !event_date || !event_time) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const event = await eventModel.createEvent(req.user.uid, {
        title,
        description,
        event_date,
        event_time,
      });

      res.status(201).json(event);
    } catch (error) {
      console.error("Create event error:", error);
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  // Get all events for the user
  router.get("/", authenticateUser, async (req, res) => {
    try {
      //   console.log(req.user.uid);
      const events = await eventModel.getEvents(req.user.uid);
      res.json({ status: 200, response: events });
    } catch (error) {
      console.error("Get events error:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  // Get a specific event
  router.get("/:id", authenticateUser, async (req, res) => {
    try {
      const event = await eventModel.getEventById(req.user.uid, req.params.id);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error("Get event error:", error);
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  // Update an event
  router.put("/:id", authenticateUser, async (req, res) => {
    try {
      const { title, description, event_date, event_time } = req.body;
      const formatttedDate = new Date(event_date).toISOString().split("T")[0];
      // console.log(formatttedDate);
      // Validate required fields
      if (!title || !event_date || !event_time) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const success = await eventModel.updateEvent(
        req.user.uid,
        req.params.id,
        {
          title,
          description,
          event_date: formatttedDate,
          event_time,
        }
      );

      if (!success) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.json({ message: "Event updated successfully" });
    } catch (error) {
      console.error("Update event error:", error);
      res.status(500).json({ error: "Failed to update event" });
    }
  });

  // Delete an event
  router.delete("/:id", authenticateUser, async (req, res) => {
    try {
      const success = await eventModel.deleteEvent(req.user.uid, req.params.id);

      if (!success) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Delete event error:", error);
      res.status(500).json({ error: "Failed to delete event" });
    }
  });

  return router;
};
