import Banner from "@/components/sections/Banner";
import CountrySection from "@/components/sections/CountrySection";
import Step from "@/components/sections/Step";
import UniversityExplorer from "@/components/sections/UniversitySection";
import AboutPage from "@/components/ui/layout/About";

const HomeLayout = () => {
  return (
    <main className="">
      <Banner />
      <CountrySection />
      <Step />
      <UniversityExplorer></UniversityExplorer>
      <AboutPage />

      {/* You can add more sections here as needed */}
    </main>
  );
};

export default HomeLayout;
