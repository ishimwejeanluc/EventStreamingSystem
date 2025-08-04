import React, { useState, useEffect } from 'react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MoreVertical, Search, Video, Play, Clock, ImagePlus, Upload, Loader2, Pencil, Trash, Eye } from 'lucide-react';

// Get environment variables
const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const apiKey = import.meta.env.VITE_CLOUDINARY_API_KEY;

const VideoManagement = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingVideo, setEditingVideo] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  console.log('Current videos state:', videos); // Debug log

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/Admin/videos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log
      
      if (data.status === 'success' && Array.isArray(data.data)) {
        setVideos(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch videos');
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

    const uploadToCloudinary = async (file, resourceType) => {
    // Validate required environment variables
    if (!cloudName || !uploadPreset || !apiKey) {
      console.error('Cloudinary configuration error:', {
        cloudName: !!cloudName,
        uploadPreset: !!uploadPreset,
        apiKey: !!apiKey
      });
      throw new Error('Missing required Cloudinary configuration. Please check your environment variables.');
    }

    // Validate file size (Cloudinary has a 100MB limit for free accounts)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      throw new Error(`File size exceeds limit. Maximum size is 100MB, got ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('api_key', apiKey);
    formData.append('timestamp', Math.round((new Date).getTime() / 1000));
    
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        mode: 'cors',
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Failed to parse Cloudinary response:', {
          status: response.status,
          statusText: response.statusText,
          responseText: await response.text().catch(() => 'Unable to read response text')
        });
        throw new Error('Invalid response from Cloudinary server');
      }

      if (!response.ok) {
        // Handle Cloudinary specific error response
        const errorMessage = data.error ? data.error.message : response.statusText;
        const errorDetails = {
          statusCode: response.status,
          statusText: response.statusText,
          errorDetails: data.error || {},
          resourceType,
          fileName: file.name,
          fileSize: file.size,
          cloudinaryError: data.error
        };
        console.error('Cloudinary upload error:', errorDetails);
        
        // Provide more specific error messages based on status code
        switch (response.status) {
          case 400:
            throw new Error(`Invalid request to Cloudinary: ${errorMessage}`);
          case 401:
            throw new Error('Invalid Cloudinary credentials. Please check your API key and upload preset');
          case 403:
            throw new Error('Unauthorized access to Cloudinary. Please check your account permissions');
          case 404:
            throw new Error('Cloudinary upload endpoint not found. Please check your cloud name');
          default:
            throw new Error(`Cloudinary upload failed: ${errorMessage}`);
        }
      }

      console.log(`${resourceType} upload successful:`, {
        url: data.secure_url,
        publicId: data.public_id,
        resourceType,
        format: data.format,
        size: data.bytes
      });

      return data.secure_url;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Upload timed out after 30 seconds');
      }
      
      // Handle network or other errors
      const errorContext = {
        errorType: error.name,
        errorMessage: error.message,
        resourceType,
        fileName: file.name,
        fileSize: file.size,
        cloudinaryUrl,
        networkStatus: navigator.onLine ? 'online' : 'offline'
      };
      console.error('Cloudinary upload failed:', errorContext);
      
      // Provide more specific error messages based on error type
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network and try again');
      } else if (error.message === 'Failed to fetch') {
        throw new Error('Network error while uploading to Cloudinary. Please check your internet connection and try again');
      }
      
      // Rethrow with more context
      throw new Error(`Failed to upload to Cloudinary: ${error.message}`);
    }
  };

  const uploadFile = async (file, type) => {
    console.log('Starting uploadFile function with:', { type, fileName: file.name, fileSize: file.size });
    
    try {
      // Upload to Cloudinary and get the secure URL
      const cloudinaryUrl = await uploadToCloudinary(file, type === 'video' ? 'video' : 'image');
      console.log('Cloudinary upload successful:', cloudinaryUrl);
      
      // Return the Cloudinary URL directly to be stored in the database
      return cloudinaryUrl;
    } catch (error) {
      console.error('Upload process failed:', {
        phase: 'upload',
        errorType: error.name,
        errorMessage: error.message,
        fileInfo: {
          name: file.name,
          type: file.type,
          size: file.size
        }
      });
      throw new Error(`Failed to upload ${type}: ${error.message}`);
    }
  };

  const handleVideoSubmit = async (event, isEdit = false) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.target);
      const videoFile = formData.get('video_file');
      const thumbnailFile = formData.get('thumbnail_file');
      
      // Initialize paths based on whether we're editing or creating
      let file_path = isEdit ? editingVideo.file_path : null;
      let thumbnail_path = isEdit ? editingVideo.thumbnail_path : null;

      // Handle video upload - if a new video is uploaded, reset the thumbnail as well
      if (videoFile && videoFile.size > 0) {
        try {
          console.log('Starting video upload process...');
          const newVideoPath = await uploadFile(videoFile, 'video');
          console.log('Video uploaded successfully:', newVideoPath);
          file_path = newVideoPath; // Update video path with new Cloudinary URL
          
          // If no new thumbnail is provided for the new video, reset thumbnail_path
          if (!thumbnailFile || thumbnailFile.size === 0) {
            thumbnail_path = null; // Reset thumbnail for the new video
          }
        } catch (error) {
          console.error('Video upload error:', error);
          toast({
            variant: "destructive",
            description: "Failed to upload video file"
          });
          throw error;
        }
      } else if (!isEdit) {
        throw new Error('Video file is required');
      }
      
      // Handle thumbnail upload
      if (thumbnailFile && thumbnailFile.size > 0) {
        try {
          console.log('Starting thumbnail upload process...');
          const newThumbnailPath = await uploadFile(thumbnailFile, 'image');
          console.log('Thumbnail uploaded successfully:', newThumbnailPath);
          thumbnail_path = newThumbnailPath; // Update thumbnail path with new Cloudinary URL
        } catch (error) {
          console.error('Thumbnail upload error:', error);
          toast({
            variant: "destructive",
            description: "Failed to upload thumbnail"
          });
          throw error;
        }
      }

      // Validate that we have appropriate paths
      if (!file_path) {
        throw new Error('Video file is required');
      }
      // No need for default thumbnail path as we're using Cloudinary URLs directly

      const videoData = {
        title: formData.get('title'),
        description: formData.get('description'),
        file_path,
        thumbnail_path,
        duration: parseInt(formData.get('duration'), 10)
      };

      const token = localStorage.getItem('token');
      const url = isEdit 
        ? `${baseUrl}/Admin/videos/${editingVideo.id}`
        : `${baseUrl}/Admin/videos/upload`;

      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(videoData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to ${isEdit ? 'update' : 'upload'} video`);
      }
      
      const result = await response.json();
      
      toast({
        description: `Video ${isEdit ? 'updated' : 'uploaded'} successfully`,
      });
      
      fetchVideos(); // Refresh the video list
      isEdit ? setIsEditDialogOpen(false) : setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error submitting video:', err);
      toast({
        variant: "destructive",
        description: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVideo = async (videoId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/Admin/videos/${videoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to delete video');
      }
      
      setVideos(videos.filter(video => video.id !== videoId));
      toast({
        description: "Video deleted successfully",
      });
    } catch (err) {
      console.error('Error deleting video:', err);
      toast({
        variant: "destructive",
        description: `Failed to delete video: ${err.message}`,
      });
    }
  };

  const VideoForm = ({ onSubmit, video = null }) => (
    <form onSubmit={onSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={video?.title}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={video?.description}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="video_file">Video File</Label>
          <div className="flex gap-4">
            <Input
              id="video_file"
              name="video_file"
              type="file"
              accept="video/*"
              className="flex-1"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  // Preview video metadata
                  const videoElement = document.createElement('video');
                  videoElement.preload = 'metadata';
                  videoElement.onloadedmetadata = () => {
                    const durationInput = document.getElementById('duration');
                    if (durationInput) {
                      durationInput.value = Math.round(videoElement.duration);
                    }
                  };
                  videoElement.src = URL.createObjectURL(file);
                }
              }}
            />
          </div>
          {video?.file_path && (
            <div className="mt-2">
              <video 
                src={video.file_path} 
                className="max-h-[200px] rounded-lg" 
                controls
                poster={video.thumbnail_path}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="thumbnail_file">Thumbnail</Label>
          <div className="flex gap-4">
            <Input
              id="thumbnail_file"
              name="thumbnail_file"
              type="file"
              accept="image/*"
              className="flex-1"
            />
          </div>
          {video?.thumbnail_path && (
            <div className="mt-2">
              <img 
                src={video.thumbnail_path} 
                alt="Video thumbnail" 
                className="max-h-[200px] rounded-lg object-cover"
              />
            </div>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="duration">Duration (in seconds)</Label>
          <Input
            id="duration"
            name="duration"
            type="number"
            min="0"
            defaultValue={video?.duration}
            required
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          type="button"
          variant="ghost"
          onClick={() => video ? setIsEditDialogOpen(false) : setIsAddDialogOpen(false)}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {video ? 'Save Changes' : 'Upload Video'}
        </Button>
      </DialogFooter>
    </form>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>Error: {error}</p>
        <Button onClick={fetchVideos} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Edit Video Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
            <DialogDescription>
              Make changes to the video details below.
            </DialogDescription>
          </DialogHeader>
          <VideoForm 
            onSubmit={(e) => handleVideoSubmit(e, true)} 
            video={editingVideo} 
          />
        </DialogContent>
      </Dialog>

      {/* Add Video Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Video</DialogTitle>
            <DialogDescription>
              Add a new video by filling in the details below.
            </DialogDescription>
          </DialogHeader>
          <VideoForm onSubmit={(e) => handleVideoSubmit(e, false)} />
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Video Management</h1>
          <p className="text-muted-foreground">Manage your video content</p>
        </div>
        <Button 
          className="bg-gradient-primary"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Video
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search videos..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Videos Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>File Path</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                  </div>
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-red-500">
                  {error}
                </TableCell>
              </TableRow>
            ) : videos && videos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-gray-500">
                  No videos found.
                </TableCell>
              </TableRow>
            ) : videos && videos.map((video) => (
              <TableRow key={video.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Video className="h-4 w-4 mr-2" />
                    {video.title}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate">
                    {video.description}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {formatDuration(video.duration)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate">
                    {video.file_path}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onSelect={() => {
                          setEditingVideo(video);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Video
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onSelect={() => handleDeleteVideo(video.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete Video
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default VideoManagement;
