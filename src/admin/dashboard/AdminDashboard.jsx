import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../utils/Layout';
import axios from 'axios';
import { server } from '../../main';
import './AdminDashboard.css'

const AdminDashboard = ({user}) => {
    const navigate = useNavigate();
    const [stats, setstats] = useState([]);

    async function fetchStats(){
        try{
            const {data} = await axios.get(`${server}/api/v1/getAllStats`,{
                headers:{
                    token: localStorage.getItem("token")
                }
            })
            setstats(data.stats)
        }
        catch(error){
            console.log(error);
        }
    }

    if(user && user.role !== "admin"){
        return navigate("/")
    }

    useEffect(()=>{
        fetchStats()
    },[])
    return (
        <div>
            <Layout>
                <div className="main-content">
                    <div className="box">
                        <p>Total Courses</p>
                        <p>{stats.totalCourses}</p>
                    </div>
                    <div className="box">
                        <p>Total Lectures</p>
                        <p>{stats.totalLectures}</p>
                    </div>
                    <div className="box">
                        <p>Total Users</p>
                        <p>{stats.totalUsers}</p>
                    </div>
                </div>
            </Layout>
        </div>
    )
}

export default AdminDashboard