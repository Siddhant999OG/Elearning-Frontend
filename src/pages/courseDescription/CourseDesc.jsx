import React, { useEffect, useState } from 'react';
import './CourseDesc.css';
import { useNavigate, useParams } from 'react-router-dom';
import { CourseData } from '../../contexts/CourseContext';
import { server } from '../../main';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useUserData } from '../../contexts/UserContexts';
import Loading from '../../components/loading/Loading';

const CourseDesc = ({ user }) => {
    const params = useParams(); // Get course ID from URL params
    const navigate = useNavigate(); // Fix the navigate hook by calling it as a function
    const { fetchCourse, course, fetchCourses, fetchMycourse } = CourseData(); // Access fetchCourse and course from context
    const [loading, setloading] = useState(false);
    const {fetchUser} = useUserData();

    useEffect(() => {
            fetchCourse(params.id); // Fetch the course based on the ID from the URL
    }, []); // Add fetchCourse and params.id as dependencies

    const checkoutHandler = async () => {
        const token = localStorage.getItem("token");
        setloading(true);
    
        try {
            const { data: { order } } = await axios.post(`${server}/api/v1/checkout/${params.id}`, {}, {
                headers: { token },
            });
    
            const options = {
                "key": "rzp_test_3CRFQXTfggO5ld", // Your Razorpay Key ID
                "amount": order.id, // Amount in paise (INR), hence 50000 for ₹500
                "currency": "INR",
                "name": "E-Learning", // Your business name
                "description": "Learn with us",
                "order_id": order.id,
    
                handler: async function (response) {
                    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
    
                    try {
                        const { data } = await axios.post(`${server}/api/v1/verify/${params.id}`, {
                            razorpay_order_id,
                            razorpay_payment_id,
                            razorpay_signature,
                        }, {
                            headers: { token },
                        });
    
                        // Update user data and courses after successful payment
                        await fetchUser();  // Ensure that this updates the user context
                        await fetchCourses();  // Re-fetch courses to reflect updated user subscriptions
                        await fetchMycourse();
    
                        toast.success(data.message);  // Display success message
                        navigate(`/payment-success/${razorpay_payment_id}`);  // Redirect to success page
                    } catch (error) {
                        toast.error(error.response?.data?.message || "Payment verification failed.");
                        setloading(false);  // Stop loading
                    }
                },
    
                theme: { color: "#8a4baf" },
            };
    
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            toast.error("Failed to initiate payment.");
            setloading(false);
        }
    };    
    

    return (
        <>
        {
            loading ? <Loading/> : 
            <>
            {course && (
                <div className="course-description">
                    <div className="course-header">
                        <img src={`${server}/${course.image}`} alt="Course" className="course-image" />
                        <div className="course-info">
                            <div className="info">
                                <h2>{course.title}</h2>
                                <p>Instructor: {course.createdBy}</p>
                                <p>Duration: {course.duration} weeks</p>
                                <p>{course.description}</p>
                            </div>
                        </div>
                    </div>
                    <p>Let's get started with this course at ₹{course.price}</p>
                    {
                        user && user.subscription.includes(course._id) ? (
                            <button onClick={() => navigate(`/course/study/${course._id}`)} className="common-btn">Study</button>
                        ) : (
                            <button onClick={checkoutHandler} className="common-btn">Buy Now</button>
                        )
                    }
                </div>
            )}
        </>
        }
        </>
    );
}

export default CourseDesc;