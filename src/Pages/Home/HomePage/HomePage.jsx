import React from 'react';
import Banner from '../Banner/Banner';
import FeaturedSection from '../FeaturedSection/FeaturedSection';
import ContactUs from '../ContactUs/ContactUs';

const HomePage = () => {
    return (
        <div>
            <Banner />
            <FeaturedSection />
            <ContactUs></ContactUs>
        </div>
    );
};

export default HomePage;
