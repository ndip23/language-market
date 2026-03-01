router.post('/save-teacher/:id', auth, authorize(['student']), async (req, res) => {
  const user = await User.findById(req.user.id);
  const teacherId = req.params.id;

  if (user.savedTeachers.includes(teacherId)) {
    // Remove if already saved
    user.savedTeachers = user.savedTeachers.filter(id => id.toString() !== teacherId);
  } else {
    // Add if not saved
    user.savedTeachers.push(teacherId);
  }
  
  await user.save();
  res.json(user.savedTeachers);
});