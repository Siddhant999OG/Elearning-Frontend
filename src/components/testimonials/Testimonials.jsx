import React from 'react'
import "./Testimonials.css"
import { testimonialsData } from './Data'

const Testimonials = () => {
    return (
        <section className="testimonials">
            <h2>What our students say</h2>
            <div className="testimonials-card">
                {
                    testimonialsData.map((data)=>(
                        <div key={data.id} className="testimonial-card">
                            <div className="student-image">
                                <img src={data.image} alt="img" />
                            </div>

                            <p className='message'>{data.message}</p>

                            <div className="info">
                                <p className='name'>{data.name}</p>
                                <p className='position'>{data.position}</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </section>
    )
}

export default Testimonials