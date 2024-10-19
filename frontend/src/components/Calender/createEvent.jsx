import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { getAuth } from "firebase/auth";
import { app } from "../../../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EventForm = ({ handleupdateEvents }) => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
  });

  // Fixed handleChange function
  const handleChange = (e) => {
    const { id, value } = e.target; // Destructure id and value from event target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log(formData);
    try {
      const accessToken = await auth.currentUser.getIdToken();

      // Combine date and time for start_time and end_time
      const dateTime = `${formData.date}T${formData.time}`;

      const resp = await axios.post(
        "https://events-production-86c8.up.railway.app/api/events/",
        {
          title: formData.title,
          description: formData.description,
          event_time: formData.time,
          event_date: formData.date,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Event created successfully:", resp.data);
      // Clear form after successful submission
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
      });
      alert("Event created successfully!");
      handleupdateEvents();
      // window.location.reload();
    } catch (error) {
      console.error(
        "Error creating event:",
        error.response?.data || error.message
      );
      alert("Failed to create event. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Add New Event
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {" "}
          {/* Added spacing between fields */}
          {/* Title Field */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Event Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter event title"
              required
              onChange={handleChange}
            />
          </div>
          {/* Date and Time Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="date" className="block text-sm font-medium">
                Date
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="time" className="block text-sm font-medium">
                Time
              </label>
              <input
                type="time"
                id="time"
                value={formData.time}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Description Field */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              rows="4"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter event description"
              required
              onChange={handleChange}
            />
          </div>
          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            Create Event
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventForm;
