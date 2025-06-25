// Image data with categories
const defaultImageData = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    alt: "Mountain Landscape",
    category: "nature",
    title: "Majestic Mountains",
    description: "Breathtaking mountain landscape with snow-capped peaks",
    isUserAdded: false,
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop",
    alt: "City Skyline",
    category: "urban",
    title: "City Lights",
    description: "Urban skyline illuminated at night",
    isUserAdded: false,
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&h=400&fit=crop",
    alt: "Ocean Waves",
    category: "nature",
    title: "Ocean Serenity",
    description: "Peaceful ocean waves meeting the shore",
    isUserAdded: false,
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop",
    alt: "Abstract Art",
    category: "art",
    title: "Abstract Expression",
    description: "Colorful abstract artwork with flowing patterns",
    isUserAdded: false,
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    alt: "Forest Path",
    category: "nature",
    title: "Forest Trail",
    description: "Mysterious forest path surrounded by tall trees",
    isUserAdded: false,
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop",
    alt: "Modern Architecture",
    category: "urban",
    title: "Modern Design",
    description: "Contemporary architectural masterpiece",
    isUserAdded: false,
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
    alt: "Sunset Beach",
    category: "nature",
    title: "Golden Hour",
    description: "Beautiful sunset over a pristine beach",
    isUserAdded: false,
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop",
    alt: "Street Photography",
    category: "urban",
    title: "Street Life",
    description: "Vibrant street scene capturing urban energy",
    isUserAdded: false,
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=400&fit=crop",
    alt: "Digital Art",
    category: "art",
    title: "Digital Creation",
    description: "Modern digital art with vibrant colors",
    isUserAdded: false,
  },
]

// Global variables
let currentCategory = "all"
let filteredImages = []
let currentLightboxIndex = 0
let imageData = []
let nextImageId = 10

// DOM elements
const imageGrid = document.getElementById("imageGrid")
const filterButtons = document.querySelectorAll(".filter-btn")
const imageCounter = document.getElementById("imageCount")
const lightbox = document.getElementById("lightbox")
const lightboxImage = document.getElementById("lightboxImage")
const lightboxTitle = document.getElementById("lightboxTitle")
const lightboxCategory = document.getElementById("lightboxCategory")
const lightboxDescription = document.getElementById("lightboxDescription")
const closeLightboxBtn = document.getElementById("closeLightbox")
const deleteLightboxBtn = document.getElementById("deleteLightbox")
const prevImageBtn = document.getElementById("prevImage")
const nextImageBtn = document.getElementById("nextImage")
const emptyState = document.getElementById("emptyState")

// Add Image Modal elements
const addImageBtn = document.getElementById("addImageBtn")
const addImageModal = document.getElementById("addImageModal")
const closeAddModalBtn = document.getElementById("closeAddModal")
const cancelAddBtn = document.getElementById("cancelAdd")
const addImageForm = document.getElementById("addImageForm")
const imageFileInput = document.getElementById("imageFile")
const imageTitleInput = document.getElementById("imageTitle")
const imageCategorySelect = document.getElementById("imageCategory")
const imageDescriptionInput = document.getElementById("imageDescription")
const imagePreview = document.getElementById("imagePreview")
const previewImg = document.getElementById("previewImg")
const removePreviewBtn = document.getElementById("removePreview")
const successToast = document.getElementById("successToast")

// Initialize the gallery
function initGallery() {
  loadImagesFromStorage()
  renderImages()
  setupEventListeners()
  updateImageCounter()
}

// Load images from localStorage
function loadImagesFromStorage() {
  const savedImages = localStorage.getItem("galleryImages")
  if (savedImages) {
    const userImages = JSON.parse(savedImages)
    imageData = [...defaultImageData, ...userImages]
    // Update nextImageId to avoid conflicts
    if (userImages.length > 0) {
      nextImageId = Math.max(...userImages.map((img) => img.id)) + 1
    }
  } else {
    imageData = [...defaultImageData]
  }
  filteredImages = [...imageData]
}

// Save user images to localStorage
function saveImagesToStorage() {
  const userImages = imageData.filter((img) => img.isUserAdded)
  localStorage.setItem("galleryImages", JSON.stringify(userImages))
}

// Render images in the grid
function renderImages() {
  imageGrid.innerHTML = ""

  if (filteredImages.length === 0) {
    imageGrid.style.display = "none"
    emptyState.style.display = "block"
    return
  }

  imageGrid.style.display = "grid"
  emptyState.style.display = "none"

  filteredImages.forEach((image, index) => {
    const imageItem = createImageElement(image, index)
    imageGrid.appendChild(imageItem)
  })
}

