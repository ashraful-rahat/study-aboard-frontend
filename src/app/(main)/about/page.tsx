"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

const AboutPage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <Image
          src="/images/banner15.jpg"
          alt="About Us Hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-orange-900/30 flex items-center justify-center">
          <motion.div
            className="text-center text-white px-4"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              About{" "}
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                PFEC Global
              </span>
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Your trusted partner in international education and study abroad
              opportunities
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-8"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Your Journey
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 md:py-32 px-4 md:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <motion.div className="space-y-10" variants={fadeInUp}>
              <div>
                <motion.h2
                  className="text-4xl md:text-5xl font-bold text-gray-900 mb-8"
                  variants={fadeInUp}
                >
                  Our{" "}
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    Mission
                  </span>
                </motion.h2>
                <motion.p
                  className="text-xl text-gray-600 leading-relaxed"
                  variants={fadeInUp}
                >
                  To empower students worldwide with access to quality
                  international education by providing comprehensive guidance,
                  personalized support, and seamless pathways to their dream
                  universities abroad.
                </motion.p>
              </div>

              <div>
                <motion.h3
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
                  variants={fadeInUp}
                >
                  Our{" "}
                  <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    Vision
                  </span>
                </motion.h3>
                <motion.p
                  className="text-xl text-gray-600 leading-relaxed"
                  variants={fadeInUp}
                >
                  To become the leading global education consultancy, fostering
                  cultural exchange and academic excellence while building
                  bridges between students and world-class educational
                  institutions.
                </motion.p>
              </div>

              <motion.div className="flex flex-wrap gap-4" variants={fadeInUp}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Get Started Today
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              variants={scaleIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-10 text-white shadow-2xl">
                <div className="space-y-8">
                  <motion.div
                    className="flex items-center space-x-6"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold">Expert Guidance</h4>
                      <p className="text-orange-100 text-lg">
                        Professional counselors with years of experience
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-6"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold">Global Network</h4>
                      <p className="text-orange-100 text-lg">
                        Partnerships with top universities worldwide
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-6"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold">Fast Track</h4>
                      <p className="text-orange-100 text-lg">
                        Streamlined application process
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-orange-50 to-red-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Impact in{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Numbers
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&lsquo;ve helped thousands of students achieve their dreams of
              studying abroad
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { number: "5000+", label: "Students Placed" },
              { number: "50+", label: "Countries" },
              { number: "200+", label: "Partner Universities" },
              { number: "98%", label: "Success Rate" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                variants={scaleIn}
                whileHover={{ y: -10 }}
              >
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-4">
                  {stat.number}
                </div>
                <p className="text-gray-600 font-semibold text-lg">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 md:py-32 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                PFEC Global
              </span>
              ?
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              We provide comprehensive support throughout your study abroad
              journey, from initial consultation to post-arrival assistance.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                title: "Academic Excellence",
                description:
                  "Partner with top-ranked universities and institutions worldwide, ensuring quality education and recognized degrees.",
                color: "from-blue-500 to-indigo-500",
              },
              {
                icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                title: "Personalized Support",
                description:
                  "One-on-one counseling sessions tailored to your academic goals, preferences, and career aspirations.",
                color: "from-green-500 to-teal-500",
              },
              {
                icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
                title: "Application Assistance",
                description:
                  "Complete support with document preparation, application forms, and visa processing to ensure smooth admission.",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
                title: "24/7 Support",
                description:
                  "Round-the-clock assistance for students abroad, ensuring you never feel alone in your international education journey.",
                color: "from-orange-500 to-red-500",
              },
              {
                icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1",
                title: "Scholarship Guidance",
                description:
                  "Expert advice on available scholarships, financial aid, and funding opportunities to make your education affordable.",
                color: "from-red-500 to-pink-500",
              },
              {
                icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                title: "Community Network",
                description:
                  "Connect with fellow international students and alumni network for support, mentorship, and career opportunities.",
                color: "from-indigo-500 to-purple-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:scale-105 group"
                variants={fadeInUp}
                whileHover={{ y: -10 }}
              >
                <div
                  className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300`}
                >
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={feature.icon}
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-gray-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet Our{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Expert Team
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Our dedicated team of education consultants and international
              experts are here to guide you every step of the way.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              {
                name: "Sarah Johnson",
                role: "Senior Education Consultant",
                description:
                  "With over 10 years of experience in international education, Sarah specializes in UK and European university applications.",
                gradient: "from-blue-400 to-indigo-500",
              },
              {
                name: "Michael Chen",
                role: "Visa & Immigration Specialist",
                description:
                  "Michael has helped thousands of students navigate complex visa processes for countries like USA, Canada, and Australia.",
                gradient: "from-green-400 to-teal-500",
              },
              {
                name: "Emily Rodriguez",
                role: "Scholarship Coordinator",
                description:
                  "Emily specializes in identifying and securing scholarships, helping students make their international education dreams affordable.",
                gradient: "from-purple-400 to-pink-500",
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
                variants={scaleIn}
                whileHover={{ y: -10 }}
              >
                <div
                  className={`h-72 bg-gradient-to-br ${member.gradient} flex items-center justify-center relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/10"></div>
                  <svg
                    className="w-32 h-32 text-white relative z-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {member.name}
                  </h3>
                  <p className="text-orange-600 font-semibold text-lg mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {member.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 md:py-32 bg-gradient-to-r from-orange-500 to-red-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-5xl mx-auto text-center px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Ready to Start Your Study Abroad Journey?
            </h2>
            <p className="text-xl text-orange-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of successful students who have achieved their dreams 
              of international education with PFEC Global.
            </p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Button 
                size="lg" 
                className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-10 py-5 text-xl rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
              >
                Schedule Free Consultation
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-3 border-white text-white hover:bg-white hover:text-orange-600 font-bold px-10 py-5 text-xl rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Download Brochure
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section> */}
    </div>
  );
};

export default AboutPage;
