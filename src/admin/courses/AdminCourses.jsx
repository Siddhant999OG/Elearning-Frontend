import React, { useState } from 'react'
import Layout from '../utils/Layout'
import { useNavigate } from 'react-router-dom';
import { CourseData } from '../../contexts/CourseContext';
import CourseCard from '../../components/courseCard/CourseCard';
import './AdminCourses.css'
import toast from 'react-hot-toast';
import axios from 'axios';
import { server } from '../../main';

const categories = [
    "Web Development", 
    "App Development", 
    "Game Development", 
    "Data science",
    "Artificial Intelligance"
]

const AdminCourses = ({user}) => {
    const navigate = useNavigate();
    const [title, settitle] = useState("");
    const [descripton, setDescription] = useState("");
    const [category, setcategory] = useState("");
    const [price, setprice] = useState("");
    const [createdBy, setCreatedBy] = useState("");
    const [duration, setDuration] = useState("");
    const [image, setImage] = useState("");
    const [imagePrev, setImagePrev] = useState("");
    const [btnLoading, setBtnLoading] = useState(false);

    if(user && user.role !== "admin"){
        return navigate("/")
    }

    const changeImageHandler = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
    
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          setImagePrev(reader.result);
          setImage(file);
        };
    };

    const submitHandler = async(e) => {
        e.preventDefault();
        setBtnLoading(true);

        const myForm = new FormData();

        myForm.append("title", title);
        myForm.append("description", descripton);
        myForm.append("category", category);
        myForm.append("price", price);
        myForm.append("createdBy", createdBy);
        myForm.append("duration", duration);
        myForm.append("file", image);

        try{
            const {data} = await axios.post(`${server}/api/v1/new`, myForm, {
                headers:{
                    token:localStorage.getItem("token")
                }
            })

            toast.success(data.message);
            setBtnLoading(false);
            await fetchCourses();
            setImage("");
            settitle("");
            setDescription("");
            setDuration("");
            setImagePrev("");
            setCreatedBy("");
            setprice("");
            setcategory("");
        }
        catch(error){
            toast.error(error.response.data.message)
        }
    }


    const {courses, fetchCourses} = CourseData()
    return (
        <Layout>
            <div className="admin-courses">
                <div className="left">
                    <h1>All Courses</h1>
                    <div className="dashboard-content">
                        {
                            courses && courses.length>0 ? courses.map((e) => {
                                return <CourseCard key={e._id} course={e}/>
                            }) : <p>No courses Found</p>
                        }
                    </div>
                </div>

                <div className="right">
                    <div className="add-course">
                        <div className="course-form">
                            <h2>Add Course</h2>
                            <form onSubmit={submitHandler}>
                                <label htmlFor="text">Title</label>
                                <input type="text" value={title} onChange={e=>settitle(e.target.value)} required/>

                                <label htmlFor="text">Description</label>
                                <input type="text" value={descripton} onChange={e=>setDescription(e.target.value)} required/>

                                <label htmlFor="text">Price</label>
                                <input type="number" value={price} onChange={e=>setprice(e.target.value)} required/>

                                <label htmlFor="text">Created By</label>
                                <input type="text" value={createdBy} onChange={e=>setCreatedBy(e.target.value)} required/>

                                <select value={category} onChange={e=>setcategory(e.target.value)}>
                                    <option value={""}>Select Category</option>
                                    {
                                        categories.map((e)=>(
                                            <option value={e} key={e}>{e}</option>
                                        ))
                                    }
                                </select>

                                <label htmlFor="text">Duration</label>
                                <input type="number" value={duration} onChange={e=>setDuration(e.target.value)} required/>

                                <input type="file" required onChange={changeImageHandler}/>
                                {
                                    imagePrev && <img src={imagePrev} alt="" width={300}/>
                                }

                                <button type='submit' disabled={btnLoading} className='common-btn'>
                                    {
                                        btnLoading ? "Please Wait" : "Add"
                                    }
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </Layout>
    )
}

export default AdminCourses