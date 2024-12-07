import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { server } from "../main";

const CourseContext = createContext();

export const CourseContextProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [course, setcourse] = useState([]);
    const [myCourse, setMycourse] = useState(null);  // Initially null for better loading/error handling
    const [error, setError] = useState(null); // Error state for handling fetch issues

    async function fetchCourses() {
        try {
            const { data } = await axios.get(`${server}/api/v1/allCourses`);
            setCourses(data.courses);
            setLoading(false); // Set loading to false when data is fetched
        } catch (error) {
            console.log(error);
            setError('Failed to load courses');
            setLoading(false); // Set loading to false on error
        }
    }

    async function fetchCourse(id) {
        try {
            const { data } = await axios.get(`${server}/api/v1/singlecourse/${id}`);
            setcourse(data.course);  // Update the course state
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchMycourse() {
        try {
            const { data } = await axios.get(`${server}/api/v1/getMyCourse`, {
                headers: {
                    token: localStorage.getItem("token")
                }
            });
            setMycourse(data.courses);
        } catch (error) {
            console.log(error);
            setError('Failed to load enrolled courses');
        }
    }

    useEffect(() => {
        fetchCourses();
        fetchMycourse();
    }, []);

    return (
        <CourseContext.Provider value={{ courses, fetchCourses, loading, fetchCourse, course, fetchMycourse, myCourse, error }}>
            {children}
        </CourseContext.Provider>
    );
};

export const CourseData = () => useContext(CourseContext);