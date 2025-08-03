"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const Step: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4"
          >
            Your Journey Starts Here:{" "}
            <span className="bg-gradient-to-r from-orange-500 to-orange-800 bg-clip-text text-transparent">
              5 Steps to Study Abroad
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg text-gray-600 max-w-3xl mx-auto"
          >
            Embark on your international education journey with our streamlined
            5-step process. We guide you through every stage, ensuring a smooth
            and successful transition.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full aspect-[16/9] max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-gray-200"
        >
          <Image
            src="/images/step.png" // public/images
            alt="5 Steps to Study Abroad Process"
            fill
            priority
            className="object-contain"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Step;
