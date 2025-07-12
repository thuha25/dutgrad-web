"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { API_ROUTES } from "@/lib/constants";

export function CTASection() {
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

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800 text-white relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        <div className="absolute top-0 -left-40 w-80 h-80 bg-white rounded-full mix-blend-overlay blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-white rounded-full mix-blend-overlay blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white rounded-full mix-blend-overlay blur-3xl opacity-10"></div>
      </motion.div>

      <div className="container px-6 md:px-12 lg:px-16 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUpVariants}
          className="flex flex-col items-center justify-center space-y-8 text-center"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm px-4 py-2 text-sm font-medium border border-white/20"
            >
              <Rocket className="mr-2 h-4 w-4" />
              Ready to get started?
            </motion.div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl max-w-4xl">
              <div className="flex flex-col">
                <p>Ready to Transform Your</p>
                <p>Document Management?</p>
              </div>
            </h2>
            <p className="max-w-[800px] text-blue-100 text-lg md:text-xl leading-relaxed">
              Join thousands of satisfied users who have revolutionized how they
              work with documents. Start your free trial today.
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 group text-base px-8 py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link href={API_ROUTES.AUTH.LOGIN}>Start Free Trial</Link>
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
                className="ml-2"
              >
                <ArrowRight className="h-5 w-5" />
              </motion.span>
            </Button>
            <Button
              size="lg"
              className="border-2 border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-base px-8 py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link href={API_ROUTES.AUTH.LOGIN}>Schedule Demo</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
