import React, { useEffect, useState } from "react";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
export default function FeedBack() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const handleChange = (e) => {
    if (e.target.value !== "instructor" && e.target.value !== "campusName") {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value.trim(),
        user: currentUser.username,
        profilePicture: currentUser.profilePicture,
      });
    } else {
      setFormData({ ...formData });
    }
    if (e.target.value === "student") {
      console.log("student selected");
      setRole("student");
    } else if (e.target.value === "instructor") {
      setRole("instructor");
    } else if (e.target.value === "campusName") {
      setRole("campusName");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await axios.post("/api/feedback/create", formData);
      const data = res.data;
      if (res.status === 200 || res.status === 201) {
        navigate("/");
        return setErrorMessage(data.message);
      }
      setLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="py-10 px-4 md:px-0">
      <h3 className="text-center text-2xl pb-10">
        Hi {currentUser && currentUser.username} it is your FeedBack Form
      </h3>
      <form className="max-w-2xl mx-auto" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6"></div>

        <div className="grid grid-cols-2 gap-6">
          <h3 className="text-2xl py-2">Select Your FeedBack for:</h3>
          <div className="flex items-center  gap-8 ">
            <div className="flex items-center ">
              <input
                id="campusSelection"
                type="radio"
                name="role"
                value="campusName"
                onChange={handleChange}
                required={true}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="campusSelection"
                className="ms-2 text-md font-medium text-gray-900 dark:text-gray-300"
              >
                Campus
              </label>
            </div>
            {currentUser?.role === "teacher" ? (
              <div className="flex items-center">
                <input
                  id="student"
                  type="radio"
                  name="role"
                  value="student"
                  onChange={handleChange}
                  required={true}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="student"
                  className="ms-2 text-md font-medium text-gray-900 dark:text-gray-300"
                >
                  Student
                </label>
              </div>
            ) : (
              <div className="flex items-center ">
                <input
                  id="instructorSelection"
                  type="radio"
                  name="role"
                  value="instructor"
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="instructorSelection"
                  className="ms-2 text-md font-medium text-gray-900 dark:text-gray-300"
                >
                  Instructor
                </label>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 py-3 pb-5">
          {role === "student" ? (
            <>
              <div>
                <Label value="Student Name" />
                <TextInput
                  type="text"
                  placeholder="Student Name"
                  id="studentName"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label value="RollNo" />
                <TextInput
                  type="number"
                  placeholder="RollNO"
                  id="rollNO"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label value=" Batch" />
                <TextInput
                  type="number"
                  placeholder="User Batch"
                  id="batch"
                  onChange={handleChange}
                />
              </div>
            </>
          ) : role === "instructor" ? (
            <div className="">
              <label
                htmlFor="instructorName"
                className="block  mb-2 text-lg font-medium text-gray-900 dark:text-white"
              >
                Instructor
              </label>
              <label
                htmlFor="instructorName"
                className="block mb-2 text-sm text-gray-900 dark:text-white"
              >
                Please fill Your Instructor field
              </label>
              <select
                id="instructorName"
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option>Select Your Instructor</option>
                <option value="Sir Nadir" className="uppercase">
                  Sir Nadir
                </option>
                <option value="Sir Ghous Ahmed" className="uppercase">
                  Sir Ghous Ahmed
                </option>
              </select>
            </div>
          ) : role === "campusName" ? (
            <div className="">
              <label
                htmlFor="campusName"
                className="block  mb-2 text-lg font-medium text-gray-900 dark:text-white"
              >
                Campus Name
              </label>
              <label
                htmlFor="campusName"
                className="block mb-2 text-sm text-gray-900 dark:text-white"
              >
                Please fill Campus Name field
              </label>
              <select
                id="campusName"
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option>Select Your Campus</option>
                <option value="Bahadurabad" className="uppercase">
                  Bahadurabad
                </option>
                <option value="Gulshan" className="uppercase">
                  Ghulshan
                </option>
              </select>
            </div>
          ) : null}
          {currentUser?.role === "student" && (
            <div className="">
              <label
                htmlFor="course"
                className="block  mb-2 text-lg font-medium text-gray-900 dark:text-white"
              >
                Course
              </label>
              <label
                htmlFor="fullName"
                className="block mb-2 text-sm text-gray-900 dark:text-white"
              >
                Please fill Your Course field
              </label>
              <select
                id="course"
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option>Choose a Course</option>
                <option value="Web & app" className="uppercase">
                  Web & app
                </option>
                <option value="Graphic Designing" className="uppercase">
                  Graphic Designing
                </option>
              </select>
            </div>
          )}
        </div>
        <label
          htmlFor="feedback"
          className="block mb-2 text-lg font-medium text-gray-900 dark:text-white"
        >
          FeedBack
        </label>
        <label
          htmlFor="fullName"
          className="block mb-2 text-sm text-gray-900 dark:text-white"
        >
          Please fill Your FeedBack field
        </label>
        <textarea
          id="feedback"
          rows="4"
          onChange={handleChange}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write Your Feedback..."
        ></textarea>

        <Button
          gradientDuoTone="greenToBlue"
          type="submit"
          disabled={loading}
          className="w-3/12 mt-8 text-md"
        >
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Loading...</span>
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </div>
  );
}
