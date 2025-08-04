import React from 'react';
const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;

const WatchHistory = () => {
  const [history, setHistory] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${baseUrl}/users/watchhistory`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch watch history');
        const data = await response.json();
        setHistory(data.data || []);
      } catch (error) {
        setHistory([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Watch History</h1>
      {isLoading ? (
        <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>
      ) : history.length === 0 ? (
        <div className="text-center text-muted-foreground">No watch history found.</div>
      ) : (
        <div className="space-y-6">
          {history.map((item) => (
            <div key={item.viewed_at + item.video_id} className="bg-gray-50 rounded-xl shadow border mb-2">
              <div className="px-4 py-2 flex flex-col md:flex-row md:items-center md:justify-between border-b bg-gray-100 rounded-t-xl gap-2">
                <span className="text-sm text-gray-700 font-medium">
                  <span className="font-semibold text-blue-700">Event Time:</span> {new Date(item.start_date).toLocaleDateString()} {new Date(item.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-sm text-gray-700 font-medium">
                  <span className="font-semibold text-purple-700">Viewed At:</span> {new Date(item.viewed_at).toLocaleDateString()} {new Date(item.viewed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="px-4 py-3">
                <div className="flex flex-col md:flex-row md:items-center md:gap-6 gap-2">
                  <img src={item.video_thumbnail} alt={item.video_title} className="w-24 h-16 object-cover rounded-lg border" />
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 items-center mb-1">
                      <span className="font-bold text-lg text-gray-900">{item.video_title}</span>
                      <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">{item.event_name}</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-1">{item.event_description}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchHistory;
