"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

export default function StudyAbroadBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const carouselSlides = [
    {
      id: 1,
      title: "Study in United Kingdom",
      subtitle: "World-Class Education Awaits",
      description:
        "Discover prestigious universities and rich cultural heritage in the UK. From Oxford to Cambridge, unlock your potential.",
      image: "/images/banner.jpg",
      cta: "Explore UK Programs",
      accent: "from-red-600 to-blue-600",
    },
    {
      id: 2,
      title: "Experience Australia",
      subtitle: "Adventure Meets Excellence",
      description:
        "Study in Australia's top-ranked universities while enjoying beautiful landscapes and vibrant city life.",
      image: "/images/banner1.jpg",
      cta: "View Australia Options",
      accent: "from-green-600 to-yellow-500",
    },
    {
      id: 3,
      title: "Discover Canada",
      subtitle: "Quality Education, Welcoming Culture",
      description:
        "Join thousands of international students in Canada's world-renowned institutions and multicultural society.",
      image: "/images/banner2.jpg",
      cta: "Learn About Canada",
      accent: "from-red-500 to-red-600",
    },
    {
      id: 4,
      title: "Study in USA",
      subtitle: "Land of Opportunities",
      description:
        "Access cutting-edge research facilities and diverse academic programs in America's leading universities.",
      image: "/images/banner3.jpg",
      cta: "Explore USA Programs",
      accent: "from-blue-600 to-red-600",
    },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  return (
    <div className="relative">
      {/* Main Banner */}
      <div
        className="relative h-[100vh] min-h-[700px] overflow-hidden"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Background Slides */}
        <div className="relative h-full">
          {carouselSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              }`}
            >
              {/* Background Image with Parallax Effect */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transform transition-transform duration-1000"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  transform: index === currentSlide ? "scale(1)" : "scale(1.1)",
                }}
              >
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${slide.accent} opacity-20`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Content - Adjusted for navbar */}
              <div className="relative h-full flex items-center justify-center pt-20">
                <div className="text-center text-white max-w-5xl mx-auto px-6">
                  {/* Animated Content */}
                  <div
                    className={`transform transition-all duration-1000 delay-300 ${
                      index === currentSlide
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    }`}
                  >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                      <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                        {slide.title}
                      </span>
                    </h1>

                    <p className="text-2xl md:text-3xl mb-4 font-light text-gray-100">
                      {slide.subtitle}
                    </p>

                    <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed text-gray-200">
                      {slide.description}
                    </p>

                    {/* Enhanced Buttons */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                      <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 transform hover:-translate-y-1">
                        <span className="relative z-10">{slide.cta}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                      </button>

                      <button className="group px-8 py-4 border-2 border-white/80 text-white rounded-full font-semibold text-lg backdrop-blur-sm bg-white/10 transition-all duration-300 hover:bg-white hover:text-gray-900 transform hover:-translate-y-1">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 transform -translate-y-1/2 group"
        >
          <div className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 group-hover:scale-110 shadow-lg">
            <ChevronLeft className="h-6 w-6" />
          </div>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 transform -translate-y-1/2 group"
        >
          <div className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 group-hover:scale-110 shadow-lg">
            <ChevronRight className="h-6 w-6" />
          </div>
        </button>

        {/* Enhanced Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="group relative"
            >
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white scale-125 shadow-lg"
                    : "bg-white/50 hover:bg-white/75 hover:scale-110"
                }`}
              />
              {index === currentSlide && (
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-white animate-ping opacity-75" />
              )}
            </button>
          ))}
        </div>

        {/* Progress Bar */}
        {/* <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 shadow-lg"
            style={{
              width: `${((currentSlide + 1) / carouselSlides.length) * 100}%`,
            }}
          />
        </div> */}

        {/* Auto-play Control */}
        <button
          onClick={toggleAutoPlay}
          className="absolute top-28 right-6 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
        >
          {isAutoPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </button>

        {/* Slide Counter */}
        <div className="absolute top-28 left-6 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-medium shadow-lg">
          {currentSlide + 1} / {carouselSlides.length}
        </div>
      </div>

      {/* Enhanced Info Bar */}
    </div>
  );
}
