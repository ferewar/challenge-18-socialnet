const router = require('express').Router();
const User = require('../models/User');
const Thought = require('../models/Thought');

router.get('/', async (req, res) => {
  const users = await User.find().populate('thoughts').populate('friends');
  res.json(users);
});

router.get('/:userId', async (req, res) => {
  const user = await User.findById(req.params.userId).populate('thoughts').populate('friends');
  res.json(user);
});

router.post('/', async (req, res) => {
  const newUser = new User(req.body);
  const savedUser = await newUser.save();
  res.json(savedUser);
});

router.put('/:userId', async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
  res.json(updatedUser);
});

router.delete('/:userId', async (req, res) => {
  try {
    // Attempt to find the user by ID first to ensure it exists.
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Using findByIdAndDelete to attempt middleware triggering
    await User.findByIdAndDelete(req.params.userId);

    res.status(200).json({ message: "User successfully deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred", error });
  }
});


// POST to add a new friend to a user's friend list
router.post('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    );
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Couldn't add friend", error });
  }
});

// DELETE to remove a friend from a user's friend list
router.delete('/:userId/friends/:friendId', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { $pull: { friends: req.params.friendId } },
      { new: true }
    );
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Couldn't remove friend", error });
  }
});

module.exports = router;
