import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface TokenPayload {
  userId: string;
  type: 'access' | 'refresh';
}

/**
 * Generate an access token for a user
 * @param userId - The user's ID
 * @returns JWT access token
 */
export function generateAccessToken(userId: string): string {
  const payload: TokenPayload = {
    userId,
    type: 'access',
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtAccessExpiration,
  });
}

/**
 * Generate a refresh token for a user
 * @param userId - The user's ID
 * @returns JWT refresh token
 */
export function generateRefreshToken(userId: string): string {
  const payload: TokenPayload = {
    userId,
    type: 'refresh',
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtRefreshExpiration,
  });
}

/**
 * Generate both access and refresh tokens
 * @param userId - The user's ID
 * @returns Object containing both tokens
 */
export function generateTokenPair(userId: string): {
  accessToken: string;
  refreshToken: string;
} {
  return {
    accessToken: generateAccessToken(userId),
    refreshToken: generateRefreshToken(userId),
  };
}

/**
 * Verify an access token
 * @param token - The JWT token to verify
 * @returns Decoded payload
 * @throws Error if token is invalid or expired
 */
export function verifyAccessToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;

    if (decoded.type !== 'access') {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Access token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid access token');
    }
    throw error;
  }
}

/**
 * Verify a refresh token
 * @param token - The JWT token to verify
 * @returns Decoded payload
 * @throws Error if token is invalid or expired
 */
export function verifyRefreshToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    }
    throw error;
  }
}

/**
 * Decode a token without verifying (useful for debugging)
 * @param token - The JWT token to decode
 * @returns Decoded payload or null if invalid
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch {
    return null;
  }
}
