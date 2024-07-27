'use client'
import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';

const StarryBackground = () => {

    return (
        <motion.div
            className="absolute inset-0 bg-black overflow-hidden z-[-1]"

        >

        </motion.div>
    );
};

export default React.memo(StarryBackground);
