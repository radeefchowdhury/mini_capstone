import React from 'react';

function Hero() {
    return (
        <div className={`relative flex items-center justify-center min-h-screen w-full bg-cover bg-no-repeat bg-[url('/hero_banner.png')]`}>
            <div></div>
            <div className={'block antialiased tracking-normal font-sans text-5xl font-semibold leading-tight text-white'}>
                Exploring the world of Real Estate with Home Haven.
            </div>
        </div>
    );
}

export default Hero;