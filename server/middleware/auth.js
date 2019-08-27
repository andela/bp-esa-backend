import jwt from 'jsonwebtoken';

export const setJwtKey = (nodeEnv) => {
  if (nodeEnv === 'test') return process.env.JWT_KEY;
  return Buffer.from(process.env.JWT_KEY, 'base64');
};

const authenticateUser = async (req, res, next) => {
  const token = await req.headers.authorization;
  if (!token) return res.status(401).json({ success: false, error: 'No token provided' });

  jwt.verify(token, setJwtKey(process.env.NODE_ENV), (error, decodedToken) => {
    const userDetails = decodedToken;
    const { UserInfo } = userDetails || {};
    const roles = UserInfo ? UserInfo.roles : [];
    const userRole = process.env.USER_ROLE;
    const adminRoles = Object.keys(roles).includes(userRole);
    if (adminRoles) {
      if (error) return {};
      req.user = decodedToken;
      return next();
    }
    if (decodedToken === undefined) {
      return res.status(401).json({ success: false, error: 'Token is not valid' });
    }
    return res
      .status(403)
      .json({ success: false, error: "the user doesn't have permissions to perform this action" });
  });
  return false;
};

export default authenticateUser;
