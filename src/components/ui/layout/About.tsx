// src/app/about/page.tsx
"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Sparkles } from "lucide-react";

// Framer Motion Variants
const fadeInVariant: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const childFadeInVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Hero Section */}
        <motion.section
          variants={fadeInVariant}
          initial="hidden"
          animate="visible"
          className="text-center mb-20 relative z-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-8 border border-white/20"
          >
            <Sparkles className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-semibold text-gray-700">
              Our Journey, Your Future
            </span>
          </motion.div>
          <h1 className="text-6xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
            Pioneering Global Education
            <span className="block bg-gradient-to-r from-orange-400 to-orange-800 bg-clip-text text-transparent">
              Since 2005
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We are dedicated to transforming lives by connecting ambitious
            students with world-class educational opportunities across the
            globe. Our commitment to excellence, integrity, and personalized
            guidance sets us apart.
          </p>
        </motion.section>

        {/* Our Story Section */}
        <motion.section
          variants={staggerContainerVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
        >
          <motion.div variants={childFadeInVariant}>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Story: A Decade of Dreams
            </h2>
            <p className="text-gray-700 leading-loose mb-4">
              Founded in 2005 by a team of passionate educationists, our journey
              began with a simple yet profound vision: to make quality global
              education accessible to every aspiring student.
            </p>
            <p className="text-gray-700 leading-loose">
              Over the years, we have grown into a leading study abroad agency,
              building strong partnerships with hundreds of prestigious
              universities worldwide.
            </p>
          </motion.div>
          <motion.div
            variants={childFadeInVariant}
            className="relative h-full w-full min-h-[400px] rounded-3xl overflow-hidden shadow-xl"
          >
            <Image
              src="/images/banner.jpg"
              alt="Our Story"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center"
              priority
            />
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;

// import React from "react";

// const About = () => {
//   return <div>about</div>;
// };

// export default About;
