import React from 'react';
import "./Courses.css";
import { CourseData } from '../../contexts/CourseContext';
import CourseCard from '../../components/courseCard/CourseCard';

const Courses = () => {
  const { courses, loading } = CourseData(); // Call the hook correctly

  if (loading) {
    return <p>Loading courses...</p>; // Show loading message while data is being fetched
  }

  return (
    <div className="courses">
      <h2>Available Courses</h2>

      <div className="course-container">
        {courses && courses.length > 0 ? (
          courses.map((data) => <CourseCard key={data._id} course={data} />)
        ) : (
          <p>No Courses Yet!</p>
        )}
      </div>
    </div>
  );
};

export default Courses;