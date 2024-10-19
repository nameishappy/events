import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, Clock, User, Info, Trash2, Edit } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";

import EventForm from "../Calender/createEvent";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [eventToUpdate, setEventToUpdate] = useState(null);

  const form = useForm();

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (eventToUpdate) {
      form.reset({
        title: eventToUpdate.title,
        description: eventToUpdate.description,
        event_date: eventToUpdate.event_date,
        event_time: eventToUpdate.event_time,
      });
    }
  }, [eventToUpdate, form]);

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
      setEvents(response.data.response);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleUpdateClick = (event) => {
    setEventToUpdate(event);
    setUpdateDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));
      await axios.delete(
        `https://events-production-86c8.up.railway.app/api/events/${eventToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setEvents(events.filter((event) => event.id !== eventToDelete.id));
      setDeleteDialogOpen(false);
      setEventToDelete(null);
    } catch (err) {
      setError("Failed to delete event: " + err.message);
    }
  };

  const onUpdateSubmit = async (data) => {
    try {
      const accessToken = JSON.parse(localStorage.getItem("accessToken"));
      const response = await axios.put(
        `https://events-production-86c8.up.railway.app/api/events/${eventToUpdate.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      fetchEvents();
      setUpdateDialogOpen(false);
      setEventToUpdate(null);
      form.reset();
    } catch (err) {
      setError("Failed to update event: " + err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return dateString;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return timeString;
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        <p>Error loading events: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-1/2  p-4">
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Your Upcoming Events
          </h1>
          <p className="text-gray-600 mt-2">
            You have {events.length} event{events.length !== 1 ? "s" : ""}{" "}
            scheduled
          </p>
        </div>
        <div className="text-center pb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="solid" className="bg-blue-400">
                Add new Event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <EventForm handleupdateEvents={fetchEvents} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {events.map((event, index) => (
          <Card
            key={event.id + index}
            className="w-full hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 py-3">
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span>{event.title}</span>
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                    {formatTime(event.event_time)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => handleUpdateClick(event)}
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => handleDeleteClick(event)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>

            <CardContent className="py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3" />
                  <span>{formatDate(event.event_date)}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-3" />
                  <span>{formatTime(event.event_time)}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <User className="h-5 w-5 mr-3" />
                  <span className="text-sm">
                    Created {formatDate(event.created_at)}
                  </span>
                </div>

                {event.description && (
                  <div className="flex items-center text-gray-600">
                    <Info className="h-5 w-5 mr-3" />
                    <span className="truncate">{event.description}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{eventToDelete?.title}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Event</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onUpdateSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="event_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setUpdateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Event</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {events.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No events found</h3>
          <p className="text-gray-500 mt-2">
            You haven't created any events yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default EventList;
