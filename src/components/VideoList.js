import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/videos/fetch');
        setVideos(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('Failed to fetch videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  if (loading) {
    return <div style={styles.message}>Loading videos...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (videos.length === 0) {
    return <div style={styles.message}>No videos uploaded yet.</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Uploaded Videos</h2>
      <ul style={styles.videoList}>
        {videos.map((video, index) => (
          <li key={index} style={styles.videoItem}>
            <h3 style={styles.videoTitle}>{video.title}</h3>
            <p style={styles.videoDescription}>{video.description}</p>
            <video controls style={styles.video}>
              <source src={`https://theta-video-url/${video.videoId}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p style={styles.videoInfo}>Uploaded by: {video.uploader}</p>
            <p style={styles.videoInfo}>Reward: {video.reward} Wei</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    textAlign: 'center',
    color: '#333',
  },
  videoList: {
    listStyle: 'none',
    padding: 0,
  },
  videoItem: {
    marginBottom: '30px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  videoTitle: {
    color: '#007bff',
  },
  videoDescription: {
    color: '#666',
  },
  video: {
    width: '100%',
    maxWidth: '640px',
    marginTop: '10px',
    marginBottom: '10px',
  },
  videoInfo: {
    fontSize: '14px',
    color: '#888',
  },
  message: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#666',
    marginTop: '20px',
  },
  error: {
    textAlign: 'center',
    fontSize: '18px',
    color: 'red',
    marginTop: '20px',
  },
};

export default VideoList;