import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface CarouselItem {
  id: string;
  image: string;
  title: string;
}

const items: CarouselItem[] = [
  { id: '1', image: '/Images/banner 1.jpeg', title: 'Warehouse Operations' },
  { id: '2', image: '/Images/Banner 2.jpeg', title: 'Retail Excellence' },
  { id: '3', image: '/Images/banner 3.jpeg', title: 'Hospitality Service' },
  { id: '4', image: '/Images/banner 4.jpeg', title: 'Tech Innovation' },
  { id: '5', image: '/Images/banner 5.jpeg', title: 'Team Collaboration' },
];

export function CoverflowCarousel() {
  const [activeIndex, setActiveIndex] = useState(Math.floor(items.length / 2));

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden" style={{ perspective: '1200px' }}>
      <div className="relative h-[300px] flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
        {items.map((item, index) => {
          const activeTrackIndex = index - activeIndex;
          const isActive = activeTrackIndex === 0;

          return (
            <motion.div
              key={item.id}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x > 50) setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
                if (info.offset.x < -50) setActiveIndex((prev) => (prev + 1) % items.length);
              }}
              className="absolute cursor-pointer overflow-hidden rounded-[32px] shadow-2xl w-[374px] h-[274px]"
              initial={false}
              animate={{
                x: activeTrackIndex * 80,
                z: Math.abs(activeTrackIndex) * -150,
                rotateY: activeTrackIndex * -40,
                scaleX: isActive ? 1 : 0.8,
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              onClick={() => setActiveIndex(index)}
              style={{
                zIndex: 100 - Math.abs(activeTrackIndex),
                transformStyle: 'preserve-3d',
              }}
            >
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
