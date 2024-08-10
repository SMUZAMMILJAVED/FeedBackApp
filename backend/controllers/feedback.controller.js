import FeedBack from "../models/feedBack.model.js";
import { errorHandler } from "../utils/error.js";

export const createFeedBack = async (req, res, next) => {
  const newFeedBack = new FeedBack({
    ...req.body,
    userId: req.user.id,
  });
  try {
    const saveFeedBack = await newFeedBack.save();
    res.status(201).json(saveFeedBack);
  } catch (error) {
    next(error);
  }
};
export const getFeedBacks = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const feedBacks = await FeedBack.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
    const totalFeedBacks = await FeedBack.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthFeedBacks = await FeedBack.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(201).json({
      feedBacks,
      totalFeedBacks,
      lastMonthFeedBacks,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFeedBack = async (req, res, next) => {
  console.log("req.params-------->", req.params);
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    next(errorHandler(403, "You are not allowed to delete this post"));
  }
  try {
    await FeedBack.findByIdAndDelete(req.params.postId);
    res.status(200).json("The post has been deleted");
  } catch (error) {
    next(error);
  }
};
export const approveFeedBack = async (req, res, next) => {
  console.log("req.params-------->", req.params);
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    next(errorHandler(403, "You are not allowed to delete this post"));
  }
  try {
    await FeedBack.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          ...req.body,
          approve: true,
        },
      },
      { new: true }
    );

    res.status(200).json("The post has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updateFeedBack = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    next(errorHandler(403, "You are not allowed to delete this post"));
  }
  try {
    const updatePost = await FeedBack.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatePost);
  } catch (error) {
    next(error);
  }
};

// like
export const likeFeedBack = async (req, res, next) => {
  try {
    const feedback = await FeedBack.findById(req.params.feedbackId);
    if (!feedback) {
      return next(errorHandler(404, "Feedback not found"));
    }
    const userIndex = feedback.likes.indexOf(req.user.id);
    console.log("userIndex-------------------->", userIndex);
    if (userIndex === -1) {
      feedback.numberOfLikes += 1;
      feedback.likes.push(req.user.id);
    } else {
      feedback.numberOfLikes -= 1;
      feedback.likes.splice(userIndex, 1);
    }
    await feedback.save();
    res.status(200).json(feedback);
  } catch (error) {
    next(error);
  }
};
