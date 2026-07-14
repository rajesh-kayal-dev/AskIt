export const getCurrentUser = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
  //dwwdgugdhdd
};
