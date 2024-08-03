"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Snail, X } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

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
  const [validImages, setValidImages] = useState<ImageResult[]>([]);
  
  useEffect(() => {
    const validateImages = async () => {
      const validatedImages = await Promise.all(
        (images || []).map(async (image) => {
          try {
            const thumbnailResponse = await fetch(image.thumbnail.src, {
              method: "HEAD",
            });
            const propertiesUrlResponse = await fetch(image.properties.url, {
              method: "HEAD",
            });
            return thumbnailResponse.ok && propertiesUrlResponse.ok
              ? image
              : null;
          } catch (error) {
            return null;
          }
        })
      );
      const filteredImages = validatedImages.filter(
        (img): img is ImageResult => img !== null
      );
      setValidImages(filteredImages);
    };

    validateImages();
  }, [images]);

  const removeInvalidImage = useCallback((imageUrl: string) => {
    setValidImages((prev) =>
      prev.filter(
        (img) =>
          img.thumbnail.src !== imageUrl && img.properties.url !== imageUrl
      )
    );
  }, []);

  const ImageWrapper = ({ src, alt, ...props }: any) => {
    return (
      <Image
        src={src}
        alt={alt}
        {...props}
        onError={() => removeInvalidImage(src)}
      />
    );
  };

  useEffect(() => {
    if (isGalleryOpen && !selectedImage && validImages.length > 0) {
      setSelectedImage(validImages[0]);
    }
  }, [isGalleryOpen, selectedImage, validImages]);

  const openGallery = () => {
    setIsGalleryOpen(true);
  };

  const handleImageClick = (image: ImageResult) => {
    setSelectedImage(image);
    setIsGalleryOpen(true);
  };

  return (
    <>
      <motion.div 
        className="grid grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {validImages.slice(0, 4).map((image, index) => (
          <motion.div
            key={index}
            className={`cursor-pointer ${index === 0 ? "col-span-2" : ""}`}
            onClick={() => handleImageClick(image)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div
              className={`relative ${index === 0 ? "w-full pb-[66.67%]" : "w-full pb-[66.67%]"}`}
            >
              <ImageWrapper
                src={image.thumbnail.src}
                alt={image.title}
                fill
                className="object-cover rounded-lg"
                loader={({ src }: { src: string }) => src}
              />
            </div>
          </motion.div>
        ))}
        {validImages.length > 4 && (
          <motion.div 
            className="cursor-pointer relative" 
            onClick={openGallery}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 h-full">
              {validImages.slice(4, 7).map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <ImageWrapper
                    src={image.thumbnail.src}
                    alt={image.title}
                    fill
                    className="object-cover rounded-lg"
                    loader={({ src }: { src: string }) => src}
                  />
                </div>
              ))}
            </div>
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="w-[75%] h-[50%] text-[0.7vw] scale-100 hover:scale-105 transition-transform duration-200"
              >
                View More
              </Button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
      <AnimatePresence>
        {isGalleryOpen && (
          <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
            <DialogContent
              className="max-w-none w-screen h-screen p-0 m-0 bg-black/30"
              hideCloseButton
            >
              <motion.div 
                className="flex flex-col w-full h-full"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-between items-center p-4">
                  <div className="flex items-center">
                    <Snail className="w-8 h-8 mr-2" />
                    <span className="text-xl font-semibold">Shelplexity</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    {selectedImage && (
                      <motion.div 
                        className="border rounded-md p-2 flex items-center"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <Link
                          href={selectedImage.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center"
                        >
                          {selectedImage.meta_url &&
                            selectedImage.meta_url.favicon && (
                              <Image
                                src={selectedImage.meta_url.favicon}
                                alt="Website favicon"
                                width={16}
                                height={16}
                                className="mr-2 rounded-full"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  removeInvalidImage(target.src);
                                }}
                              />
                            )}
                          <span className="truncate">{selectedImage.url}</span>
                        </Link>
                      </motion.div>
                    )}
                    <DialogClose asChild>
                      <motion.button
                        className="rounded-full px-3 py-3 bg-secondary"
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="h-4 w-4 rounded" />
                      </motion.button>
                    </DialogClose>
                  </div>
                </div>
                <div className="flex flex-1">
                  <div className="w-2/3 p-24 overflow-hidden rounded-lg">
                    {selectedImage && (
                      <motion.div 
                        className="h-full flex flex-col"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="relative w-full h-[calc(100%-4rem)] rounded-lg overflow-hidden">
                          <ImageWrapper
                            src={selectedImage.properties.url}
                            alt={selectedImage.title}
                            fill
                            className="object-contain rounded-lg"
                            loader={({ src }: { src: string }) => src}
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <div className="w-1/3 p-4">
                    <ScrollArea className="h-[calc(100vh-200px)]">
                      <motion.div 
                        className="grid grid-cols-2 gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, staggerChildren: 0.1 }}
                      >
                        {validImages.map((image, index) => (
                          <motion.div
                            key={index}
                            className="cursor-pointer"
                            onClick={() => setSelectedImage(image)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <div className="relative w-full pb-[66.67%]">
                              <ImageWrapper
                                src={image.thumbnail.src}
                                alt={image.title}
                                fill
                                className="object-cover rounded-lg"
                                loader={({ src }: { src: string }) => src}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    </ScrollArea>
                  </div>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageGallery;
