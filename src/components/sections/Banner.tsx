"use client";
import Image from "next/image";
import React from "react";

const Banner = () => {
  return (
    <section className="w-full h-[75vh] md:h-[90vh] relative ">
      <Image
        src="/images/banner15.jpg"
        alt="PFEC Banner"
        fill
        priority
        className="object-cover"
      />
    </section>
  );
};

export default Banner;
