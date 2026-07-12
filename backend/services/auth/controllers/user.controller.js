export const getMe = async (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        picture: req.user.picture,
        credits: req.user.credits,
        plan: req.user.plan,
      },
    },
  });
};
