"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, ChevronLeft, ChevronRight, Grid, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Sample image data with categories
const imageData = [
  {
    id: 1,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Mountain Landscape",
    category: "nature",
    title: "Majestic Mountains",
  },
  {
    id: 2,
    src: "/placeholder.svg?height=400&width=600",
    alt: "City Skyline",
    category: "urban",
    title: "City Lights",
  },
  {
    id: 3,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Ocean Waves",
    category: "nature",
    title: "Ocean Serenity",
  },
  {
    id: 4,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Abstract Art",
    category: "art",
    title: "Abstract Expression",
  },
  {
    id: 5,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Forest Path",
    category: "nature",
    title: "Forest Trail",
  },
  {
    id: 6,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Modern Architecture",
    category: "urban",
    title: "Modern Design",
  },
  {
    id: 7,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Sunset Beach",
    category: "nature",
    title: "Golden Hour",
  },
  {
    id: 8,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Street Photography",
    category: "urban",
    title: "Street Life",
  },
  {
    id: 9,
    src: "/placeholder.svg?height=400&width=600",
    alt: "Digital Art",
    category: "art",
    title: "Digital Creation",
  },
]

const categories = ["all", "nature", "urban", "art"]

export default function ImageGallery() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [lightboxImage, setLightboxImage] = useState<number | null>(null)
  const [filteredImages, setFilteredImages] = useState(imageData)

  // Filter images based on selected category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredImages(imageData)
    } else {
      setFilteredImages(imageData.filter((img) => img.category === selectedCategory))
    }
  }, [selectedCategory])

  // Handle keyboard navigation in lightbox
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (lightboxImage === null) return

      if (e.key === "Escape") {
        setLightboxImage(null)
      } else if (e.key === "ArrowLeft") {
        navigateLightbox("prev")
      } else if (e.key === "ArrowRight") {
        navigateLightbox("next")
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [lightboxImage])

  const navigateLightbox = (direction: "prev" | "next") => {
    if (lightboxImage === null) return

    const currentIndex = filteredImages.findIndex((img) => img.id === lightboxImage)
    let newIndex

    if (direction === "prev") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1
    } else {
      newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0
    }

    setLightboxImage(filteredImages[newIndex].id)
  }

  const openLightbox = (imageId: number) => {
    setLightboxImage(imageId)
  }

  const closeLightbox = () => {
    setLightboxImage(null)
  }

  const currentLightboxImage = filteredImages.find((img) => img.id === lightboxImage)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Image Gallery</h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our curated collection of stunning images across different categories. Click on any image to view it
            in full size.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by category:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize transition-all duration-200 hover:scale-105"
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <Badge variant="secondary">{filteredImages.length} images</Badge>
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => openLightbox(image.id)}
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                    <p className="text-lg font-semibold mb-1">{image.title}</p>
                    <Badge variant="secondary" className="capitalize">
                      {image.category}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Image Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{image.title}</h3>
                <Badge variant="outline" className="capitalize text-xs">
                  {image.category}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Grid className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No images found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try selecting a different category to see more images.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && currentLightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
            onClick={closeLightbox}
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
            onClick={() => navigateLightbox("prev")}
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
            onClick={() => navigateLightbox("next")}
          >
            <ChevronRight className="w-8 h-8" />
          </Button>

          {/* Main Image */}
          <div className="relative max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center">
            <Image
              src={currentLightboxImage.src || "/placeholder.svg"}
              alt={currentLightboxImage.alt}
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain rounded-lg"
              priority
            />
          </div>

          {/* Image Info */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-white">
            <h3 className="text-xl font-semibold mb-2">{currentLightboxImage.title}</h3>
            <Badge variant="secondary" className="capitalize">
              {currentLightboxImage.category}
            </Badge>
          </div>

          {/* Click outside to close */}
          <div className="absolute inset-0 -z-10" onClick={closeLightbox} />
        </div>
      )}
    </div>
  )
}
