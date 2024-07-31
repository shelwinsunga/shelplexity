'use client'
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Snail, Menu } from 'lucide-react';
import NavFooter from "./nav-footer";
import { User } from 'lucide-react';
import Link from "next/link";
import { useFrontend } from '@/contexts/FrontendContext';

export default function Nav() {
    const { recentThreads, updateRecentThreads } = useFrontend();
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        updateRecentThreads();
    }, [updateRecentThreads]);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (window.innerWidth > 768) {
                const screenWidth = window.innerWidth;
                const mouseX = event.clientX;
                const threshold = isContentVisible ? screenWidth / 4 : screenWidth / 15;
                setIsContentVisible(mouseX < threshold);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [isContentVisible]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <>
            {/* Mobile menu button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <Button variant="ghost" onClick={toggleMobileMenu}>
                    <Menu className="h-6 w-6" />
                </Button>
            </div>

            {/* Desktop and Mobile Nav */}
            <div className={`fixed left-0 top-0 w-72 h-screen overflow-hidden z-40 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="fixed top-0 left-0 w-72 h-full z-10 py-2 bg-gradient-to-r from-muted/10 to-background/90 rounded-md">
                    <div className="w-full h-full rounded-md py-4 flex flex-col justify-between text-sm mt-[1px]">
                        <div className="flex items-center mb-4 px-6 text-muted-foreground/70">
                            <Link href="/" className="flex items-center hover:text-foreground ease-in-out duration-200">
                                <Snail className="w-6 h-6 mr-2" />
                                <h1 className="text-lg font-semibold">Shelplexity</h1>
                            </Link>
                        </div>
                        <div className="mb-[1px]">
                            <div className="flex flex-col space-y-2 mt-auto">
                                <Button variant="ghost" className="w-full justify-start">
                                    <User className="h-5 w-5 mr-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <motion.div
                    className="fixed w-72 h-full left-0 top-0 z-10 py-2"
                    initial={{ opacity: 0, display: 'none' }}
                    animate={{
                        opacity: (isContentVisible || isMobileMenuOpen) ? 1 : 0,
                        display: (isContentVisible || isMobileMenuOpen) ? 'block' : 'none'
                    }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="w-full h-full border rounded-md py-4 flex flex-col text-sm border bg-card">
                        <motion.div
                            className="flex items-center mb-4 px-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <Link href="/" className="flex items-center hover:text-foreground ease-in-out duration-200">
                                <Snail className="w-6 h-6 mr-2" />
                                <h1 className="text-lg font-semibold">Shelplexity</h1>
                            </Link>
                        </motion.div>
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
                                                    <span className="truncate block">
                                                        {thread.query}
                                                    </span>
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
        </>
    )
}