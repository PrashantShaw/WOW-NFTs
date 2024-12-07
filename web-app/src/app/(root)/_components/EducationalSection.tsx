import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EDUCATIONAL_Q_AND_A } from "@/lib/constants";

const EducationalSection = () => {
  return (
    <div className="pt-[8rem]" id="learn">
      <h2 className="text-4xl font-semibold tracking-tight first:mt-0 mb-4 text-center">
        Educational
      </h2>
      <p className="mb-10 text-muted-foreground text-center text-balance">
        Learn the fundamentals of Blockchain and NFTs to understand their unique
        value and how they revolutionize digital ownership. Becoming familiar
        with the platform and its features will help you fully engage in the
        world of NFTs.
      </p>
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible>
          {EDUCATIONAL_Q_AND_A.map((item, idx) => (
            <AccordionItem key={idx} value={idx.toString()}>
              <AccordionTrigger className="text-left">
                {item.question}
              </AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default EducationalSection;
