import React from 'react';
import "./Dashboard.css";
import { CourseData } from '../../contexts/CourseContext';
import CourseCard from '../../components/courseCard/CourseCard';

const Dashboard = () => {
    const { myCourse, loading, error } = CourseData();

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className='student-dashboard'>
            <h2>All Enrolled Courses</h2>
            <div className="dashboard-content">
                {error ? (
                    <p>{error}</p> // Display error message if there is an issue fetching courses
                ) : (
                    myCourse && myCourse.length > 0 ? (
                        myCourse.map((data) => (
                            <CourseCard key={data._id} course={data} />
                        ))
                    ) : (
                        <p>No Course Enrolled Yet</p>
                    )
                )}
            </div>
        </div>
    );
}

export default Dashboard;