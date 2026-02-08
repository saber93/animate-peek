import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// Universal slide animation variants (all elements slide from far left)
const slideFromFarLeft = {
  hidden: { opacity: 0, x: -2000 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const slideFromFarLeftNoFade = {
  hidden: { opacity: 1, x: -2000 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const slideInDown = {
  hidden: { opacity: 0, y: -80 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 2.1, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay: number) => ({
    opacity: 1,
    transition: { duration: 0.7, delay, ease: "easeOut" as const },
  }),
};

export default function HeroSection() {
  return (
    <section className="relative min-h-[500px] sm:min-h-[550px] lg:h-[700px] bg-cream overflow-hidden">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-4 h-full">
        <div className="flex flex-col lg:flex-row items-center justify-between h-full py-8 lg:py-12">

          {/* LEFT SIDE - Text Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="w-full lg:w-1/2 z-20 text-center lg:text-start order-1 lg:order-1 pt-6 lg:pt-0"
          >
            {/* Organic Badge */}
            <motion.div
              variants={slideInDown}
              custom={0.2}
              className="mb-4 lg:mb-6 inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full"
            >
              <span className="text-2xl">🌿</span>
              <span className="text-primary font-semibold text-sm lg:text-base">100% Organic</span>
            </motion.div>

            {/* Subtitle */}
            <motion.span
              variants={slideFromFarLeft}
              custom={0.4}
              className="block text-primary font-medium text-base lg:text-xl mb-3 lg:mb-4 italic"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Only Organic Products
            </motion.span>

            {/* Main Title */}
            <motion.h1
              variants={slideFromFarLeft}
              custom={0.6}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary leading-tight mb-4 lg:mb-6"
            >
              Healthy
              <br />
              Organic Food
            </motion.h1>

            {/* CTA Button */}
            <motion.div variants={slideFromFarLeft} custom={0.8} className="flex items-center gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6 lg:px-8 py-5 lg:py-6 text-sm lg:text-base rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                DISCOVER MORE
              </Button>

              {/* Curved Arrow */}
              <div className="hidden lg:block text-primary">
                <svg width="60" height="40" viewBox="0 0 60 40" fill="none" className="text-primary">
                  <path
                    d="M5 35 Q30 5 55 20"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M48 15 L55 20 L48 25"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE - Product Images */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="w-full lg:w-1/2 relative h-[280px] sm:h-[320px] lg:h-[500px] xl:h-[600px] order-2 lg:order-2 mt-6 lg:mt-0"
          >
            {/* Main Product Image */}
            <motion.div
              variants={slideFromFarLeftNoFade}
              custom={0.5}
              className="absolute inset-x-4 sm:inset-x-8 lg:right-[10%] lg:left-auto top-1/2 -translate-y-1/2 w-auto lg:w-[400px] h-[220px] sm:h-[260px] lg:h-[400px] z-10"
            >
              <img
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80"
                alt="Fresh vegetables basket"
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
            </motion.div>

            {/* Decorative Broccoli - Hidden on mobile */}
            <motion.div
              variants={slideFromFarLeft}
              custom={0.7}
              className="absolute left-[5%] top-[5%] lg:left-[5%] lg:top-[12%] z-20 hidden sm:block"
            >
              <img
                src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=150&q=80"
                alt="Broccoli"
                className="w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 object-cover rounded-full shadow-lg"
              />
            </motion.div>

            {/* Decorative Flowers - Hidden on mobile */}
            <motion.div
              variants={slideFromFarLeft}
              custom={0.9}
              className="absolute left-[8%] bottom-[10%] lg:left-[15%] lg:bottom-[20%] z-20 hidden sm:block"
            >
              <img
                src="https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=150&q=80"
                alt="White Flowers"
                className="w-10 h-10 lg:w-14 lg:h-14 object-cover rounded-full shadow-lg"
              />
            </motion.div>

            {/* Overlapping Basil - Hidden on mobile */}
            <motion.div
              variants={slideFromFarLeftNoFade}
              custom={1.0}
              className="absolute left-[25%] top-[15%] lg:left-[35%] lg:top-[28%] z-30 hidden sm:block"
            >
              <img
                src="https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=100&q=80"
                alt="Basil leaves"
                className="w-10 h-10 sm:w-14 sm:h-14 lg:w-20 lg:h-20 object-cover rounded-full border-4 border-cream shadow-lg"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-12 lg:h-20 z-10">
        <svg viewBox="0 0 1440 70" fill="none" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M0,70 L1440,70 L1440,40 C1200,10 900,0 720,20 C540,40 240,10 0,30 L0,70 Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>

      {/* Scroll Indicator - Desktop only */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 hidden lg:block">
        <div className="w-8 h-12 border-2 border-primary/50 rounded-full flex justify-center pt-2">
          <div className="w-2 h-2 bg-primary rounded-full" />
        </div>
      </div>
    </section>
  );
}
