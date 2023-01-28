const express = require('express');
const app = express();

// An in-memory data store to hold user data
const users = {};

// Create a new user account
app.post('/users', (req, res) => {
  const { username, password } = req.body;

  // Verify that the provided username is not already in use
  if (users[username]) {
    res.status(400).json({ error: 'Username already in use' });
    return;
  }

  // Add the new user to the data store
  users[username] = {
    password,
    followers: {},
    following: {}
  };

  res.status(201).json({ message: 'User created successfully' });
});

// Retrieve a specific user by username
app.get('/users/:username', (req, res) => {
  const { username } = req.params;

  // Check if the user exists
  if (!users[username]) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  // Return the user's information
  res.json({ user: users[username] });
});

// Retrieve a list of followers for a specific user
app.get('/users/:username/followers', (req, res) => {
  const { username } = req.params;

  // Check if the user exists
  if (!users[username]) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  // Return the list of followers
  res.json({ followers: Object.keys(users[username].followers) });
});

// Retrieve a list of users a specific user is following
app.get('/users/:username/following', (req, res) => {
  const { username } = req.params;

  // Check if the user exists
  if (!users[username]) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  // Return the list of users the user is following
  res.json({ following: Object.keys(users[username].following) });
});

// Follow a specific user
app.post('/users/:username/follow', (req, res) => {
  const { username } = req.params;
  const { follower } = req.body;

  // Check if the user and follower exist
  if (!users[username] || !users[follower]) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  // Add the follower to the user's followers list
  users[username].followers[follower] = true;

  // Add the user to the follower's following list
  users[follower].following[username] = true;

  res.json({ message: 'Followed successfully' });
});

// Unfollow a specific user
app.delete('/users/:username/follow', (req, res) => {
  const { username } = req.params;
  const { follower } = req.body;