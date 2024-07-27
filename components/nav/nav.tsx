'use client'
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Snail } from 'lucide-react';
import { Settings } from 'lucide-react';
import NavFooter from "./nav-footer";

export default function Nav() {
    const [isContentVisible, setIsContentVisible] = useState(false);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const screenWidth = window.innerWidth;
            const mouseX = event.clientX;
            const threshold = screenWidth / 6; // Adjust this value to change when content fully appears
            setIsContentVisible(mouseX < threshold);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <div className="absolute left-0 top-0 w-72 h-screen overflow-hidden z-50">
            <motion.div
                className="w-full h-full relative z-10 py-2 bg-background"
                initial={{ x: "-100%" }}
                animate={{ x: isContentVisible ? 0 : "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="w-full h-full border rounded-md py-4 flex flex-col text-sm border">
                    <div className="flex items-center mb-4 px-6 ">
                        <Snail className="w-6 h-6 mr-2" />
                        <h1 className="text-lg font-semibold">Shelpexity</h1>
                    </div>
                    <div className="px-6">
                        <Button variant="outline" className="mb-6 w-full ">
                            New Thread
                        </Button>
                    </div>
                    <div className="flex-grow overflow-y-auto w-full">
                        <h2 className="font-medium text-xs mb-2 text-muted-foreground px-6">Yesterday</h2>
                        <ul className="space-y-2 px-2">
                            <li><Button variant="ghost" className="w-full justify-start text-sm text-left">How to implement dark mode?</Button></li>
                            <li><Button variant="ghost" className="w-full justify-start text-sm text-left">Best practices for React hooks</Button></li>
                            <li><Button variant="ghost" className="w-full justify-start text-sm text-left">Optimizing Next.js performance</Button></li>
                        </ul>
                    </div>
                    <NavFooter />
                </div>
            </motion.div>
        </div>
    )
}