'use client'
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function Nav() {
    const [gradientOpacity, setGradientOpacity] = useState(0);
    const [isContentVisible, setIsContentVisible] = useState(false);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const screenWidth = window.innerWidth;
            const mouseX = event.clientX;
            const threshold = screenWidth / 6; // Adjust this value to change when content fully appears
            const newOpacity = mouseX < threshold ? 1 - (mouseX / threshold) : 0;
            setGradientOpacity(Math.max(newOpacity, 0));
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
                style={{ opacity: isContentVisible ? 0 : gradientOpacity }}
            />
            <motion.div
                className="w-full h-full relative z-10 py-2"
                initial={{ x: "-100%" }}
                animate={{ x: isContentVisible ? 0 : "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="w-full h-full border rounded-md p-4 flex flex-col text-sm">
                    <h1 className="text-lg font-semibold mb-4">Logo</h1>
                    <nav className="mb-6">
                        <ul className="space-y-2">
                            <li><Button variant="ghost" className="w-full justify-start">Home</Button></li>
                            <li><Button variant="ghost" className="w-full justify-start">Discover</Button></li>
                            <li><Button variant="ghost" className="w-full justify-start">Library</Button></li>
                        </ul>
                    </nav>
                    <Button variant="outline" className="mb-6">
                        New Thread
                    </Button>
                    <div className="flex-grow overflow-y-auto">
                        <h2 className="font-medium mb-2">Previous Queries</h2>
                        <ul className="space-y-2">
                            <li><Button variant="ghost" className="w-full justify-start text-xs">How to implement dark mode?</Button></li>
                            <li><Button variant="ghost" className="w-full justify-start text-xs">Best practices for React hooks</Button></li>
                            <li><Button variant="ghost" className="w-full justify-start text-xs">Optimizing Next.js performance</Button></li>
                        </ul>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}