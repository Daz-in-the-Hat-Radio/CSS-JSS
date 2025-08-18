// futuristic-carousel.js
// Array to store YouTube player instances
let players = [];
let currentIndex = 0;
const cards = document.querySelectorAll('.carousel-card');
const track = document.querySelector('.carousel-track');
const indicators = document.querySelectorAll('.indicator');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const totalCards = cards.length;

// Load YouTube Iframe API
function onYouTubeIframeAPIReady() {
    cards.forEach((card, index) => {
        const iframe = card.querySelector('.card-video');
        if (iframe) {
            players[index] = new YT.Player(iframe, {
                events: {
                    'onReady': () => {
                        // Play video for the active card
                        if (index === currentIndex) {
                            players[index].playVideo();
                        }
                    },
                    'onStateChange': (event) => {
                        // Pause video if it ends and auto-scroll is active
                        if (event.data === YT.PlayerState.ENDED && index === currentIndex) {
                            players[index].seekTo(0); // Restart video
                            players[index].playVideo();
                        }
                    }
                }
            });
        }
    });
}

// Update carousel state
function updateCarousel() {
    // Update card positions
    const cardWidth = cards[0].offsetWidth + 20; // Card width + margin
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    // Update active card and video playback
    cards.forEach((card, index) => {
        card.classList.toggle('active', index === currentIndex);
        if (players[index]) {
            if (index === currentIndex) {
                players[index].playVideo();
            } else {
                players[index].pauseVideo();
            }
        }
    });

    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
    });

    // Update button states
    prevButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === totalCards - 1;
}

// Navigation event listeners
prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }
});

nextButton.addEventListener('click', () => {
    if (currentIndex < totalCards - 1) {
        currentIndex++;
        updateCarousel();
    }
});

// Indicator click event
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentIndex = index;
        updateCarousel();
    });
});

// Auto-scroll every 5 seconds
let autoScroll = setInterval(() => {
    currentIndex = (currentIndex + 1) % totalCards;
    updateCarousel();
}, 5000);

// Pause auto-scroll on hover
document.querySelector('.carousel-container').addEventListener('mouseenter', () => {
    clearInterval(autoScroll);
});

document.querySelector('.carousel-container').addEventListener('mouseleave', () => {
    autoScroll = setInterval(() => {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCarousel();
    }, 5000);
});

// Initialize carousel
updateCarousel();
