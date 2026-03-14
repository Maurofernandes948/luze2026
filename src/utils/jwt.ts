import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  // During build/init this might be missing, but it should fail at runtime if accessed
  console.warn('JWT_SECRET is not defined in environment variables.');
}

export interface TokenPayload {
  id: string | number;
  email: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  if (!JWT_SECRET) throw new Error('JWT_SECRET not configured');
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): TokenPayload | null => {
  if (!JWT_SECRET) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};
