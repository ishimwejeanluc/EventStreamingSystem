import React from 'react';

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const CreateEventDialog = ({
  open,
  onOpenChange,
  handleSubmit,
  error,
  formState = {
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "upcoming",
    video_id: ""
  },
  handleChange,
  safeVideos = [],
  isSubmitting,
  mode = "create"
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Event" : "Create New Event"}</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Update the details below to edit this event."
              : "Fill in the details below to create a new streaming event."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-600 text-sm mb-2">{error}</div>
          )}
          <div>
            <Label htmlFor="name">Event Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter event name"
              value={formState.name}
              onChange={handleChange}
              required
              minLength={2}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter event description"
              value={formState.description}
              onChange={handleChange}
              required
              minLength={10}
            />
          </div>
          <div>
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              name="start_date"
              type="datetime-local"
              value={formState.start_date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="end_date">End Date</Label>
            <Input
              id="end_date"
              name="end_date"
              type="datetime-local"
              value={formState.end_date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              value={formState.status}
              onChange={handleChange}
              className="w-full border rounded px-2 py-2"
              required
            >
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <Label htmlFor="video_id">Video</Label>
            <select
              id="video_id"
              name="video_id"
              value={formState.video_id}
              onChange={handleChange}
              className="w-full border rounded px-2 py-2"
            >
              <option value="">Select a video</option>
              {safeVideos.length > 0 ? safeVideos.map((video) => (
                <option key={video.id} value={String(video.id)}>
                  {video.title}
                </option>
              )) : (
                <option value="" disabled>
                  No videos available
                </option>
              )}
            </select>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? mode === "edit" ? "Saving..." : "Creating..."
              : mode === "edit" ? "Save Changes" : "Create Event"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEventDialog;
