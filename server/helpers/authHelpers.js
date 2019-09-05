import jwt from 'jsonwebtoken';

// eslint-disable-next-line import/prefer-default-export
export const generateToken = info => jwt.sign(info, process.env.JWT_KEY, { expiresIn: '1d' });
