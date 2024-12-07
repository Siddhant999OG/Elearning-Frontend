import React, { useEffect } from 'react';
import "./CourseStudy.css";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CourseData } from '../../contexts/CourseContext';
import { server } from '../../main'; // Make sure this import is correct

const CourseStudy = ({ user }) => {
    const params = useParams();
    const { fetchCourse, course } = CourseData();
    const navigate = useNavigate();

    // Redirect user if not enrolled or if role is not "admin"
    useEffect(() => {
        if (user && user.role !== "admin" && !user.subscription.includes(params.id)) {
            navigate("/"); // Perform redirection if conditions are met
        }
    }, [user, params.id, navigate]);

    // Fetch course data when component mounts or params.id changes
    useEffect(() => {
        fetchCourse(params.id);
    }, [params.id, fetchCourse]);

    return (
        <>
            {
                course && (
                    <div className="course-study-page">
                        <img src={`${server}/${course.image}`} alt="Course" width={350} />
                        <h2>{course.title}</h2>
                        <h4>{course.description}</h4>
                        <h5>by {course.createdBy}</h5>
                        <h5>Duration - {course.duration} weeks</h5>
                        <Link to={`/lectures/${course._id}`}>Go to Lectures</Link>
                    </div>
                )
            }
        </>
    );
}

export default CourseStudy;
