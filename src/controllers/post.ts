import { PrismaClient } from '@prisma/client';
import { RequestHandler } from 'express';
import { sendErrorRes } from 'src/utils/helper';

const PostModel = new PrismaClient().post;

export const createPost: RequestHandler = async (req, res) => {
  const { title, category, content, image } = req.body;

  const post = await PostModel.create({
    data: {
      title,
      category,
      content,
      image,
      authorId: req.user.id,
    },
  });

  res.status(201).json({ message: 'Post create successful.', postId: post.id });
};

export const getPostById: RequestHandler = async (req, res) => {
  const postId = req.params.id;

  const post = await PostModel.findUnique({ where: { id: postId } });
  if (!post) {
    return sendErrorRes(res, 'Post not found.', 404);
  }

  res.json(post);
};

export const getPosts: RequestHandler = async (req, res) => {
  const {
    userId,
    category,
    postId,
    searchTerm,
    sortDirection = 'desc',
    startIndex = 0,
    limit = 9,
  } = req.query;

  const whereClause: any = {};

  if (userId) {
    whereClause.userId = Number(userId);
  }

  if (category) {
    whereClause.category = category;
  }

  if (postId) {
    whereClause.id = Number(postId);
  }

  if (searchTerm) {
    whereClause.OR = [
      { title: { contains: searchTerm } },
      { content: { contains: searchTerm } },
    ];
  }

  const validSortDirections: Array<'asc' | 'desc'> = ['asc', 'desc'];
  const sortDirectionStr = validSortDirections.includes(
    sortDirection as 'asc' | 'desc'
  )
    ? (sortDirection as 'asc' | 'desc')
    : 'desc';

  const posts = await PostModel.findMany({
    where: whereClause,
    orderBy: {
      updatedAt: sortDirectionStr,
    },
    skip: Number(startIndex),
    take: Number(limit),
  });

  res.json(posts);
};

export const deletePost: RequestHandler = async (req, res) => {
  const postId = req.params.id;

  const post = await PostModel.findUnique({ where: { id: postId } });
  if (!post) {
    return sendErrorRes(res, 'Post not found.', 404);
  }

  if (req.user.role === 'TEACHER' && req.user.id !== post.authorId) {
    return sendErrorRes(res, 'You are not allowed to delete this post.', 403);
  }

  await PostModel.delete({
    where: {
      id: postId,
    },
  });

  res.json({ message: 'Post delete successful.' });
};

export const updatePost: RequestHandler = async (req, res) => {
  const postId = req.params.id;
  const { title, category, content, image } = req.body;

  const post = await PostModel.findUnique({ where: { id: postId } });
  if (!post) {
    return sendErrorRes(res, 'Post not found.', 404);
  }

  if (req.user.role === 'TEACHER' && req.user.id !== post.authorId) {
    return sendErrorRes(res, 'You are not allowed to update this post.', 403);
  }

  await PostModel.update({
    where: { id: postId },
    data: {
      title,
      category,
      content,
      image,
      updatedAt: new Date(),
    },
  });

  res.json({ message: 'Post update successful.' });
};
