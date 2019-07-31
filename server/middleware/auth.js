import jwt from 'jsonwebtoken';

export const setJwtKey = (nodeEnv) => {
  if (nodeEnv === 'test') return process.env.JWT_KEY;
  return Buffer.from(process.env.JWT_KEY, 'base64');
};

const authenticateUser = async (req, res, next) => {
  const token = await req.headers.authorization;
  if (!token) return res.status(401).json({ success: false, error: 'No token provided' });

  jwt.verify(
    token,
    setJwtKey(process.env.NODE_ENV),
    (error, decodedToken) => {
      if (error) return res.status(401).json({ success: false, error: 'Token is not valid' });
      req.user = decodedToken;
      return next();
    },
  );
  return false;
};

export default authenticateUser;
