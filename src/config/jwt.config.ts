export default () => ({
  jwtSecret: process.env.JWT_SECRET || 'segredo_super_secreto',
  expiresIn: process.env.JWT_EXPIRESIN || '1d',
});
