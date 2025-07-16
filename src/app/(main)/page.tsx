import Banner from "@/components/sections/Banner";
import CountrySection from "@/components/sections/CountrySection";
import AboutPage from "@/components/ui/layout/About";

import React from "react";

const HomeLayout = () => {
  return (
    <div>
      <Banner></Banner>
      <AboutPage></AboutPage>
      <CountrySection></CountrySection>
    </div>
  );
};

export default HomeLayout;