// Create individual image element
function createImageElement(image, index) {
  const imageItem = document.createElement("div")
  imageItem.className = `image-item ${image.isUserAdded ? "user-added" : ""}`
  imageItem.style.animationDelay = `${index * 0.1}s`

  imageItem.innerHTML = `
        <div class="image-container">
            <img src="${image.src}" alt="${image.alt}" loading="lazy">
            <div class="image-overlay">
                <div class="overlay-content">
                    <h3>${image.title}</h3>
                    <span class="overlay-category">${image.category}</span>
                </div>
            </div>
        </div>
        <div class="image-info">
            <h3>${image.title}</h3>
            <span class="image-category">${image.category}</span>
        </div>
    `

  // Add click event to open lightbox
  imageItem.addEventListener("click", () => openLightbox(image.id))

  return imageItem
}

// Filter images by category
function filterImages(category) {
  currentCategory = category

  if (category === "all") {
    filteredImages = [...imageData]
  } else {
    filteredImages = imageData.filter((image) => image.category === category)
  }

  // Update active filter button
  filterButtons.forEach((btn) => {
    btn.classList.remove("active")
    if (btn.dataset.category === category) {
      btn.classList.add("active")
    }
  })

  renderImages()
  updateImageCounter()
}

// Update image counter
function updateImageCounter() {
  const count = filteredImages.length
  imageCounter.textContent = `${count} image${count !== 1 ? "s" : ""}`
}

// Open lightbox
function openLightbox(imageId) {
  const imageIndex = filteredImages.findIndex((img) => img.id === imageId)
  if (imageIndex === -1) return

  currentLightboxIndex = imageIndex
  updateLightboxContent()
  lightbox.classList.add("active")
  document.body.style.overflow = "hidden"
}

// Close lightbox
function closeLightbox() {
  lightbox.classList.remove("active")
  document.body.style.overflow = "auto"
}

// Update lightbox content
function updateLightboxContent() {
  const currentImage = filteredImages[currentLightboxIndex]
  if (!currentImage) return

  lightboxImage.src = currentImage.src
  lightboxImage.alt = currentImage.alt
  lightboxTitle.textContent = currentImage.title
  lightboxCategory.textContent = currentImage.category
  lightboxDescription.textContent = currentImage.description || ""

  // Show delete button only for user-added images
  if (currentImage.isUserAdded) {
    deleteLightboxBtn.style.display = "block"
  } else {
    deleteLightboxBtn.style.display = "none"
  }
}

// Navigate lightbox
function navigateLightbox(direction) {
  if (direction === "prev") {
    currentLightboxIndex = currentLightboxIndex > 0 ? currentLightboxIndex - 1 : filteredImages.length - 1
  } else {
    currentLightboxIndex = currentLightboxIndex < filteredImages.length - 1 ? currentLightboxIndex + 1 : 0
  }

  updateLightboxContent()
}

// Delete user image
function deleteUserImage() {
  const currentImage = filteredImages[currentLightboxIndex]
  if (!currentImage || !currentImage.isUserAdded) return

  if (confirm("Are you sure you want to delete this image?")) {
    // Remove from imageData
    imageData = imageData.filter((img) => img.id !== currentImage.id)

    // Update filtered images
    filterImages(currentCategory)

    // Save to localStorage
    saveImagesToStorage()

    // Close lightbox
    closeLightbox()

    // Show success message
    showToast("Image deleted successfully!")
  }
}

// Open add image modal
function openAddImageModal() {
  addImageModal.classList.add("active")
  document.body.style.overflow = "hidden"
}

// Close add image modal
function closeAddImageModal() {
  addImageModal.classList.remove("active")
  document.body.style.overflow = "auto"
  resetAddImageForm()
}

// Reset add image form
function resetAddImageForm() {
  addImageForm.reset()
  imagePreview.style.display = "none"
  previewImg.src = ""
}

// Handle file input change
function handleFileInputChange(event) {
  const file = event.target.files[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image file.")
    return
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert("File size must be less than 5MB.")
    return
  }

  // Show preview
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImg.src = e.target.result
    imagePreview.style.display = "block"

    // Auto-fill title if empty
    if (!imageTitleInput.value) {
      imageTitleInput.value = file.name.replace(/\.[^/.]+$/, "")
    }
  }
  reader.readAsDataURL(file)
}

// Remove image preview
function removeImagePreview() {
  imageFileInput.value = ""
  imagePreview.style.display = "none"
  previewImg.src = ""
}

