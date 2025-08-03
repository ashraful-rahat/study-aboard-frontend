"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

interface BannerSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
}

const bannerSlides: BannerSlide[] = [
  {
    id: 1,
    image: "/images/banner1.jpg",
    title: "Study Abroad Dreams",
    subtitle: "Your Gateway to Global Education",
    description: "Discover world-class universities and unlock your potential with our comprehensive study abroad programs.",
    buttonText: "Explore Programs",
    buttonLink: "/courses"
  },
  {
    id: 2,
    image: "/images/banner2.jpg",
    title: "Top Universities Worldwide",
    subtitle: "Choose Your Perfect Destination",
    description: "Connect with prestigious universities across the globe and find your ideal study destination.",
    buttonText: "View Universities",
    buttonLink: "/universities"
  },
  {
    id: 3,
    image: "/images/banner3.jpg",
    title: "Expert Guidance",
    subtitle: "Professional Study Abroad Consultants",
    description: "Get personalized guidance from experienced consultants to make your study abroad journey seamless.",
    buttonText: "Get Consultation",
    buttonLink: "/contact"
  },
  {
    id: 4,
    image: "/images/banner5.jpg",
    title: "Student Success Stories",
    subtitle: "Real Stories, Real Results",
    description: "Hear from our successful students who have achieved their dreams of studying abroad.",
    buttonText: "Read Stories",
    buttonLink: "/testimonials"
  }
];

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentSlide, isPlaying]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-gray-900">
      {/* Banner Slides */}
      <div className="relative w-full h-full">
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-500 ease-in-out ${
              index === currentSlide
                ? "opacity-100 transform translate-x-0"
                : index < currentSlide
                ? "opacity-0 transform -translate-x-full"
                : "opacity-0 transform translate-x-full"
            }`}
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center text-white px-6 max-w-4xl mx-auto">
                <div className={`transition-all duration-700 delay-200 ${
                  index === currentSlide ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
                }`}>
                  <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                    {slide.title}
                  </h1>
                </div>
                
                <div className={`transition-all duration-700 delay-400 ${
                  index === currentSlide ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
                }`}>
                  <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-blue-200">
                    {slide.subtitle}
                  </h2>
                </div>
                
                <div className={`transition-all duration-700 delay-600 ${
                  index === currentSlide ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
                }`}>
                  <p className="text-lg md:text-xl mb-8 text-gray-200 leading-relaxed">
                    {slide.description}
                  </p>
                </div>
                
                {slide.buttonText && (
                  <div className={`transition-all duration-700 delay-800 ${
                    index === currentSlide ? "opacity-100 transform translate-y-0" : "opacity-0 transform translate-y-8"
                  }`}>
                    <a
                      href={slide.buttonLink}
                      className="inline-flex items-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105 shadow-lg"
                    >
                      {slide.buttonText}
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-0 flex items-center justify-between p-6">
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Play/Pause Button */}
      <div className="absolute top-6 right-6">
        <button
          onClick={togglePlayPause}
          className="p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-all duration-300 backdrop-blur-sm"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-3">
          {bannerSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? "bg-white scale-125"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-6 left-6">
        <div className="px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
          {currentSlide + 1} / {bannerSlides.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white bg-opacity-20">
        <div 
          className="h-full bg-blue-500 transition-all duration-500 ease-linear"
          style={{ 
            width: isPlaying ? `${((currentSlide + 1) / bannerSlides.length) * 100}%` : '0%'
          }}
        />
      </div>
    </div>
  );
};

export default Banner; 