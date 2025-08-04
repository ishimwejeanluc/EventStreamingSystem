
import React, { useState, useEffect } from 'react';
import CreateEventDialog from "./CreateEventDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Search, Calendar, Users, Clock, Loader2, Trash2, Edit, Eye } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Event name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  start_date: z.string().min(1, {
    message: "Please select a start date.",
  }),
  end_date: z.string().min(1, {
    message: "Please select an end date.",
  }),
  status: z.enum(['upcoming', 'ongoing', 'completed', 'cancelled']).default('upcoming'),
  video_id: z.string().optional(),
});

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [videos, setVideos] = useState([]);
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      start_date: "",
      end_date: "",
      status: "upcoming",
      video_id: "",
    },
  });

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/Admin/events`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      if (data.status === 'success') {
        setEvents(data.data);
        // Extract videos from events for dropdown
        const uniqueVideos = [];
        const seen = new Set();
        data.data.forEach(event => {
          if (event.video && !seen.has(event.video.id)) {
            uniqueVideos.push(event.video);
            seen.add(event.video.id);
          }
        });
        setVideos(uniqueVideos);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to load events: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/Admin/videos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch videos');
      
      const data = await response.json();
      if (data.status === 'success') {
        setVideos(data.data);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to load videos: ${error.message}`
      });
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (showEditDialog || showCreateDialog) {
      fetchVideos();
    }
  }, [showEditDialog, showCreateDialog]);

  const handleEditClick = (event) => {
    setSelectedEvent(event);
    setShowEditDialog(true);
    // Defensive: ensure video_id is a string and matches available videos
    const validVideoId = videos.some(v => v.id === event.video_id) ? event.video_id : "";
    form.reset({
      name: event.name ?? "",
      description: event.description ?? "",
      start_date: event.start_date ? format(new Date(event.start_date), "yyyy-MM-dd'T'HH:mm") : "",
      end_date: event.end_date ? format(new Date(event.end_date), "yyyy-MM-dd'T'HH:mm") : "",
      status: event.status ?? "upcoming",
      video_id: validVideoId
    });
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/Admin/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to delete event');
      
      const data = await response.json();
      if (data.status === 'success') {
        toast({
          title: "Success",
          description: "Event deleted successfully"
        });
        fetchEvents(); // Refresh the list
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to delete event: ${error.message}`
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Event Management</h1>
          <p className="text-muted-foreground">Schedule and manage your streaming events</p>
        </div>
        <Button 
          className="bg-gradient-primary"
          onClick={() => {
            form.reset(); // Reset form before opening
            setShowCreateDialog(true);
          }}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Create New Event
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search events..." className="pl-8" />
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Video</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.name}</TableCell>
              <TableCell>{event.description}</TableCell>
              <TableCell>{format(new Date(event.start_date), "PPP p")}</TableCell>
              <TableCell>{format(new Date(event.end_date), "PPP p")}</TableCell>
              <TableCell>{event.video ? event.video.title : <span className="text-muted-foreground italic">No video</span>}</TableCell>
              <TableCell>
                <Badge variant={
                  event.status === 'cancelled' ? "destructive" :
                  event.status === 'completed' ? "default" :
                  event.status === 'ongoing' ? "success" :
                  "secondary"
                }>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => window.location.href = `/event/${event.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditClick(event)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Create Event Modal Form */}
      <CreateEventDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        safeVideos={videos}
        formState={form.watch()}
        handleChange={(e) => {
          const { name, value } = e.target;
          form.setValue(name, value, { shouldValidate: true, shouldDirty: true });
        }}
        handleSubmit={form.handleSubmit(async (data) => {
          setIsSubmitting(true);
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseUrl}/Admin/events`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.status === 'success') {
              toast({ title: 'Success', description: 'Event created successfully!' });
              setShowCreateDialog(false);
              fetchEvents();
            } else {
              throw new Error(result.message);
            }
          } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
          } finally {
            setIsSubmitting(false);
          }
        })}
        error={form.formState.errors && Object.values(form.formState.errors)[0]?.message}
        isSubmitting={isSubmitting}
        mode="create"
      />

      {/* Edit Event Modal Form */}
      <CreateEventDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        safeVideos={videos}
        formState={form.watch()}
        handleChange={(e) => {
          const { name, value } = e.target;
          form.setValue(name, value, { shouldValidate: true, shouldDirty: true });
        }}
        handleSubmit={form.handleSubmit(async (data) => {
          setIsSubmitting(true);
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseUrl}/Admin/events/${selectedEvent?.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(data)
            });
            const result = await response.json();
            if (result.status === 'success') {
              toast({ title: 'Success', description: 'Event updated successfully!' });
              setShowEditDialog(false);
              fetchEvents();
            } else {
              throw new Error(result.message);
            }
          } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: error.message });
          } finally {
            setIsSubmitting(false);
          }
        })}
        error={form.formState.errors && Object.values(form.formState.errors)[0]?.message}
        isSubmitting={isSubmitting}
        mode="edit"
      />
    </div>
  );
};

export default EventManagement;
