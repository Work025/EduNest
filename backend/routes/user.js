// routes/user.js
router.put('/avatar/:id', async (req, res) => {
  const { avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { avatar },
    { new: true }
  );
  req.app.get('io').emit('avatar_updated', {
    userId: req.params.id,
    avatarUrl: avatar
  });
  res.json({ message: "Avatar updated", imageUrl: avatar });
});
