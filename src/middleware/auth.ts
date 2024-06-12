import { RequestHandler } from 'express';
import { sendErrorRes } from 'src/utils/helper';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET!;
const UserModel = new PrismaClient().user;

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user: UserProfile;
    }
  }
}

export const verifyToken: RequestHandler = async (req, res, next) => {
  try {
    const authToken = req.headers.authorization;
    if (!authToken) {
      return sendErrorRes(res, 'Unauthorized request.', 403);
    }

    const token = authToken.split('Bearer ')[1];
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await UserModel.findUnique({ where: { id: payload.id } });
    if (!user) {
      return sendErrorRes(res, 'Unauthorized request.', 403);
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    };

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return sendErrorRes(res, 'Unauthorized assess', 401);
    }

    next(error);
  }
};

export const verifyRole = (roles: string[]): RequestHandler => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      sendErrorRes(res, 'Access denied.', 403);
    }
  };
};
