export default () => ({
  jwtSecret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRESIN,
});
