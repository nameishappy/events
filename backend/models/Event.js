// models/Event.js
import mysql from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";

export class EventModel {
  constructor(connection) {
    this.connection = connection;
  }

  async createEvent(userId, eventData) {
    const { title, description, event_date, event_time } = eventData;
    const id = uuidv4();
    console.log(id);
    console.log(userId, title, description, event_time, event_date);

    const [result] = await this.connection.execute(
      "INSERT INTO calendar_events (id, user_id, title, description, event_date, event_time) VALUES (?, ?, ?, ?, ?, ?)",
      [id, userId, title, description, event_date, event_time]
    );

    return { id, ...eventData };
  }

  async getEvents(userId) {
    const [rows] = await this.connection.execute(
      "SELECT * FROM calendar_events WHERE user_id = ? ORDER BY event_date",
      [userId]
    );
    return rows;
  }

  async getEventById(userId, eventId) {
    const [rows] = await this.connection.execute(
      "SELECT * FROM calendar_events WHERE id = ? AND user_id = ?",
      [eventId, userId]
    );
    return rows[0];
  }

  async updateEvent(userId, eventId, eventData) {
    const { title, description, event_date, event_time } = eventData;

    const [result] = await this.connection.execute(
      "UPDATE calendar_events SET title = ?, description = ?, event_date = ?, event_time = ? WHERE id = ? AND user_id = ?",
      [title, description, event_date, event_time, eventId, userId]
    );

    return result.affectedRows > 0;
  }

  async deleteEvent(userId, eventId) {
    const [result] = await this.connection.execute(
      "DELETE FROM calendar_events WHERE id = ? AND user_id = ?",
      [eventId, userId]
    );

    return result.affectedRows > 0;
  }
}
