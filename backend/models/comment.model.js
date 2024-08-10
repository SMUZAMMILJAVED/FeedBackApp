import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    feedbackId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "FeedBack",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    profilePicture: {
      type: String,
    },
    userName: {
      type: String,
    },
    // likes: {
    //   type: Array,
    //   default: [],
    // },
    // numberOfLikes: {
    //   type: Number,
    //   default: 0,
    // },
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
