import { useHomeData } from "@/hooks/useHomeData";
import LoadingSpinner from "@/shared/components/atoms/loading-spinner/LoadingSpinner";
import { get } from "lodash";
import { About } from "./components/About";
import Contact from "./components/Contact";
import { HeroCarousel } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { NewsSection } from "./components/NewsSection";
import { Partners } from "./components/Partners";
import PostgraduatePrograms from "./components/PostgraduatePrograms";

const HomePage = () => {

  const { data, isLoading } = useHomeData();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <HeroCarousel data={get(data, "carousels", [])} />
      <About />
      <NewsSection
        data={{
          latest_posts: get(data, "latest_posts", []),
          latest_news: get(data, "latest_news", []),
          latest_announcements: get(data, "latest_announcements", []),
        }}
      />
      <HowItWorks data={get(data, "scientific_directions", [])} />
      <PostgraduatePrograms data={get(data, "postgraduate_education", [])} />
      {/* <FAQ /> */}
      <Contact />
      <Partners data={get(data, "collaborations", [])} />
    </>
  );
};

export default HomePage;
