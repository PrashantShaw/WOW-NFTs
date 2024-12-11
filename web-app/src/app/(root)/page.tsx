import EducationalSection from "./_components/EducationalSection";
import FeaturedNFTs from "./_components/FeaturedNFTs";
import Hero from "./_components/Hero";
// TODO: add call to action section, eg. create/buy/sell buttons (see: https://chatgpt.com/g/g-2DQzU5UZl-code-copilot/c/67470905-bf00-8000-b137-f5767a0a4010)
export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedNFTs />
      <EducationalSection />
    </div>
  );
}
