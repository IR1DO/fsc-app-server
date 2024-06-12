import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { sendErrorRes } from 'src/utils/helper';
import { compare, genSalt, hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const UserModel = new PrismaClient().user;

export const createNewUser: RequestHandler = async (req, res) => {
  /*
  NOTE
  */

  const { username, email, password, role } = req.body;

  const existingUser = await UserModel.findUnique({ where: { email } });
  if (existingUser) {
    return sendErrorRes(
      res,
      'Unauthorized request, email is already in use.',
      401
    );
  }

  const salt = await genSalt(10);
  const hashPassword = await hash(password, salt);

  await UserModel.create({
    data: { username, email, password: hashPassword, role },
  });

  res.json({ message: 'Sign up successfully.' });
};

export const signIn: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findUnique({ where: { email } });
  if (!user) {
    return sendErrorRes(res, 'Email/Password mismatch', 403);
  }

  const isMatched = await compare(password, user.password);
  if (!isMatched) {
    return sendErrorRes(res, 'Email/Password mismatch', 403);
  }

  const payload = { id: user.id };
  const accessToken = jwt.sign(payload, JWT_SECRET);

  res.json({
    profile: {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    },
    access_token: accessToken,
  });
};

export const signOut: RequestHandler = async (req, res) => {
  res.status(200).json({ message: 'Sign out successful.' });
};
