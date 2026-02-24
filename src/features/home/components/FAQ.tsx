import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Fade } from "react-awesome-reveal";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "Is this template free?",
    answer: "Yes. It is a free ChadcnUI template.",
    value: "item-1",
  },
  {
    question: "Lorem ipsum dolor sit amet consectetur adipisicing elit?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint labore quidem quam? Consectetur sapiente iste rerum reiciendis animi nihil nostrum sit quo, modi quod.",
    value: "item-2",
  },
  {
    question:
      "Lorem ipsum dolor sit amet  Consectetur natus dolores minus quibusdam?",
    answer:
      "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore qui nostrum reiciendis veritatis necessitatibus maxime quis ipsa vitae cumque quo?",
    value: "item-3",
  },
  {
    question: "Lorem ipsum dolor sit amet, consectetur adipisicing elit?",
    answer: "Lorem ipsum dolor sit amet consectetur, adipisicing elit.",
    value: "item-4",
  },
  {
    question:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur natus?",
    answer:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sint labore quidem quam? Consectetur sapiente iste rerum reiciendis animi nihil nostrum sit quo, modi quod.",
    value: "item-5",
  },
];

export const FAQ = () => {
  return (
    <section id="faq" className="pt-12 md:pt-28 bg-muted/50">
      <div className="container mx-auto">
        <div className="space-y-16">
          <div className="space-y-6">
            <Fade
              delay={500} // Wait 200ms before starting
              duration={1000} // Animation lasts 1 second
              triggerOnce // Only animate once
              fraction={1} // Start animation when element is 50% visible
              direction="up"
              cascade
              damping={0.5}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center">
                Tez tez so'raladigan
                <span className="bg-gradient-to-b from-primary/60 to-primary text-transparent bg-clip-text">
                  {" "}
                  savollar
                </span>
              </h2>
            </Fade>
          </div>

          <Accordion type="single" collapsible className="w-full AccordionRoot">
            {FAQList.map(({ question, answer, value }: FAQProps) => (
              <AccordionItem key={value} value={value}>
                <AccordionTrigger className="text-left text-md hover:no-underline hover:text-primary">
                  {question}
                </AccordionTrigger>

                <AccordionContent className="text-sm font-light">
                  {answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
