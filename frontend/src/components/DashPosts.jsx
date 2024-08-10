import axios from "axios";
import { Button, Modal, Table, TextInput } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { FaXmark } from "react-icons/fa6";
import { RiSearchLine } from "react-icons/ri";
const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const [postIdToApprove, setPostIdToApprove] = useState("");
  const [unApproveFeedBacks, setUnApproveFeedBacks] = useState([]);
  const [approveFeedBacks, setApproveFeedBacks] = useState([]);
  const [allTeacherFeedBack, setAllTeacherFeedBack] = useState([]);
  const [allStudentFeedBack, setAllStudentFeedBack] = useState([]);
  const [allInstituteFeedBack, setAllInstituteFeedBack] = useState([]);
  const [indexForApproval, setIndexForApproval] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const res = await axios.get(
  //         `/api/post/getposts?userId=${currentUser._id}`
  //       );
  //       if (res.status === 200 || res.status === 201) {
  //         const data = res.data;
  //         setUserPosts(data.posts);
  //         if (data.posts.length < 9) {
  //           setShowMore(false);
  //         }
  //       }
  //     } catch (error) {
  //       console.log(error.message);
  //     }
  //   };
  //   if (currentUser.isAdmin) {
  //     fetchPosts();
  //   }
  // }, [currentUser._id]);

  const [feedbacks, setFeedbacks] = useState([]);
  useEffect(() => {
    const fetchFeedback = async () => {
      const res = await axios.get(`/api/feedback/getfeedbacks`);
      const data = await res.data;

      if (res.status === 200 || res.status === 201) {
        setFeedbacks(data.feedBacks);
        if (data.feedBacks.length < 9) {
          setShowMore(false);
        }
      }
    };
    fetchFeedback();
  }, []);
  // student Feedbacks
  const getAllFeedbacks = () => {
    const fetchFeedback = async () => {
      const res = await axios.get("/api/feedback/getfeedbacks");

      const data = await res.data;

      if (res.status === 200 || res.status === 201) {
        setFeedbacks(data.feedBacks);
      }
    };
    fetchFeedback();
  };
  const getAllStudentFeedbacks = () => {
    const fetchFeedback = async () => {
      const res = await axios.get("/api/feedback/getfeedbacks");

      const data = await res.data;

      if (res.status === 200 || res.status === 201) {
        const feedBacks = data.feedBacks;
        setFeedbacks(feedBacks?.filter((f) => f.studentName !== "none"));
      }
    };
    fetchFeedback();
  };
  const getAllTeacherFeedbacks = () => {
    const fetchFeedback = async () => {
      const res = await axios.get("/api/feedback/getfeedbacks");

      const data = await res.data;

      if (res.status === 200 || res.status === 201) {
        const feedBacks = data.feedBacks;
        setFeedbacks(feedBacks?.filter((f) => f.instructorName !== "none"));
      }
    };
    fetchFeedback();
  };
  const getAllInstituteFeedbacks = () => {
    const fetchFeedback = async () => {
      const res = await axios.get("/api/feedback/getfeedbacks");

      const data = await res.data;
      if (res.status === 200 || res.status === 201) {
        const feedBacks = data.feedBacks;
        setFeedbacks(feedBacks.filter((f) => f.campusName !== "none"));
      }
    };
    fetchFeedback();
  };

  const getAllUnApproveFeedbacks = () => {
    setIndexForApproval(1);
    setUnApproveFeedBacks(feedbacks.filter((f) => f.approve === false));
  };
  const getAllApproveFeedbacks = () => {
    setIndexForApproval(2);
    setApproveFeedBacks(feedbacks.filter((f) => f.approve === true));
  };

  const handleShowMore = async () => {
    const startIndex = feedbacks.length;
    try {
      const res = await axios.get(
        `/api/feedback/getfeedbacks?startIndex=${startIndex}`
      );
      console.log("res---------->", res);
      if (res.status === 200 || res.status === 201) {
        const data = res.data;
        setFeedbacks((prev) => [...prev, ...data.feedBacks]);
        if (data.feedBacks.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleDeleteFeedBack = async () => {
    setShowModal(false);
    try {
      const res = await axios.delete(
        `/api/feedback/deletefeedback/${postIdToDelete}/${currentUser._id}`
      );
      if (res.status === 200 || res.status === 201) {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleApproveFeedBack = async () => {
    setShowModal1(false);
    try {
      const res = await axios.delete(
        `/api/feedback/approvefeedback/${postIdToApprove}/${currentUser._id}`
      );
      if (res.status === 200 || res.status === 201) {
        // setUserPosts((prev) =>
        //   prev.filter((post) => post._id !== postIdToApprove)
        // );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    // navigate(`/search?${searchQuery}`);
  };
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && feedbacks?.length > 0 ? (
        <>
          <div className="flex justify-around w-full pb-5 ">
            <span
              onClick={getAllFeedbacks}
              className="cursor-pointer px-3 py-2 bg-gradient-to-r from-teal-500 via-purple-500 to-blue-500 rounded-lg text-white"
            >
              All Feedback
            </span>
            <span
              onClick={getAllStudentFeedbacks}
              className="cursor-pointer px-3 py-2 bg-gradient-to-r from-teal-500 via-purple-500 to-blue-500 rounded-lg text-white"
            >
              Student Feedback
            </span>
            <span
              onClick={getAllTeacherFeedbacks}
              className="cursor-pointer px-3 py-2 bg-gradient-to-r from-teal-500 via-purple-500 to-blue-500 rounded-lg text-white"
            >
              Teacher Feedback
            </span>
            <span
              onClick={getAllInstituteFeedbacks}
              className="cursor-pointer px-3 py-2 bg-gradient-to-r from-teal-500 via-purple-500 to-blue-500 rounded-lg text-white"
            >
              Institute Feedback
            </span>
          </div>
          <div className="flex justify-center w-full pb-5 gap-3">
            <form onSubmit={handleSubmit}>
              <TextInput
                type="text"
                placeholder="Search..."
                rightIcon={RiSearchLine}
                value={searchTerm}
                className="hidden lg:inline w-full"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            <button
              onClick={getAllApproveFeedbacks}
              className=" px-3 py-2 bg-green-600 rounded-lg text-white"
            >
              Approve FeedBacks
            </button>
            <button
              onClick={getAllUnApproveFeedbacks}
              className="cursor-pointer px-3 py-2 bg-red-500 rounded-lg text-white"
            >
              UnApprove FeedBacks
            </button>
          </div>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Date updated
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>

                <th scope="col" className="px-6 py-3">
                  RollNO
                </th>

                {/* <th scope="col" className="px-6 py-3">
                  Batch
                </th>
                <th scope="col" className="px-6 py-3">
                  Campus
                </th> */}
                <th scope="col" className="px-6 py-3">
                  FeedBack
                </th>
                <th scope="col" className="px-6 py-3">
                  Delete/Approve
                </th>
              </tr>
            </thead>
            <tbody>
              {!indexForApproval
                ? feedbacks.map((post) => (
                    <tr
                      key={post._id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {new Date(post.createdAt).toLocaleDateString()}
                      </th>
                      {/* <td className="px-6 py-4">{post.batch}</td>
                  <td className="px-6 py-4">{post.batch}</td> */}
                      <td className="px-6 py-4">{post.batch}</td>

                      <td className="px-6 py-4">{post.batch}</td>
                      <td className="px-6 py-4">
                        {post.feedback.slice(0, 20)}
                        <Link
                          to={`/feedback/${post._id}`}
                          className="text-blue-600 cursor-pointer pl-1"
                        >
                          Read more...
                        </Link>
                      </td>
                      <td className="px-6 py-4 ">
                        {/* {post.approve ? ( */}
                        {!post.approve ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setShowModal(true), setPostIdToDelete(post._id);
                              }}
                              className="cursor-pointer px-3 py-2 bg-red-500 rounded-lg text-white"
                            >
                              delete
                            </button>
                            <button
                              className=" px-3 py-2 bg-green-600 rounded-lg text-white"
                              onClick={() => {
                                setShowModal1(true),
                                  setPostIdToApprove(post._id);
                              }}
                            >
                              Approve
                            </button>
                          </div>
                        ) : (
                          <span className="flex justify-center gap-2 px-3 py-2 bg-green-600 rounded-lg text-white">
                            <span>Approved</span>{" "}
                            <IoCheckmarkDoneSharp className="text-white w-5 h-5" />
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                : indexForApproval === 1
                ? unApproveFeedBacks.map((post) => (
                    <tr
                      key={post._id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {new Date(post.createdAt).toLocaleDateString()}
                      </th>
                      {/* <td className="px-6 py-4">{post.batch}</td>
                  <td className="px-6 py-4">{post.batch}</td> */}
                      <td className="px-6 py-4">{post.batch}</td>

                      <td className="px-6 py-4">{post.batch}</td>
                      <td className="px-6 py-4">
                        {post.feedback.slice(0, 20)}
                        <Link
                          to={`/feedback/${post._id}`}
                          className="text-blue-600 cursor-pointer pl-1"
                        >
                          Read more...
                        </Link>
                      </td>
                      <td className="px-6 py-4 ">
                        {/* {post.approve ? ( */}
                        {!post.approve ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setShowModal(true), setPostIdToDelete(post._id);
                              }}
                              className="cursor-pointer px-3 py-2 bg-red-500 rounded-lg text-white"
                            >
                              delete
                            </button>
                            <button
                              className=" px-3 py-2 bg-green-600 rounded-lg text-white"
                              onClick={() => {
                                setShowModal1(true),
                                  setPostIdToApprove(post._id);
                              }}
                            >
                              Approve
                            </button>
                          </div>
                        ) : (
                          <span className="flex justify-center gap-2 px-3 py-2 bg-green-600 rounded-lg text-white">
                            <span>Approved</span>{" "}
                            <IoCheckmarkDoneSharp className="text-white w-5 h-5" />
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                : indexForApproval === 2
                ? approveFeedBacks.map((post) => (
                    <tr
                      key={post._id}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {new Date(post.createdAt).toLocaleDateString()}
                      </th>
                      {/* <td className="px-6 py-4">{post.batch}</td>
                  <td className="px-6 py-4">{post.batch}</td> */}
                      <td className="px-6 py-4">{post.batch}</td>

                      <td className="px-6 py-4">{post.batch}</td>
                      <td className="px-6 py-4">
                        {post.feedback.slice(0, 20)}
                        <Link
                          to={`/feedback/${post._id}`}
                          className="text-blue-600 cursor-pointer pl-1"
                        >
                          Read more...
                        </Link>
                      </td>
                      <td className="px-6 py-4 ">
                        {/* {post.approve ? ( */}
                        {!post.approve ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setShowModal(true), setPostIdToDelete(post._id);
                              }}
                              className="cursor-pointer px-3 py-2 bg-red-500 rounded-lg text-white"
                            >
                              delete
                            </button>
                            <button
                              className=" px-3 py-2 bg-green-600 rounded-lg text-white"
                              onClick={() => {
                                setShowModal1(true),
                                  setPostIdToApprove(post._id);
                              }}
                            >
                              Approve
                            </button>
                          </div>
                        ) : (
                          <span className="flex justify-center gap-2 px-3 py-2 bg-green-600 rounded-lg text-white">
                            <span>Approved</span>{" "}
                            <IoCheckmarkDoneSharp className="text-white w-5 h-5" />
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>There is no FeedBack yet!</p>
      )}
      <Modal
        show={showModal1}
        onClose={() => setShowModal1(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to approve this feedBack?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleApproveFeedBack}>
                Yes I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal1(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this feedBack?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteFeedBack}>
                Yes I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashPosts;
