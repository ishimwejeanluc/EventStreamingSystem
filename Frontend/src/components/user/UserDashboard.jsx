
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

const UserDashboard = () => {
  useAuth();
  const [showPast, setShowPast] = React.useState(false);
  const [popup, setPopup] = React.useState(null);
  const [events, setEvents] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeVideo, setActiveVideo] = React.useState(null);

  // ...existing code...

  // --- Fetch events as before ---
  React.useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${baseUrl}/users/events`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        if (data.status === 'success') {
          setEvents(data.data);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Upcoming & Live Events</h1>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center text-muted-foreground">No events available.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-4 overflow-y-auto max-h-[80vh]">
          {[...events]
            .sort((a, b) => {
              // Cancelled events always last
              if (a.status === 'cancelled' && b.status !== 'cancelled') return 1;
              if (b.status === 'cancelled' && a.status !== 'cancelled') return -1;
              return 0;
            })
            .map((event) => (
            <div
              key={event.id}
              className="w-full max-w-xl mx-auto shadow-xl rounded-2xl bg-white transition-transform hover:scale-[1.02] hover:shadow-2xl border border-gray-100"
            >
              <div className="relative">
                {(event.video && event.video.thumbnail && typeof event.video.thumbnail === 'string' && event.video.thumbnail.trim() !== '') ? (
                  <img
                    src={event.video.thumbnail.startsWith('/') ? `${baseUrl}${event.video.thumbnail}` : event.video.thumbnail}
                    alt={event.video.title || event.name}
                    className="w-full h-56 object-cover rounded-t-2xl mb-0"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x200?text=No+Thumbnail'; }}
                  />
                ) : (
                  <div className="w-full h-56 bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center rounded-t-2xl mb-0 text-muted-foreground text-lg font-semibold">No Thumbnail</div>
                )}
                <div className="absolute top-3 right-3">
                  {event.video && event.video.url ? (
                    <button
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full shadow-lg font-semibold text-base hover:scale-105 transition-transform"
                      onClick={async () => {
                        const now = new Date();
                        const start = event.start_date ? new Date(event.start_date) : null;
                        if (start && now < start) {
                          setPopup({
                            title: 'Live Not Started',
                            message: `This event will start at ${start.toLocaleDateString()} ${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Please check back later.`
                          });
                          return;
                        }
                        try {
                          const token = localStorage.getItem('token');
                          await fetch(`${baseUrl}/users/play/${event.video.id}`, {
                            method: 'POST',
                            headers: {
                              'Authorization': `Bearer ${token}`,
                              'Content-Type': 'application/json'
                            }
                          });
                        } catch (err) {
                          // Optionally handle error
                        }
                        setActiveVideo({ url: event.video.url, title: event.video.title || event.name });
                      }}
                    >
                      ▶ Play
                    </button>
                  ) : (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full shadow-lg text-xs font-semibold">Video not accessible</span>
                  )}
                </div>
                {/* Status badge */}
                <span
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow
                    ${event.status === 'upcoming' ? 'bg-yellow-100 text-yellow-700'
                      : event.status === 'ongoing' ? 'bg-blue-100 text-blue-700'
                      : event.status === 'completed' ? 'bg-green-100 text-green-700'
                      : event.status === 'cancelled' ? 'bg-red-100 text-red-700'
                      : 'bg-gray-300 text-gray-700'}
                  `}
                >
                  {event.status ? event.status.toUpperCase() : ''}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-2xl mb-2 line-clamp-2 text-gray-900">{event.name}</h3>
                <p className="text-gray-600 text-base mb-4 line-clamp-2">{event.description}</p>
                <div className="flex items-center gap-4 mb-4">
                  {/* Start Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span>{event.start_date ? new Date(event.start_date).toLocaleDateString() : ''}</span>
                  </div>
                  {/* Start Time */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{event.start_date ? new Date(event.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                  </div>
                  {/* End Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <span>{event.end_date ? new Date(event.end_date).toLocaleDateString() : ''}</span>
                  </div>
                  {/* End Time */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{event.end_date ? new Date(event.end_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                  </div>
                </div>
                {/* Avatar (if available) */}
                {event.organizer_avatar && (
                  <div className="flex items-center mt-2">
                    <img src={event.organizer_avatar} alt="avatar" className="w-7 h-7 rounded-full border-2 border-white shadow" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {activeVideo && (
        <VideoPlayerModal url={activeVideo.url} title={activeVideo.title} onClose={() => setActiveVideo(null)} />
      )}
      {popup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-fade-in">
            <div className="flex flex-col items-center gap-2">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto mb-2">
                <circle cx="12" cy="12" r="10" fill="#fbbf24" />
                <path d="M12 8v4" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="16" r="1" fill="#fff" />
              </svg>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{popup.title}</h2>
              <p className="text-gray-700 text-base mb-4">{popup.message}</p>
              <button
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-full font-semibold shadow hover:scale-105 transition-transform"
                onClick={() => setPopup(null)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Netflix-style Video Player Modal
const VideoPlayerModal = ({ url, title, onClose }) => {
  const videoRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(true);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [volume, setVolume] = React.useState(1);
  const [isMuted, setIsMuted] = React.useState(false);
  const [showControls, setShowControls] = React.useState(true);
  const controlsTimeout = React.useRef(null);

  // Use provided title or fallback to extracting from URL
  let videoTitle = title || "Video Player";
  if (!videoTitle && url) {
    try {
      const parts = url.split("/");
      videoTitle = decodeURIComponent(parts[parts.length - 1].split(".")[0]).replace(/[-_]/g, " ");
    } catch {
      videoTitle = "Video Player";
    }
  }

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, volume, isMuted]);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!videoRef.current) return;
      setShowControls(true);
      switch (e.key) {
        case ' ': // Spacebar
          setIsPlaying((prev) => !prev);
          e.preventDefault();
          break;
        case 'ArrowRight':
          videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
          break;
        case 'ArrowLeft':
          videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
          break;
        case 'f':
          handleFullscreen();
          break;
        case 'm':
          setIsMuted((prev) => !prev);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [duration, isPlaying, isMuted]);

  // Hide controls after 3s of mouse inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => setShowControls(false), 3000);
  };

  const handlePlayPause = () => setIsPlaying((prev) => !prev);
  const handleFastForward = () => {
    if (videoRef.current) videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
  };
  const handleRewind = () => {
    if (videoRef.current) videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
  };
  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) videoRef.current.requestFullscreen();
        else if (videoRef.current.webkitRequestFullscreen) videoRef.current.webkitRequestFullscreen();
        else if (videoRef.current.mozRequestFullScreen) videoRef.current.mozRequestFullScreen();
        else if (videoRef.current.msRequestFullscreen) videoRef.current.msRequestFullscreen();
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
        setIsFullscreen(false);
      }
    }
  };
  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };
  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };
  const handleSeek = (e) => {
    const seekTime = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };
  const handleVolume = (e) => {
    const vol = Number(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
  };
  const handleMute = () => setIsMuted((prev) => !prev);
  // Format time helper
  const formatTime = (sec) => {
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="fixed inset-0 bg-[#232a36] flex items-center justify-center z-50" onMouseMove={handleMouseMove}>
      <div className="relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden" style={{ background: 'rgba(30,34,44,0.98)' }}>
        {/* Top Bar with Title and Menu */}
        <div className="absolute top-0 left-0 w-full flex items-center justify-between px-6 py-4 z-10">
          <span className="text-white text-lg font-bold drop-shadow-lg">{videoTitle}</span>
          <div className="flex items-center gap-2">
            <span className="bg-blue-700 text-white text-xs font-bold px-2 py-1 rounded shadow">HD</span>
            <button
              className="text-white bg-black bg-opacity-40 hover:bg-opacity-70 rounded-full px-2 py-1 shadow"
              onClick={onClose}
              title="Close"
              style={{ pointerEvents: 'auto' }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6L14 14M6 14L14 6" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>
        <video
          ref={videoRef}
          src={url}
          preload="metadata"
          className="w-full h-[400px] object-cover"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          autoPlay
          tabIndex={0}
          style={{ background: 'black' }}
        />
        {/* Controls Overlay */}
        {showControls && (
          <div className="absolute bottom-0 left-0 w-full flex flex-col gap-2 px-6 pb-5 pt-2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
            {/* Progress Bar */}
            <div className="flex items-center gap-2 w-full pointer-events-auto">
              <span className="text-xs text-white font-mono min-w-[50px] drop-shadow">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full accent-blue-500 h-2 rounded-full"
              />
              <span className="text-xs text-white font-mono min-w-[50px] drop-shadow">{formatTime(duration)}</span>
            </div>
            {/* Main Controls */}
            <div className="flex items-center justify-center gap-4 mt-2 pointer-events-auto">
              {/* Rewind 10s */}
              <button
                className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-2 shadow-lg"
                onClick={handleRewind}
                title="Rewind 10s"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7 12l5-5v3h4v4h-4v3l-5-5z" fill="currentColor"/></svg>
              </button>
              {/* Play/Pause */}
              <button
                className="bg-white hover:bg-gray-200 text-blue-700 rounded-full p-3 shadow-lg border-2 border-blue-700"
                onClick={handlePlayPause}
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg>
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><polygon points="5,3 19,12 5,21" fill="currentColor"/></svg>
                )}
              </button>
              {/* Fast Forward 10s */}
              <button
                className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-2 shadow-lg"
                onClick={handleFastForward}
                title="Forward 10s"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17 12l-5-5v3H8v4h4v3l5-5z" fill="currentColor"/></svg>
              </button>
              {/* Mute/Unmute */}
              <button
                className={`rounded-full p-2 shadow-lg ${isMuted ? 'bg-blue-700 text-white' : 'bg-black bg-opacity-60 text-white hover:bg-opacity-80'}`}
                onClick={handleMute}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M16 12V8a4 4 0 0 0-4-4H8v12h4a4 4 0 0 0 4-4v-4z" fill="currentColor"/><line x1="19" y1="5" x2="5" y2="19" stroke="white" strokeWidth="2"/></svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M16 12V8a4 4 0 0 0-4-4H8v12h4a4 4 0 0 0 4-4v-4z" fill="currentColor"/></svg>
                )}
              </button>
              {/* Fullscreen */}
              <button
                className="bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full p-2 shadow-lg"
                onClick={handleFullscreen}
                title="Fullscreen (f)"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="2"/></svg>
              </button>
            </div>
            {/* Volume Bar */}
            <div className="flex items-center gap-2 mt-2 pointer-events-auto">
              {/* Volume SVG icon */}
              <span className="flex items-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 9v6h4l5 5V4L7 9H3z" fill="currentColor"/>
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.06c1.48-.74 2.5-2.26 2.5-4.03z" fill="currentColor"/>
                </svg>
              </span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolume}
                className="w-32 accent-blue-700 h-2 rounded-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;