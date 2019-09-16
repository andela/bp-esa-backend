import jwt from 'jsonwebtoken';
import env from '../validator';

// eslint-disable-next-line import/prefer-default-export
export const generateToken = info => jwt.sign(info, env.JWT_KEY, { expiresIn: '1d' });
