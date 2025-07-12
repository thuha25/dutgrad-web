"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  const fadeInUpVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Research Director",
      company: "Acme Inc.",
      testimonial:
        "DUTGrad has transformed how our research team manages documentation. The AI assistant saves us hours of searching through papers and reports.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Legal Counsel",
      company: "LexCorp",
      testimonial:
        "The ability to query across thousands of legal documents and get precise answers has been game-changing for our legal department.",
      rating: 5,
    },
    {
      name: "Elena Rodriguez",
      role: "CTO",
      company: "TechStart",
      testimonial: `We've integrated DUTGrad with our knowledge base, and it's dramatically improved how quickly our team can access critical information.`,
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="w-full py-16 md:py-24 bg-muted/30">
      <div className="container px-6 md:px-12 lg:px-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUpVariants}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-16"
        >
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Trusted by Teams Everywhere
            </h2>
            <p className="max-w-[800px] text-muted-foreground text-lg md:text-xl leading-relaxed">
              {`See what our users have to say about DUTGrad's impact on their
              productivity`}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
              className="h-full"
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="h-full"
              >
                <Card className="bg-card h-full hover:shadow-xl transition-all duration-300 flex flex-col">
                  <CardContent className="pt-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                      <p className="text-muted-foreground text-center mb-6 text-base leading-relaxed">
                        &ldquo;{testimonial.testimonial}&rdquo;
                      </p>
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold text-base">
                          {testimonial.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.role}
                        </p>
                        <p className="text-sm text-muted-foreground font-medium">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
