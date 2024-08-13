import React from 'react';
import './Aboutus.css';
import Header from '../Header/Header';

const Aboutus = () => {
    return (
        <div>
            <Header/>
        <div className="about-us-container">
            <header className="about-us-headers">
                <h1>About Our School</h1>
            </header>
            <section className="about-us-content">
                <div className="card">
                    <h2>Our Mission</h2>
                    <p>Our mission is to provide a nurturing and inclusive environment where every student is encouraged to reach their full potential. We strive for academic excellence, personal growth, and civic responsibility.</p>
                </div>
                <div className="card">
                    <h2>Our Vision</h2>
                    <p>We envision a world where every child has access to quality education, enabling them to become confident, capable, and compassionate leaders of tomorrow.</p>
                </div>
                <div className="card">
                    <h2>Our Values</h2>
                    <ul>
                        <li><strong>Integrity:</strong> We believe in honesty and transparency in all our actions.</li>
                        <li><strong>Excellence:</strong> We pursue excellence in teaching, learning, and community engagement.</li>
                        <li><strong>Respect:</strong> We foster a culture of respect for self, others, and the environment.</li>
                    </ul>
                </div>
                <div className="card">
                    <h2>Our History</h2>
                    <p>Founded in 1950, our school has a long-standing tradition of academic excellence and community service. Over the decades, we have evolved to meet the changing needs of our students while maintaining our core values and commitment to quality education.</p>
                </div>
                <div className="card">
                    <h2>Our Programs</h2>
                    <p>We offer a wide range of programs to cater to the diverse interests and needs of our students. From arts and sports to science and technology, our curriculum is designed to foster holistic development.</p>
                </div>
                <div className="card">
                    <h2>Our Staff</h2>
                    <p>Our dedicated team of educators and staff members are committed to providing a supportive and enriching learning environment. They bring a wealth of experience and expertise to the classroom.</p>
                </div>
                <div className="card">
                    <h2>Community Engagement</h2>
                    <p>We believe in the power of community and actively engage with local organizations and stakeholders. Our community programs aim to make a positive impact and foster a sense of belonging.</p>
                </div>
                <div className="card">
                    <h2>Future Goals</h2>
                    <p>Looking ahead, we aim to expand our facilities, introduce new programs, and continue to innovate in education. Our goal is to provide an ever-evolving learning environment that prepares students for the future.</p>
                </div>
            </section>
            <section className="additional-content">
                <div className="testimonial">
                    <h2>Testimonials</h2>
                    <blockquote>"This school has transformed my child's life. The teachers are amazing and the community is incredibly supportive." - Parent</blockquote>
                    <blockquote>"Attending this school has been the best decision of my life. I've grown so much both academically and personally." - Student</blockquote>
                </div>
                <div className="awards">
                    <h2>Awards & Recognitions</h2>
                    <ul>
                        <li>National Blue Ribbon School Award</li>
                        <li>Excellence in STEM Education Award</li>
                        <li>Community Service Leadership Award</li>
                    </ul>
                </div>
                <div className="extracurricular">
                    <h2>Extracurricular Activities</h2>
                    <p>We offer a variety of extracurricular activities to enrich our students' educational experience, including:</p>
                    <ul>
                        <li>Sports teams (soccer, basketball, volleyball)</li>
                        <li>Arts programs (drama, music, visual arts)</li>
                        <li>Clubs (science club, debate team, robotics club)</li>
                        <li>Community service opportunities</li>
                    </ul>
                </div>
                <div className="alumni">
                    <h2>Alumni Success Stories</h2>
                    <p>Our alumni have gone on to achieve great things in various fields. Here are a few highlights:</p>
                    <ul>
                        <li>Dr. Jane Smith, leading researcher in biomedical engineering</li>
                        <li>John Doe, CEO of a successful tech startup</li>
                        <li>Mary Johnson, award-winning author and journalist</li>
                    </ul>
                </div>
                
            </section>
            <footer className="about-us-footer">
                <p>&copy; 2024 Edu-web. All rights reserved.</p>
            </footer>
        </div>
        </div>
    );
};

export default Aboutus;
// app.enableCors({
//         origin: 'http://localhost:3001', // Your frontend URL
//         methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//         allowedHeaders: 'Content-Type, Authorization',
//     });
// DB_HOST=localhost
// DB_PORT=3306
// DB_USERNAME=root
// DB_PASSWORD=Signature880@
// DB_NAME=edu_web

// EMAIL_HOST=smtp.gmail.com
// EMAIL_PORT=587
// EMAIL_SECURE=false
// EMAIL_USER=transev76@gmail.com
// EMAIL_PASS=bjyr fcvy qewd iadx
// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { AdminModule } from './admin/admin.module';
// import { StudentModule } from './student/student.module';
// import { ParentModule } from './parent/parent.module';
// import { RoleModule } from './role/role.module';
// import { TeacherModule } from './teacher/teacher.module';
// import { ContactModule } from './contact/contact.module';
// import { MailerModule } from '@nestjs-modules/mailer';
// import * as dotenv from 'dotenv';
// import { AuthModule } from './auth/auth.module';




// dotenv.config();

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: 'localhost',
//       port: 3306,
//       username: 'root',
//       password: 'Signature880@',
//       database: 'edu_web',
//       autoLoadEntities: true,
//       synchronize: true,
//     }),
//     MailerModule.forRoot({
//       transport: {
//         host: process.env.EMAIL_HOST,
//         port: parseInt(process.env.EMAIL_PORT),
//         secure: process.env.EMAIL_SECURE === 'true',
//         auth: {
//           user: process.env.EMAIL_USER,
//           pass: process.env.EMAIL_PASS,
//         },
//       },
//     }),
//     AdminModule,
//     StudentModule,
//     ParentModule,
//     RoleModule,
//     TeacherModule,
//     ContactModule,
//     AuthModule,
//   ],
// })
// export class AppModule {}
