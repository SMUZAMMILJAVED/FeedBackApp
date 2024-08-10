import React, { useEffect, useState } from "react";
import { FaRegMessage } from "react-icons/fa6";
import { AiFillLike } from "react-icons/ai";
import { SlLike } from "react-icons/sl";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/PostCard";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";
export default function Home() {
  const { currentUser } = useSelector((state) => state.user);
  console.log("currentUser--------<", currentUser);
  const [feedback, setFeedback] = useState([]);
  useEffect(() => {
    const fetchFeedback = async () => {
      const res = await axios.get("/api/feedback/getfeedbacks");

      const data = await res.data;

      if (res.status === 200 || res.status === 201) {
        setFeedback(data.feedBacks);
      }
    };
    fetchFeedback();
  }, []);

  // today code
  const [formData, setFormData] = useState({});
  const [commentVal, setCommentVal] = useState("");
  const [feedbackGet, setFeedbackGet] = useState("");
  const [commentModal, setCommentModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [commentIndex, setCommentIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  // const handleChange = (e) => {
  //   if (!comment) {
  //     const formData = {
  //       content: comment,
  //       feedbackId: feedbackGet,
  //       userId: currentUser._id,
  //     };
  //   } else {
  //     alert("fill All Blanks");
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (commentVal) {
      try {
        setLoading(true);
        setErrorMessage(null);
        const formData = {
          content: commentVal,
          feedbackId: feedbackGet,
          userId: currentUser._id,
          profilePicture: currentUser.profilePicture,
          userName: currentUser.username,
        };
        const res = await axios.post("/api/comment/create", formData);
        const data = res.data;
        if (!res.status === 200 || !res.status === 201) {
          return setErrorMessage(data.message);
        }
        setLoading(false);
      } catch (error) {
        setErrorMessage(error.message);
        setLoading(false);
      }
      setCommentModal(false);
    } else {
      alert("fill the blank");
    }
  };
  const handleAllComments = async (feedbackId) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const resComment = await axios.get(
        `/api/comment/getFeedBackComments/${feedbackId}`
      );
      const data = resComment.data;
      console.log("dataAllComments------->", data);
      setComments(data);
      if (!res.status === 200 || !res.status === 201) {
        return setErrorMessage(data.message);
      }
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
    // setCommentModal(false);
  };
  const handleLike = async (feedbackId) => {
    try {
      // setLoading(true);
      // setErrorMessage(null);
      const res = await axios.put(`/api/feedback/likeFeedback/${feedbackId}`);
      const data = res.data;
      // console.log("response Like------->", data);
      // if (!res.status === 200 || !res.status === 201) {
      //   return setErrorMessage(data.message);
      // }
      // setLoading(false);
      setFeedback(
        feedback.map((comment) =>
          comment._id === feedbackId
            ? {
                ...comment,
                likes: data.likes,
                numberOfLikes: data.likes.length,
              }
            : comment
        )
      );
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };
  console.log("feedback Like------->", feedback);
  return (
    // feedback list
    <div className="mb-32 mt-10 max-w-4xl mx-auto px-4 xl:px-0">
      <div className="flex justify-between pb-4">
        <div></div>
        <Link
          to="/feedback-form"
          className=" whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
        >
          <span className="px-2 py-1 bg-gradient-to-r from-teal-500 via-purple-500 to-blue-500 rounded-lg text-white">
            Give Feed Back
          </span>
        </Link>
      </div>
      <div className="flex flex-col gap-5">
        {feedback.map((fb, index) => (
          <div key={index}>
            {fb?.approve ? (
              <div className="flex flex-col gap-3 border border-teal-400 p-5 rounded-xl">
                <div className="flex gap-5">
                  <img
                    src={fb.profilePicture}
                    className="w-10 h-10 rounded-full"
                  />

                  <p className="text-md md:text-lg lg:text-xl ">
                    {fb.feedback}
                  </p>
                </div>

                {fb.studentName !== "none" ? (
                  <div className="flex justify-between">
                    <div className="">
                      <span className="text-xs md:text-sm pr-3">{fb.user}</span>
                      <span className="text-[14px]">to</span>
                      <span className="text-xs md:text-sm pl-3">
                        {fb.studentName}
                      </span>
                    </div>
                    <div className="flex gap-5 items-center">
                      <div className="flex gap-3 items-center">
                        <SlLike
                          onClick={() => handleLike(fb._id)}
                          // className="w-6 cursor-pointer h-6 text-green-200"
                          className={`w-6 cursor-pointer h-6 text-gray-400 ${
                            currentUser &&
                            fb.likes.includes(currentUser._id) &&
                            "!text-green-400"
                          }`}
                        />
                        <span className="text-sm self-end">
                          {fb.numberOfLikes && fb.numberOfLikes}
                        </span>
                      </div>
                      <div className="relative">
                        <div className="flex gap-3 items-center">
                          <FaRegMessage
                            onClick={() => {
                              setCommentIndex(index);
                              setCommentModal(!commentModal);
                              setFeedbackGet(fb._id);
                              handleAllComments(fb._id);
                            }}
                            className="w-5 cursor-pointer h-5 text-green-200"
                          />
                          <span>{comments.length}</span>
                        </div>
                        {commentModal && commentIndex === index ? (
                          <div className="w-96 z-20 absolute top-8 right-0">
                            <div className="overflow-y-scroll h-52 p-3 border border-teal-400 rounded-t-2xl bg-gray-800 flex flex-col gap-2">
                              {comments.map((c, index) => (
                                <div
                                  key={index}
                                  className="flex gap-2 items-center justify-between"
                                >
                                  <div className="flex flex-col w-20">
                                    <img
                                      src={c.profilePicture}
                                      className="w-7 h-7 rounded-full"
                                    />
                                    <span className="text-xs">
                                      {c.userName}
                                    </span>
                                  </div>
                                  <p
                                    className="bg-gray-800 border-teal-400 border w-full rounded-xl px-3 text-gray-100 p-2"
                                    key={index}
                                  >
                                    {c.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                            <form
                              onSubmit={handleSubmit}
                              className="bg-gray-900 border border-teal-400 rounded-b-2xl shadow-md  px-4 pt-3 pb-3 mb-4"
                            >
                              <div className="mb-2">
                                <input
                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  id="username"
                                  type="text"
                                  value={commentVal}
                                  onChange={(e) =>
                                    setCommentVal(e.target.value)
                                  }
                                  placeholder="Enter Comment..."
                                />
                              </div>

                              <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                              >
                                Submit
                              </button>
                            </form>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <div>
                      <span className="text-sm pr-3">{fb.user}</span>
                      <span className="text-[14px]">to</span>
                      {fb.instructorName !== "none" ? (
                        <span className="text-sm pl-3">
                          {fb.instructorName}
                        </span>
                      ) : (
                        <span className="text-sm pl-3">
                          {fb.campusName} institute
                        </span>
                      )}
                    </div>
                    <div className="flex gap-5 items-center">
                      <div className="flex gap-2 items-center">
                        <AiFillLike
                          onClick={() => handleLike(fb._id)}
                          className={`w-6 cursor-pointer h-6 text-gray-400 ${
                            currentUser &&
                            fb.likes.includes(currentUser._id) &&
                            "!text-green-300 overflow-hidden"
                          }`}
                        />
                        <span className="text-sm self-end">
                          {fb.numberOfLikes && fb.numberOfLikes}
                        </span>
                      </div>
                      <div className="relative">
                        <FaRegMessage
                          onClick={() => {
                            setCommentIndex(index);
                            setCommentModal(!commentModal);
                            setFeedbackGet(fb._id);
                            handleAllComments(fb._id);
                          }}
                          className="w-5 cursor-pointer h-5 text-green-200"
                        />
                        {commentModal && commentIndex === index ? (
                          <div className="w-96 z-20 absolute top-8 right-0">
                            <div className="overflow-y-scroll h-52 p-3 border border-teal-400 rounded-t-2xl bg-gray-800 flex flex-col gap-2">
                              {comments.map((c, index) => (
                                <div
                                  key={index}
                                  className="flex gap-2 items-center justify-between"
                                >
                                  <div className="flex flex-col w-20">
                                    <img
                                      src={c.profilePicture}
                                      className="w-7 h-7 rounded-full"
                                    />
                                    <span className="text-xs">
                                      {c.userName}
                                    </span>
                                  </div>
                                  <p
                                    className="bg-gray-800 border-teal-400 border w-full rounded-xl px-3 text-gray-100 p-2"
                                    key={index}
                                  >
                                    {c.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                            <form
                              onSubmit={handleSubmit}
                              className="bg-gray-900 border border-teal-400 rounded-b-2xl shadow-md  px-4 pt-3 pb-3 mb-4"
                            >
                              <div className="mb-2">
                                <input
                                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  id="username"
                                  type="text"
                                  value={commentVal}
                                  onChange={(e) =>
                                    setCommentVal(e.target.value)
                                  }
                                  placeholder="Enter Comment..."
                                />
                              </div>

                              <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                              >
                                Submit
                              </button>
                            </form>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
