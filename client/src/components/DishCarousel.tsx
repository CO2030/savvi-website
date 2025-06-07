
import { motion } from "framer-motion";

export function DishCarousel() {
  const dishes = [
    {
      id: 1,
      image: "/images/salmon-asparagus.png",
      alt: "Salmon with asparagus"
    },
    {
      id: 2,
      image: "/images/salmon-asparagus.png",
      alt: "Grilled chicken salad"
    },
    {
      id: 3,
      image: "/images/salmon-asparagus.png",
      alt: "Quinoa bowl"
    },
    {
      id: 4,
      image: "/images/salmon-asparagus.png",
      alt: "Mediterranean dish"
    },
    {
      id: 5,
      image: "/images/salmon-asparagus.png",
      alt: "Fresh veggie wrap"
    }
  ];

  // Duplicate dishes for seamless infinite scroll
  const allDishes = [...dishes, ...dishes];

  return (
    <section className="py-12 overflow-hidden bg-white">
      <div className="container mx-auto px-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center font-heading text-gray-800 mb-2">
          Delicious, Healthy Meals
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto">
          From quick weeknight dinners to weekend meal prep, SavviWell helps you create nutritious meals you'll love.
        </p>
      </div>
      
      <div className="relative">
        <motion.div
          className="flex gap-6"
          animate={{
            x: [0, -1920], // Adjust based on image width and gap
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {allDishes.map((dish, index) => (
            <div
              key={`${dish.id}-${index}`}
              className="flex-shrink-0 w-80 h-60 rounded-2xl overflow-hidden shadow-lg"
            >
              <img
                src={dish.image}
                alt={dish.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
