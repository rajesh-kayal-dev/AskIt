export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(200).json(null);
    }
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
