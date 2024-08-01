"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Snail, X } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    setValidImages(images || []);
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
      <div className="grid grid-cols-2 gap-4">
        {validImages.slice(0, 4).map((image, index) => (
          <div
            key={index}
            className={`cursor-pointer ${index === 0 ? "col-span-2" : ""}`}
            onClick={() => handleImageClick(image)}
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
          </div>
        ))}
        {validImages.length > 4 && (
          <div className="cursor-pointer relative" onClick={openGallery}>
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
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
              <Button variant="outline" size="sm" className="w-[75%] h-[50%] text-[0.7vw] scale-100 hover:scale-105 transition-transform duration-200">View More</Button>
            </div>
          </div>
        )}
      </div>
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent
          className="max-w-none w-screen h-screen p-0 m-0 bg-black/30"
          hideCloseButton
        >
          <div className="flex flex-col w-full h-full">
            <div className="flex justify-between items-center p-4">
              <div className="flex items-center">
                <Snail className="w-8 h-8 mr-2" />
                <span className="text-xl font-semibold">Shelplexity</span>
              </div>
              <div className="flex items-center space-x-4">
                {selectedImage && (
                  <div className="border rounded-md p-2 flex items-center">
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
                  </div>
                )}
                <DialogClose asChild>
                  <Button
                    className="rounded-full px-3 py-3"
                    type="button"
                    variant="secondary"
                  >
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
                      <ImageWrapper
                        src={selectedImage.properties.url}
                        alt={selectedImage.title}
                        fill
                        className="object-contain rounded-lg"
                        loader={({ src }: { src: string }) => src}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="w-1/3 p-4">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="grid grid-cols-2 gap-2">
                    {validImages.map((image, index) => (
                      <div
                        key={index}
                        className="cursor-pointer"
                        onClick={() => setSelectedImage(image)}
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
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageGallery;
