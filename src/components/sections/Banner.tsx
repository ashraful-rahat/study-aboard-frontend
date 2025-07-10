"use client";
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Carousel styles

// Define your carousel slides data with pre-designed images
interface Slide {
  image: string; // Path to the image with text included
  alt: string; // Alt text for accessibility
}

const slides: Slide[] = [
  {
    image: "/images/banner.jpg", // Make sure this image contains all text/CTA
    alt: "Your Global Education Begins Here - Students on Campus",
  },
  {
    image: "/images/banner2.jpg", // Make sure this image contains all text/CTA
    alt: "Discover New Horizons Around the World - Modern Library",
  },
  {
    image: "/images/banner.jpg", // Make sure this image contains all text/CTA
    alt: "Unlock Your Potential With Expert Guidance - Sunset Path",
  },
  // Add more slides if you have banner3.jpg, banner5.jpg etc. with pre-designed content
  // { image: "/images/banner3.jpg", alt: "Explore diverse courses" },
  // { image: "/images/banner5.jpg", alt: "Start your study abroad adventure" },
];

const Banner: React.FC = () => {
  return (
    <section className="relative w-full min-h-[70vh] md:min-h-[85vh] flex items-center justify-center overflow-hidden bg-white">
      <Carousel
        showArrows={true}
        showStatus={false}
        showIndicators={true}
        infiniteLoop={true}
        autoPlay={true}
        interval={5000}
        transitionTime={800}
        stopOnHover={true}
        thumbWidth={0}
        className="w-full h-full"
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/30 rounded-full hover:bg-white/50 transition-colors duration-200 hidden md:block"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                {/* Arrow color changed to black */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/30 rounded-full hover:bg-white/50 transition-colors duration-200 hidden md:block"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {" "}
                {/* Arrow color changed to black */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )
        }
        renderIndicator={(onClickHandler, isSelected, index, label) => {
          if (isSelected) {
            return (
              <li
                className="inline-block mx-1 w-8 h-2 bg-blue-600 rounded-full cursor-pointer transition-all duration-300"
                aria-label={`Selected: ${label} ${index + 1}`}
                title={`Selected: ${label} ${index + 1}`}
              />
            );
          }
          return (
            <li
              className="inline-block mx-1 w-3 h-3 bg-gray-300 rounded-full cursor-pointer hover:bg-blue-300 transition-all duration-300"
              onClick={onClickHandler}
              onKeyDown={onClickHandler}
              value={index}
              key={index}
              role="button"
              tabIndex={0}
              aria-label={`Slide ${index + 1}`}
              title={`Slide ${index + 1}`}
            />
          );
        }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="relative w-full h-[70vh] md:h-[85vh]">
            {/* Pre-designed Background Image with text/CTA included */}
            <img
              src={slide.image}
              alt={slide.alt}
              className="object-cover w-full h-full"
            />
            {/* All text, buttons, and overlays are now part of the image itself */}
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default Banner;
