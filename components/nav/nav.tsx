'use client'
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Nav() {
    const [gradientOpacity, setGradientOpacity] = useState(1);
    const [isContentVisible, setIsContentVisible] = useState(false);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const screenWidth = window.innerWidth;
            const mouseX = event.clientX;
            const threshold = screenWidth / 6; // Adjust this value to change when content fully appears
            const newOpacity = mouseX < threshold ? 0 : (mouseX - threshold) / (threshold);
            setGradientOpacity(Math.min(newOpacity, 1));
            setIsContentVisible(mouseX < threshold);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div className="absolute left-0 top-0 w-1/6 h-screen overflow-hidden">
            <div
                className="absolute inset-0 bg-gradient-to-r from-transparent to-background"
                style={{ opacity: gradientOpacity }}
            />
            <motion.div
                className="w-full h-full border relative z-10"
                initial={{ x: "-100%" }}
                animate={{ x: isContentVisible ? 0 : "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div>
                    content
                </div>
            </motion.div>
        </div>
    )
}