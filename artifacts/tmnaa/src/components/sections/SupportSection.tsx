import { motion } from 'framer-motion';
import { ForgedButton } from '@/components/ui/ForgedButton';
import supportBgImg from '@assets/Dragon_banner_with_red_sparks_202607270531_1785158973332.jpeg';

export function SupportSection() {
  return (
    <section id="support" className="relative py-32 px-6 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={supportBgImg}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />
      </div>

      <div className="relative z-10 max-w-[1000px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative p-16 rounded-sm overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(20,10,5,0.95), rgba(30,15,5,0.9))',
            border: '3px solid #CFA347',
            boxShadow: '0 0 60px rgba(207, 163, 71, 0.4), inset 0 0 40px rgba(207, 163, 71, 0.1)',
          }}
        >
          {/* Animated Border Shimmer */}
          <div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255, 217, 138, 0.3), transparent)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 3s infinite',
            }}
          />

          <div className="relative z-10 text-center">
            {/* Crown Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="text-8xl mb-8"
            >
              👑
            </motion.div>

            {/* Title */}
            <h2 className="text-5xl md:text-6xl font-black text-[#FFD98A] mb-6">
              ادعم صانع المحتوى
            </h2>

            {/* Description */}
            <p className="text-2xl text-[#D7D7D7] mb-12 leading-relaxed max-w-2xl mx-auto">
              ساهم في دعم المحتوى واستمرار تقديم أفضل البثوث والمقاطع.
              دعمك يعني الكثير ويساعد على تطوير المحتوى بشكل مستمر.
            </p>

            {/* Support Button */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ForgedButton
                variant="fire"
                href="https://creators.sa/tmnaa"
                className="text-2xl px-12 py-6"
              >
                ادعم الآن 💰
              </ForgedButton>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
