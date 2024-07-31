'use client'
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { Snail } from 'lucide-react'
import Link from 'next/link';
import { X } from 'lucide-react'

interface ImageResult {
    type: string;
    title: string;
    url: string;
    source: string;
    thumbnail: {
        src: string;
    };
    properties: {
        url: string;
    };
    meta_url: {
        favicon: string;
    };
}

interface ImageGalleryProps {
    images: ImageResult[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState<ImageResult | null>(null);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const imagesPerPage = 8;

    useEffect(() => {
        if (isGalleryOpen && !selectedImage && images && images.length > 0) {
            setSelectedImage(images[0]);
        }
    }, [isGalleryOpen, selectedImage, images]);

    const openGallery = () => {
        setIsGalleryOpen(true);
    };

    const closeGallery = () => {
        setIsGalleryOpen(false);
    };

    const handleImageClick = (image: ImageResult) => {
        setSelectedImage(image);
        setIsGalleryOpen(true);
    };

    const paginatedImages = images && images.length > 0
        ? images.slice((currentPage - 1) * imagesPerPage, currentPage * imagesPerPage)
        : [];

    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                {images && images.slice(0, 5).map((image, index) => (
                    <div key={index}
                        className={`cursor-pointer ${index === 0 ? 'col-span-2' : ''} ${index === 4 ? 'relative' : ''}`}
                        onClick={() => handleImageClick(image)}>
                        <div className={`relative ${index === 0 ? 'w-full pb-[66.67%]' : 'w-full pb-[66.67%]'}`}>
                            <Image
                                src={image.thumbnail.src}
                                alt={image.title}
                                fill
                                className={`object-cover rounded-lg ${index === 4 ? 'filter blur-sm' : ''}`}
                                loader={({ src }) => src}
                            />
                        </div>
                        {index === 4 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Button onClick={(e) => { e.stopPropagation(); openGallery(); }} className="z-10">
                                    View More
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                <DialogContent className="max-w-none w-screen h-screen p-0 m-0 bg-black/30" hideCloseButton>
                    <div className="flex flex-col w-full h-full">
                        <div className="flex justify-between items-center p-4">
                            <div className="flex items-center">
                                <Snail className="w-8 h-8 mr-2" />
                                <span className="text-xl font-semibold">Shelplexity</span>
                            </div>
                            <div className="flex items-center space-x-4">
                                {selectedImage && (
                                    <div className="border rounded-md p-2 flex items-center">
                                        <Link href={selectedImage.url} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center">
                                            {selectedImage.meta_url && selectedImage.meta_url.favicon && (
                                                <Image
                                                    src={selectedImage.meta_url.favicon}
                                                    alt="Website favicon"
                                                    width={16}
                                                    height={16}
                                                    className="mr-2 rounded-full"
                                                />
                                            )}
                                            <span className="truncate">{selectedImage.url}</span>
                                        </Link>
                                    </div>
                                )}
                                <DialogClose asChild>
                                    <Button className="rounded-full px-3 py-3" type="button" variant="secondary">
                                        <X className="h-4 w-4 rounded" />
                                    </Button>
                                </DialogClose>
                            </div>
                        </div>
                        <div className="flex flex-1">
                            <div className="w-2/3 p-24 overflow-hidden rounded-lg">
                                {selectedImage && (
                                    <div className="h-full flex flex-col">
                                        <div className="relative w-full h-[calc(100%-4rem)] rounded-lg overflow-hidden">
                                            <Image
                                                src={selectedImage.properties.url}
                                                alt={selectedImage.title}
                                                fill
                                                className="object-contain rounded-lg"
                                                loader={({ src }) => src}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="w-1/3 p-4 overflow-y-auto">
                                <div className="grid grid-cols-2 gap-2">
                                    {paginatedImages.map((image, index) => (
                                        <div key={index} className="cursor-pointer" onClick={() => setSelectedImage(image)}>
                                            <div className="relative w-full pb-[66.67%]">
                                                <Image
                                                    src={image.thumbnail.src}
                                                    alt={image.title}
                                                    fill
                                                    className="object-cover rounded-lg"
                                                    loader={({ src }) => src}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex justify-between">
                                    <Button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil((images?.length || 0) / imagesPerPage)))}
                                        disabled={currentPage === Math.ceil((images?.length || 0) / imagesPerPage)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ImageGallery;