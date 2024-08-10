import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { CommentSection } from "../components/CommentSection";
import PostCard from "../components/PostCard";
import axios, { Axios } from "axios";

const PostPage = () => {
  const { feedbackId } = useParams();
  console.log("feedbackId-------->", feedbackId);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/api/feedback/getfeedbacks?postId=${feedbackId}`
        );
        const data = res.data;
        console.log("data..........<check data>", data);
        if (!res.status === 200 || !res.status === 201) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.status === 200 || res.status === 201) {
          setPost(data.feedBacks[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [feedbackId]);

  // useEffect(() => {
  //   try {
  //     const fetchRecentPosts = async () => {
  //       const res = await axios.get(`/api/feedback/getFeedbacks?limit=3`);
  //       const data = res.data;
  //       if (res.status === 200 || res.status === 201) {
  //         setRecentPosts(data.posts);
  //       }
  //     };
  //     fetchRecentPosts();
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />{" "}
      </div>
    );
  }
  return (
    <main className=" min-h-screen">
      <div className=" flex py-20 flex-col max-w-6xl mt-20 mx-auto border border-teal-400">
        <div className="border border-teal-400 rounded-xl mb-5 text-xl  p-3 text-center font-serif max-w-2xl mx-auto lg:text-2xl">
          <span className="text-base text-gray-400 px-2">From</span> {post.user}{" "}
          <span className="text-base text-gray-400 px-2">to</span>{" "}
          {post.instructorName !== "none"
            ? post.instructorName
            : post.studentName !== "none"
            ? post.studentName
            : post.campusName}
        </div>

        <div className="flex justify-between border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
          <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
          <span className="italic">
            {post && (post.feedback.length / 1000).toFixed(0)} mins read
          </span>
        </div>
        <div
          className="p-3 max-w-2xl mx-auto w-full post-content"
          dangerouslySetInnerHTML={{ __html: post && post.feedback }}
        ></div>
        <div className="flex justify-between  mx-auto w-full max-w-2xl">
          <span></span>
          <span
            className={`${
              post.approve ? "text-green-400" : "text-red-500"
            } border-teal-500 border w-32 flex justify-center p-2 rounded-xl`}
          >
            {post.approve ? "Approve" : "UnApprove"}
          </span>
        </div>
      </div>
    </main>
  );
};

export default PostPage;
