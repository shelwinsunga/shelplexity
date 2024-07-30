'use client'
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Snail } from 'lucide-react';
import { Settings } from 'lucide-react';
import NavFooter from "./nav-footer";
import { User } from 'lucide-react';
import Link from "next/link";
import { useFrontend } from '@/contexts/FrontendContext';

export default function Nav() {
    const { recentThreads, updateRecentThreads } = useFrontend();
    const [isContentVisible, setIsContentVisible] = useState(false);

    useEffect(() => {
        updateRecentThreads();
    }, [updateRecentThreads]);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            const screenWidth = window.innerWidth;
            const mouseX = event.clientX;
            const threshold = isContentVisible ? screenWidth / 6 : 18;
            setIsContentVisible(mouseX < threshold);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [isContentVisible]);

    return (
        <div className="absolute left-0 top-0 w-72 h-screen overflow-hidden z-50">
            <div className="absolute left-4 bottom-4 flex items-center justify-center">
                <div className="flex flex-col space-y-2 mt-auto">
                    {/* <Button variant="ghost" className="w-full justify-start">
                        <User className="h-5 w-5 mr-2" />
                        <span>Shelwin Sunga</span>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                        <Settings className="h-5 w-5 mr-2" />
                        <span>Settings</span>
                    </Button> */}
                </div>
            </div>
            <motion.div
                className="w-full h-full relative z-10 py-2"
                initial={{ x: "-100%" }}
                animate={{ x: isContentVisible ? 0 : "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="w-full h-full border rounded-md py-4 flex flex-col text-sm border bg-card">
                    <div className="flex items-center mb-4 px-6 ">
                        <Snail className="w-6 h-6 mr-2" />
                        <h1 className="text-lg font-semibold">Shelplexity</h1>
                    </div>
                    <div className="px-6">
                        <Button variant="outline" className="mb-6 w-full ">
                            New Thread
                        </Button>
                    </div>
                    <div className="flex-grow overflow-y-auto w-full">
                        <h2 className="font-medium text-xs mb-2 text-muted-foreground px-6">Recent</h2>
                        <ul className="space-y-2 px-2">
                            {recentThreads && recentThreads.map((thread) => {
                                const slug = thread.key.split(':')[1];
                                return (
                                    <li key={thread.key}>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-sm text-left"
                                            asChild
                                        >
                                            <Link href={slug}>
                                                {thread.query}
                                            </Link>
                                        </Button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <NavFooter />
                </div>
            </motion.div>
        </div>
    )
}