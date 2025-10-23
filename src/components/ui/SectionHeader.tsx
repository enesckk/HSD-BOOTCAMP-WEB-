import React from 'react';
import { motion } from 'framer-motion';

type SectionHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: string;
  className?: string;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({ eyebrow, title, lead, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={`text-center mb-20 ${className ?? ''}`}
    >
      {eyebrow && (
        <div className="inline-flex items-center space-x-2 bg-white border border-[#2563EB]/30 text-[#2563EB] px-6 py-2 rounded-full text-sm font-semibold mb-6">
          <span>{eyebrow}</span>
        </div>
      )}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">{title}</h2>
      {lead && (
        <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">{lead}</p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
