export const requireApproved = (req, res, next) => {
  if (req.user && req.user.isApproved === false) {
    return res.status(403).json({
      success: false,
      message: 'Your chef account is pending admin approval. You cannot post recipes yet.',
    })
  }
  next()
}
