"use client";

import { motion } from "framer-motion";

export function HowItWorksSection() {
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

  const steps = [
    {
      number: "1",
      title: "Upload Documents",
      description:
        "Drag and drop files or connect to cloud storage to import your documents seamlessly.",
    },
    {
      number: "2",
      title: "AI Processing",
      description:
        "Our AI analyzes, indexes, and organizes your documents for optimal retrieval and understanding.",
    },
    {
      number: "3",
      title: "Ask Questions",
      description:
        "Use natural language to query your documents and get instant, accurate answers with citations.",
    },
  ];

  return (
    <section id="how-it-works" className="w-full py-16 md:py-24 bg-muted/30">
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
              How DUTGrad Works
            </h2>
            <p className="max-w-[800px] text-muted-foreground text-lg md:text-xl leading-relaxed">
              Simple, intuitive, and powerful document management in three easy
              steps
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connection lines - positioned to not cross circles */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="absolute top-10 left-[17.5%] right-[17.5%] h-0.5 bg-gradient-to-r from-primary/40 via-primary/60 to-primary/40 hidden md:block z-0"
            style={{ transformOrigin: "left" }}
          />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.2 }}
              className="flex flex-col items-center text-center relative z-10"
            >
              <motion.div
                whileHover={{
                  scale: 1.15,
                  backgroundColor: "hsl(var(--primary))",
                  color: "hsl(var(--primary-foreground))",
                }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-6 border-4 border-background shadow-lg backdrop-blur-sm"
              >
                <span className="text-2xl font-bold">{step.number}</span>
              </motion.div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-base leading-relaxed max-w-sm">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
