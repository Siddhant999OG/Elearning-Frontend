import React from "react";
import "./App.css"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Header from "./components/header/Header";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Verify from "./pages/auth/Verify";
import About from "./pages/about/About";
import Footer from "./components/footer/Footer";
import Account from "./pages/accounts/Account";
import { useUserData } from "./contexts/UserContexts";
import Loading from "./components/loading/Loading";
import Courses from "./pages/courses/Courses";
import CourseDesc from "./pages/courseDescription/CourseDesc";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import Dashboard from "./pages/dashboard/Dashboard";
import CourseStudy from "./pages/courseStudy/CourseStudy";
import Lecture from "./pages/lecture/Lecture";
import AdminDashboard from "./admin/dashboard/AdminDashboard";
import AdminCourses from "./admin/courses/AdminCourses";
import AdminUser from "./admin/users/AdminUser";

const App = () => {
  const { isAuth, user, loading } = useUserData();
  return (
    <div className="app-container">
      {loading ? (
        <Loading />
      ) : (
        <BrowserRouter>
            <Header isAuth={isAuth} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/account" element={isAuth ? <Account user={user} /> : <Login />} />
              <Route path="/login" element={isAuth ? <Home /> : <Login />} />
              <Route path="/register" element={isAuth ? <Home /> : <Register />} />
              <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />
              <Route path="/course/:id" element={isAuth ? <CourseDesc user={user}/> : <Login/>} />
              <Route path="/payment-success/:id" element={isAuth ? <PaymentSuccess user={user}/> : <Login/>} />
              <Route path="/:id/dashboard" element={isAuth ? <Dashboard user={user}/> : <Login/>} />
              <Route path="/course/study/:id" element={isAuth ? <CourseStudy user={user}/> : <Login/>} />
              <Route path="/lectures/:id" element={isAuth ? <Lecture user={user}/> : <Login/>} />
              <Route path="/admin/dashboard" element={isAuth ? <AdminDashboard user={user}/> : <Login/>} />
              <Route path="/admin/course" element={isAuth ? <AdminCourses user={user}/> : <Login/>} />
              <Route path="/admin/users" element={isAuth ? <AdminUser user={user}/> : <Login/>} />
            </Routes>
            <Footer />
        </BrowserRouter>
      )}
    </div>
  );
};

export default App;