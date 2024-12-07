import React from 'react'
import './Footer.css'
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { SiLeetcode } from "react-icons/si";

const Footer = () => {
  return (
    <footer>
        <div className="footer-content">
            <p>
                &copy; 2024 Your E-Learning Platform. All right reserved. 
                <br/>Made with❤️
                <a href=''>
                    Siddhant Gautam
                </a>
            </p>

            <div className="social-links">
                <a href='https://www.linkedin.com/in/siddhant-gautam-906951270/'><FaLinkedin /></a>
                <a href='https://github.com/Siddhant999OG'><FaGithub /></a>
                <a href='https://leetcode.com/u/SiddhantOG/'><SiLeetcode /></a>
            </div>
        </div>
    </footer>
  )
}

export default Footer