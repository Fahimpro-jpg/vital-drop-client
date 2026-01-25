import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { useNavigate } from 'react-router';
import banner1 from "../../../assets/banner1.jpg"
import banner2 from "../../../assets/banner2.jpg"
import banner3 from "../../../assets/banner4.jpg"

const Banner = () => {
    const navigate = useNavigate();

    return (
        <div className='w-full mx-auto relative mt-16'>
            <Carousel
                autoPlay
                infiniteLoop
                showThumbs={false}
                showStatus={false}
                interval={2000}
                showArrows={false}
            >
                <div className='h-[400px]'>
                    <img 
                        className='w-full h-[400px] object-cover brightness-[0.6]' 
                        src={banner1} 
                        alt="Blood Donation Banner 1"
                    />
                </div>
                <div className='h-[400px]'>
                    <img 
                        className='w-full h-[400px] object-cover brightness-[0.6]' 
                        src={banner2} 
                        alt="Blood Donation Banner 2"
                    />
                </div>
                <div className='h-[400px]'>
                    <img 
                        className='w-full h-[400px] object-cover brightness-[0.6]' 
                        src={banner3} 
                        alt="Blood Donation Banner 3"
                    />
                </div>
            </Carousel>

            {/* Overlay Content */}
            <div className='absolute inset-0 flex flex-col items-center justify-center z-10 text-white px-4'>
                <h1 className='text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-4'>
                    Donate Blood, Save Lives
                </h1>
                <p className='text-base md:text-lg lg:text-xl mb-8 text-center max-w-2xl'>
                    Every donation can save up to three lives. Join our community of heroes today.
                </p>
                <div className='flex gap-4 flex-wrap justify-center'>
                    <button 
                        onClick={() => navigate('/register')}
                        className='btn btn-primary text-white px-6 md:px-8 py-2 md:py-3 text-base md:text-lg hover:scale-105 transition-transform'
                    >
                        Join as a Donor
                    </button>
                    <button 
                        onClick={() => navigate('/searchPage')}
                        className='btn btn-secondary text-white px-6 md:px-8 py-2 md:py-3 text-base md:text-lg hover:scale-105 transition-transform'
                    >
                        Search Donors
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Banner;