import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';
import { sendErrorRes } from 'src/utils/helper';

const PostModel = new PrismaClient().post;

export const createPost: RequestHandler = async (req, res) => {
  const { title, category, content, image } = req.body;

  await PostModel.create({
    data: {
      title,
      category,
      content,
      image,
      authorId: req.user.id,
    },
  });

  res.status(201).json({ message: 'Created a new post.' });
};
