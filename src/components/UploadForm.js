import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [reward, setReward] = useState('');
  const [account, setAccount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!title.trim() || !description.trim() || !url.trim() || !reward.trim() || !account.trim()) {
      setError('All fields are required');
      return false;
    }
    if (isNaN(reward) || parseFloat(reward) <= 0) {
      setError('Reward must be a positive number');
      return false;
    }
    if (!/^https?:\/\/.+/.test(url)) {
      setError('Please enter a valid URL');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    const videoData = { title, description, url, reward, account };

    try {
      const response = await axios.post('/api/videos/upload', videoData);
      console.log('Video uploaded:', response.data);
      setSuccess('Video uploaded successfully!');
      // Clear form fields
      setTitle('');
      setDescription('');
      setUrl('');
      setReward('');
      setAccount('');
    } catch (error) {
      console.error('Error uploading video:', error);
      setError(error.response?.data?.error || 'Error uploading video. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {error && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
        style={styles.input}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        required
        style={styles.textarea}
      />
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Video URL"
        required
        style={styles.input}
      />
      <input
        type="number"
        value={reward}
        onChange={(e) => setReward(e.target.value)}
        placeholder="Reward in Wei"
        required
        style={styles.input}
      />
      <input
        type="text"
        value={account}
        onChange={(e) => setAccount(e.target.value)}
        placeholder="Your Account"
        required
        style={styles.input}
      />
      <button type="submit" disabled={isLoading} style={styles.button}>
        {isLoading ? 'Uploading...' : 'Upload Video'}
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    borderRadius: '8px',
  },
  input: {
    marginBottom: '10px',
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  textarea: {
    marginBottom: '10px',
    padding: '8px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    minHeight: '100px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  success: {
    color: 'green',
    marginBottom: '10px',
  },
};

export default UploadForm;
