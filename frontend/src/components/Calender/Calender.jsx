import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios"; // Make sure you import axios
import "react-big-calendar/lib/css/react-big-calendar.css"; // Add this for calendar styling

const localizer = momentLocalizer(moment);

const CalenderMain = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));
      const response = await axios.get(
        "https://events-production-86c8.up.railway.app/api/events/",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Map the response data to the format required by react-big-calendar
      const tempEvents = response.data.response.map((event) => ({
        title: event.title,
        start: new Date(`${event.event_date}`), // Parse the start date
        end: new Date(event.event_date), // Parse the end date
      }));
      console.log(tempEvents);
      // Set the events state with the fetched events
      setEvents(tempEvents);
    } catch (err) {
      console.error("Error fetching events:", err.message);
    }
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default CalenderMain;
