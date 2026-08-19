import { useState } from "react";
import { createCourse } from "../../api/courseApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AddCourse() {
  const navigate = useNavigate();

  const [course, setCourse] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    duration: "",
    thumbnail: "",
    status: "ACTIVE",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCourse({
      ...course,
      [name]: name === "price" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createCourse({
        ...course,
        price: Number(course.price),
      });

      toast.success("Course Added Successfully");
      navigate("/admin/courses");
    } catch (error) {
      console.error(error);
      toast.error("Failed to Add Course");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Add Course
          </h1>

          <p className="text-gray-400 mt-1">
            Create a new course for the LMS.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/courses")}
          className="px-5 py-3 rounded-xl bg-[#1A1F2B] border border-gray-700 text-cyan-400 hover:bg-[#22283A] transition"
        >
          ← Back
        </button>

      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#1A1F2B] border border-gray-800 rounded-2xl p-8 grid grid-cols-2 gap-6"
      >

        <input
          type="text"
          name="title"
          placeholder="Course Title"
          value={course.title}
          onChange={handleChange}
          className="bg-[#0B0F19] border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={course.category}
          onChange={handleChange}
          className="bg-[#0B0F19] border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={course.price}
          onChange={handleChange}
          className="bg-[#0B0F19] border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          required
        />

        <input
          type="text"
          name="duration"
          placeholder="Duration"
          value={course.duration}
          onChange={handleChange}
          className="bg-[#0B0F19] border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          required
        />

        <input
          type="text"
          name="thumbnail"
          placeholder="Thumbnail URL"
          value={course.thumbnail}
          onChange={handleChange}
          className="bg-[#0B0F19] border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
        />

        <select
          name="status"
          value={course.status}
          onChange={handleChange}
          className="bg-[#0B0F19] border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500"
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>

        <textarea
          name="description"
          placeholder="Course Description"
          value={course.description}
          onChange={handleChange}
          rows="5"
          className="col-span-2 bg-[#0B0F19] border border-gray-700 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
        />

        <button
          type="submit"
          className="col-span-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold py-3 rounded-xl transition"
        >
          Save Course
        </button>

      </form>

    </div>
  );
}

export default AddCourse;