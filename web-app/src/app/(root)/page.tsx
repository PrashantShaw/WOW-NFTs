import EducationalSection from "./_components/EducationalSection";
import FeaturedNFTs from "./_components/FeaturedNFTs";
import Hero from "./_components/Hero";
import TopCreators from "./_components/TopCreators";
// TODO: add call to action section, eg. create/buy/sell buttons (see: https://chatgpt.com/g/g-2DQzU5UZl-code-copilot/c/67470905-bf00-8000-b137-f5767a0a4010)
// TODO: add top-creators section - ranking of creators based on the amount of eth they will receive once every nfts that they created are sold
export default function Home() {
  return (
    <div className="animate-fade-in">
      <Hero />
      <FeaturedNFTs />
      <TopCreators />
      <EducationalSection />
    </div>
  );
}
