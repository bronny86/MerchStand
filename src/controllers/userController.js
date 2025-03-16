// src/controllers/userController.js

const bcrypt = require('bcrypt');
const User = require('../models/User');
const mongoose = require('mongoose');

// Create a new user with email uniqueness check and password hashing
exports.createUser = async (req, res, next) => {
  try {
    const { contactEmail, password } = req.body;
    
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ contactEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    // Ensure a password is provided
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }
    
    // Hash the plain text password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    req.body.passwordHash = hashedPassword;
    delete req.body.password;
    
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
};

// GET all users with optional filtering and sorting
exports.getAllUsers = async (req, res, next) => {
  try {
    const { genre, sort } = req.query;
    const filter = {};
    if (genre) {
      filter.genre = genre;
    }
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort) {
      sortOption = { createdAt: sort.toLowerCase() === 'asc' ? 1 : -1 };
    }
    const users = await User.find(filter).sort(sortOption);
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// GET a specific user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Validate that the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// PUT to update an existing user by ID
exports.updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// DELETE a user by ID
exports.deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