// Handle form submission
function handleAddImageSubmit(event) {
  event.preventDefault()

  const file = imageFileInput.files[0]
  if (!file) {
    alert("Please select an image file.")
    return
  }

  const title = imageTitleInput.value.trim()
  const category = imageCategorySelect.value
  const description = imageDescriptionInput.value.trim()

  if (!title || !category) {
    alert("Please fill in all required fields.")
    return
  }

  // Create new image object
  const reader = new FileReader()
  reader.onload = (e) => {
    const newImage = {
      id: nextImageId++,
      src: e.target.result,
      alt: title,
      category: category,
      title: title,
      description: description,
      isUserAdded: true,
    }

    // Add to imageData
    imageData.push(newImage)

    // Update filtered images if current category matches
    if (currentCategory === "all" || currentCategory === category) {
      filteredImages.push(newImage)
    }

    // Save to localStorage
    saveImagesToStorage()

    // Re-render images
    renderImages()
    updateImageCounter()

    // Close modal
    closeAddImageModal()

    // Show success message
    showToast("Image added successfully!")

    // Scroll to new image
    setTimeout(() => {
      const newImageElement = document.querySelector(`.image-item:last-child`)
      if (newImageElement) {
        newImageElement.scrollIntoView({ behavior: "smooth", block: "center" })
      }
    }, 100)
  }
  reader.readAsDataURL(file)
}

// Show toast notification
function showToast(message) {
  successToast.querySelector("span").textContent = message
  successToast.classList.add("show")

  setTimeout(() => {
    successToast.classList.remove("show")
  }, 3000)
}

// Setup event listeners
function setupEventListeners() {
  // Filter buttons
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterImages(btn.dataset.category)
    })
  })

  // Add image modal
  addImageBtn.addEventListener("click", openAddImageModal)
  closeAddModalBtn.addEventListener("click", closeAddImageModal)
  cancelAddBtn.addEventListener("click", closeAddImageModal)

  // Close modal when clicking overlay
  addImageModal.querySelector(".modal-overlay").addEventListener("click", closeAddImageModal)

  // File input
  imageFileInput.addEventListener("change", handleFileInputChange)
  removePreviewBtn.addEventListener("click", removeImagePreview)

  // Form submission
  addImageForm.addEventListener("submit", handleAddImageSubmit)

  // Lightbox controls
  closeLightboxBtn.addEventListener("click", closeLightbox)
  deleteLightboxBtn.addEventListener("click", deleteUserImage)
  prevImageBtn.addEventListener("click", () => navigateLightbox("prev"))
  nextImageBtn.addEventListener("click", () => navigateLightbox("next"))

  // Close lightbox when clicking overlay
  lightbox.querySelector(".lightbox-overlay").addEventListener("click", closeLightbox)

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (lightbox.classList.contains("active")) {
      switch (e.key) {
        case "Escape":
          closeLightbox()
          break
        case "ArrowLeft":
          navigateLightbox("prev")
          break
        case "ArrowRight":
          navigateLightbox("next")
          break
        case "Delete":
          if (filteredImages[currentLightboxIndex]?.isUserAdded) {
            deleteUserImage()
          }
          break
      }
    }

    if (addImageModal.classList.contains("active") && e.key === "Escape") {
      closeAddImageModal()
    }
  })

  // Prevent lightbox from closing when clicking on content
  document.querySelector(".lightbox-content").addEventListener("click", (e) => {
    e.stopPropagation()
  })

  // Prevent modal from closing when clicking on content
  document.querySelector(".modal-content").addEventListener("click", (e) => {
    e.stopPropagation()
  })

  // Drag and drop functionality
  const fileInputDisplay = document.querySelector(".file-input-display")

  fileInputDisplay.addEventListener("dragover", (e) => {
    e.preventDefault()
    fileInputDisplay.style.borderColor = "#00f2fe"
    fileInputDisplay.style.background = "#f0f8ff"
  })

  fileInputDisplay.addEventListener("dragleave", (e) => {
    e.preventDefault()
    fileInputDisplay.style.borderColor = "#4facfe"
    fileInputDisplay.style.background = "#f8f9ff"
  })

  fileInputDisplay.addEventListener("drop", (e) => {
    e.preventDefault()
    fileInputDisplay.style.borderColor = "#4facfe"
    fileInputDisplay.style.background = "#f8f9ff"

    const files = e.dataTransfer.files
    if (files.length > 0) {
      imageFileInput.files = files
      handleFileInputChange({ target: { files } })
    }
  })
}

// Touch support for mobile devices
let touchStartX = 0
let touchEndX = 0

lightbox.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX
})

lightbox.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX
  handleSwipe()
})

function handleSwipe() {
  const swipeThreshold = 50
  const diff = touchStartX - touchEndX

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      navigateLightbox("next")
    } else {
      navigateLightbox("prev")
    }
  }
}

// Interactive header effect
document.addEventListener("mousemove", (e) => {
  const header = document.querySelector(".header")
  const rect = header.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top

  if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
    const xPercent = (x / rect.width) * 100
    const yPercent = (y / rect.height) * 100

    header.style.background = `
            radial-gradient(circle at ${xPercent}% ${yPercent}%, 
            rgba(255, 255, 255, 0.3) 0%, 
            transparent 50%),
            linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)
        `
  }
})

// Initialize gallery when DOM is loaded
document.addEventListener("DOMContentLoaded", initGallery)
