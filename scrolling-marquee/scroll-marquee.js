const carousel = document.getElementById('carousel');
const totalItems = document.querySelectorAll('.carousel-item').length;
const visibleItems = 3;
let currentIndex = 0;
let autoScrollInterval;

// Jump to specific day
function goToDay(day) {
  const items = document.querySelectorAll('.carousel-item');
  let index = 0;
  for (let i=0; i<items.length; i++) {
    if (items[i].dataset.day === day) {
      index = i;
      break;
    }
  }
  currentIndex = index;
  updateCarousel();
}

// Update position
function updateCarousel() {
  const itemWidth = document.querySelector('.carousel-item').offsetWidth;
  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex > totalItems - visibleItems) currentIndex = totalItems - visibleItems;
  carousel.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
}

// Manual scroll
function scrollCarousel(direction) {
  currentIndex += direction;
  if (currentIndex < 0) currentIndex = 0;
  if (currentIndex > totalItems - visibleItems) currentIndex = totalItems - visibleItems;
  updateCarousel();
}

// Auto scroll
function startAutoScroll() {
  autoScrollInterval = setInterval(() => {
    currentIndex++;
    if (currentIndex > totalItems - visibleItems) currentIndex = 0;
    updateCarousel();
  }, 3000);
}

// Pause auto on hover
document.getElementById('carousel-container').addEventListener('mouseenter', () => { clearInterval(autoScrollInterval); });
document.getElementById('carousel-container').addEventListener('mouseleave', () => { startAutoScroll(); });

window.addEventListener('resize', () => { updateCarousel(); });
startAutoScroll();
