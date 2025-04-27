import { motion, useScroll, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import LandingPage from "./LandingPage";
import LandingPage2 from "./LandingPage2";
import './css/style.css';
import logo from './Images/logo.png';
import { FaPhoneAlt } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { IoMdPin } from "react-icons/io";
import { FaViber, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';

const Home = () => {
    const { scrollYProgress } = useScroll();
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPage((prevPage) => (prevPage === 1 ? 2 : 1)); 
        }, 120000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='HOME'>
            <div className="bg-white w-full h-1.5 fixed top-0 left-0 right-0 z-50">
                <motion.div
                    id="scroll-indicator"
                    className="h-1.5 bg-gradient-to-r from-[#263861] via-[#2D1C50] to-[#700D03]"
                    style={{ scaleX: scrollYProgress, originX: 0 }}
                />
            </div>
    
            <div className="flex top-0 fixed mt-1.5 z-50 w-full backdrop-blur-sm items-center justify-between h-20 bg-white shadow px-5 lg:px-20">
                <img src={logo} className='w-16' alt="Tambuli Alert Logo" />
                <NavLink to='/login'>
                    <button className="bg-[#1C1919] font-medium text-sm text-white py-1.5 px-6 rounded-md hover:bg-[#4F152A] transition-colors">LOGIN</button>
                </NavLink>
            </div>
    
            <div className="relative w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPage} 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        transition={{
                            duration: 1.5, 
                            ease: "easeInOut",
                        }}
                        className="w-full"
                    >
                        {currentPage === 1 ? <LandingPage /> : <LandingPage2 />}
                    </motion.div>
                </AnimatePresence>
            </div>
    
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                <button className="bg-[#1C1919] font-medium text-sm text-white py-1.5 px-6 rounded-md hover:bg-[#4F152A] transition-colors">Book a Demo</button>
                <button className="bg-[#1C1919] font-medium text-sm text-white py-1.5 px-6 rounded-md hover:bg-[#4F152A] transition-colors">Start Registration</button>
                <button className="bg-[#1C1919] font-medium text-sm text-white py-1.5 px-6 rounded-md hover:bg-[#4F152A] transition-colors">Contact LGU Liaison</button>
            </div>
    
            <footer>
                <div className="overflow-x-hidden text-sm md:text-md bg-gradient-to-r flex flex-col items-center justify-center w-full px-5 from-[#263861] via-[#2D1C50] to-[#700D03] py-5 lg:py-8">
                    <div className="md:px-20 flex flex-col-reverse lg:flex-row text-white gap-10 justify-center">
                        <div className="flex gap-10 flex-col-reverse md:flex-row">
                            <div className="space-y-2">
                                <p className="font-bold">QUICK LINKS:</p>
                                <p>About Us</p>
                                <p>Security & Privacy Policy</p>
                                <p>Contact Support</p>
                                <p>Documentation</p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-bold">CONNECT WITH US:</p>
                                <div className='flex gap-3'>
                                    <FaPhoneAlt className='ml-2'/>
                                    <a href="tel:+63 935 737 8970">+63 935 737 8970 </a> |
                                    <a href="tel:+63 2 8571 7117"> +63 2 8571 7117</a> 
                                </div>
                                <div className='flex gap-1 md:gap-4'>
                                    <MdEmail className='w-8 md:w-8'/>
                                    <a href="mailto:cemp@tambulilabs.com">cemp@tambulilabs.com</a>
                                </div>
                                <div className='flex gap-2 md:gap-4'>
                                    <IoMdPin className='w-12 ml-1 md:ml-0 md:w-8'/>
                                    <a className='md:w-[400px]' href="https://maps.app.goo.gl/Enjpjcp3asvPp5aQ6">Unit A Mezzanine Level AAP Tower, 683 Aurora Boulevard, New Manila, Quezon City 1112, Metro Manila, Philippines</a>
                                </div>
                            </div>
                        </div>
                        
                        <div className='flex items-center gap-2 flex-col'>
                            <img src={logo} alt="Tambuli Alert logo" className='w-28' />
                            <div className='flex items-center gap-1'>
                                <div className='text-[#4F152A] w-fit bg-white p-2 rounded-full'>
                                    <FaViber />
                                </div>
                                <div className='text-[#4F152A] w-fit bg-white p-2 rounded-full'>
                                    <FaFacebookF />
                                </div>
                                <div className='text-[#4F152A] w-fit bg-white p-2 rounded-full'>
                                    <FaLinkedinIn />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='bg-white/20 w-[25rem] md:w-[40rem] lg:w-[70rem] h-[1px] my-5'></div>
                    <p className='text-white text-xs'>© 2024 TAMBULI LABS®. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;