import React, { useEffect, useState } from 'react'
import './AdminUser.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { server } from '../../main';
import Layout from '../utils/Layout';
import toast from 'react-hot-toast';

const AdminUser = ({user}) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState("");

  if(user && user.role !== "admin"){
    return navigate("/");
  }

  async function fetchUser(){
    try{
      const {data} = await axios.get(`${server}/api/v1/getAllusers`, {
        headers:{
          token:localStorage.getItem("token")
        }
      })

      setUsers(data.Allusers);
    }
    catch(error){
      console.log(error);
    }
  }

  const updateRole = async(id) => {
    if(confirm("are you sure you want to update user role")){
      try{
        const {data} = await axios.put(`${server}/api/v1/updateRole/${id}`, {}, {
          headers:{
            token: localStorage.getItem("token")
          }
        })

        toast.success(data.message);
        fetchUser();
      }
      catch(error){
        toast.error(error.response.data.message)
      }
    }
  }

  useEffect(() => {
    fetchUser();
  }, [])

  console.log(users);
  return (
    <Layout>
      <div className="users">
        <h1>All Users</h1>
        <table border={"black"}>
          <thead>
            <tr>
              <td>#</td>
              <td>name</td>
              <td>email</td>
              <td>role</td>
              <td>update role</td>
            </tr>
          </thead>

          {
            users && users.map((e,i) => (
              <tbody>
                <tr>
                  <td>{i+1}</td>
                  <td>{e.name}</td>
                  <td>{e.email}</td>
                  <td>{e.role}</td>
                  <td>
                    <button onClick={() => updateRole(e._id)} className='common-btn'>Update Role</button>
                  </td>
                </tr>
              </tbody>
            ))
          }
        </table>
      </div>
    </Layout>
  )
}

export default AdminUser