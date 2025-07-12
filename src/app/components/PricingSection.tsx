"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { API_ROUTES } from "@/lib/constants";

export function PricingSection() {
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const plans = [
    {
      title: "Starter",
      description: "For individuals and small teams",
      price: "$9",
      features: [
        "Up to 1,000 documents",
        "Basic AI search",
        "5 GB storage",
        "Email support",
      ],
      popular: false,
    },
    {
      title: "Professional",
      description: "For growing businesses",
      price: "$29",
      features: [
        "Up to 10,000 documents",
        "Advanced AI search & chatbot",
        "25 GB storage",
        "Priority support",
        "Team collaboration",
      ],
      popular: true,
    },
    {
      title: "Enterprise",
      description: "For large organizations",
      price: "Custom",
      features: [
        "Unlimited documents",
        "Custom AI models",
        "Unlimited storage",
        "24/7 dedicated support",
        "Advanced security & compliance",
        "Custom integrations",
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="w-full py-16 md:py-24 bg-background">
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
              Simple, Transparent Pricing
            </h2>
            <p className="max-w-[800px] text-muted-foreground text-lg md:text-xl leading-relaxed">
              Choose the plan that works for your needs. All plans include our
              core AI features.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.2 }}
              className="flex h-full"
            >
              <motion.div
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex flex-col w-full"
              >
                <Card
                  className={`flex flex-col h-full bg-card ${
                    plan.popular
                      ? "border-primary shadow-xl relative ring-2 ring-primary/20"
                      : "hover:shadow-lg"
                  } transition-all duration-300`}
                >
                  {plan.popular && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.5 }}
                      className="absolute -top-4 inset-x-0 mx-auto w-fit py-2 px-4 bg-primary text-primary-foreground text-sm font-medium rounded-full shadow-lg"
                    >
                      Most Popular
                    </motion.div>
                  )}
                  <CardHeader className="text-center pb-8 pt-8">
                    <CardTitle className="text-2xl">{plan.title}</CardTitle>
                    <CardDescription className="text-base">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price !== "Custom" && (
                        <span className="text-muted-foreground text-lg">
                          /month
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 px-6">
                    <motion.ul
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={containerVariants}
                      className="space-y-3"
                    >
                      {plan.features.map((feature, featureIndex) => (
                        <motion.li
                          key={featureIndex}
                          variants={itemVariants}
                          className="flex items-center text-base"
                        >
                          <CheckCircle className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </CardContent>
                  <CardFooter className="pt-6">
                    <Button
                      className="w-full text-base py-6 h-auto"
                      variant="default"
                    >
                      <Link href={API_ROUTES.AUTH.LOGIN}>
                        {plan.title === "Enterprise"
                          ? "Contact Sales"
                          : "Get Started"}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
