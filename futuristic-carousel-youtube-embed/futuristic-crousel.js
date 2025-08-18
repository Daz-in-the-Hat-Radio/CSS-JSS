const track = document.querySelector(".carousel-track");
const cards = Array.from(track.children);
const nextButton = document.querySelector(".carousel-button.next");
const prevButton = document.querySelector(".carousel-button.prev");
const container = document.querySelector(".carousel-container");
const indicators = document.querySelectorAll(".carousel-indicators .indicator");

let currentIndex = 0;
let cardWidth = cards[0].offsetWidth;
let cardMargin = parseInt(window.getComputedStyle(cards[0]).marginRight);
let isMoving = false; // Global flag to prevent concurrent transitions

// Debounce function
function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Initialize carousel
function initializeCarousel() {
    cardWidth = cards[0].offsetWidth;
    cardMargin = parseInt(window.getComputedStyle(cards[0]).marginRight);
    updateCarousel();
    moveToSlide(currentIndex); // Ensure initial positioning
}

// Update carousel state
function updateCarousel() {
    cards.forEach((card, index) => {
        card.classList.remove("is-active", "is-prev", "is-next", "is-far-prev", "is-far-next");
        if (index === currentIndex) {
            card.classList.add("is-active");
        } else if (index === currentIndex - 1) {
            card.classList.add("is-prev");
        } else if (index === currentIndex + 1) {
            card.classList.add("is-next");
        } else if (index < currentIndex - 1) {
            card.classList.add("is-far-prev");
        } else if (index > currentIndex + 1) {
            card.classList.add("is-far-next");
        }
    });

    indicators.forEach((indicator, index) => {
        indicator.classList.toggle("active", index === currentIndex);
    });
}

// Move to a specific slide
function moveToSlide(targetIndex) {
    if (isMoving || targetIndex < 0 || targetIndex >= cards.length) return;
    isMoving = true;

    const amountToMove = targetIndex * (cardWidth + cardMargin);
    track.style.transition = "transform 0.5s ease-in-out";
    track.style.transform = `translateX(-${amountToMove}px)`;
    currentIndex = targetIndex;
    updateCarousel();

    // Simple flash effect
    const flashEffect = document.createElement("div");
    flashEffect.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(56, 189, 248, 0.1);
        z-index: 30;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
    `;
    container.appendChild(flashEffect);
    setTimeout(() => {
        flashEffect.style.opacity = "0.2";
        setTimeout(() => {
            flashEffect.style.opacity = "0";
            setTimeout(() => {
                container.removeChild(flashEffect);
                isMoving = false; // Release lock after transition
            }, 200);
        }, 100);
    }, 10);
}

// Event Listeners
nextButton.addEventListener("click", debounce(() => {
    if (currentIndex < cards.length - 1) {
        moveToSlide(currentIndex + 1);
    }
}, 500));

prevButton.addEventListener("click", debounce(() => {
    if (currentIndex > 0) {
        moveToSlide(currentIndex - 1);
    }
}, 500));

// Indicator clicks
indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", debounce(() => {
        moveToSlide(index);
    }, 500));
});

// Swipe Functionality
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID;

track.addEventListener("mousedown", dragStart);
track.addEventListener("touchstart", dragStart, { passive: true });
track.addEventListener("mousemove", drag);
track.addEventListener("touchmove", drag, { passive: true });
track.addEventListener("mouseup", dragEnd);
track.addEventListener("mouseleave", dragEnd);
track.addEventListener("touchend", dragEnd);

function dragStart(event) {
    if (isMoving) return;
    isDragging = true;
    startPos = getPositionX(event);
    const transformMatrix = window.getComputedStyle(track).getPropertyValue("transform");
    currentTranslate = transformMatrix !== "none" ? parseInt(transformMatrix.split(",")[4]) : 0;
    prevTranslate = currentTranslate;
    track.style.transition = "none";
    animationID = requestAnimationFrame(animation);
    track.style.cursor = "grabbing";
}

function drag(event) {
    if (isDragging) {
        const currentPosition = getPositionX(event);
        const moveX = currentPosition - startPos;
        currentTranslate = prevTranslate + moveX;
    }
}

function animation() {
    if (!isDragging) return;
    track.style.transform = `translateX(${currentTranslate}px)`;
    requestAnimationFrame(animation);
}

function dragEnd() {
    if (!isDragging) return;
    cancelAnimationFrame(animationID);
    isDragging = false;
    track.style.cursor = "grab";
    const movedBy = currentTranslate - prevTranslate;
    const threshold = cardWidth / 4;

    if (movedBy < -threshold && currentIndex < cards.length - 1) {
        moveToSlide(currentIndex + 1);
    } else if (movedBy > threshold && currentIndex > 0) {
        moveToSlide(currentIndex - 1);
    } else {
        moveToSlide(currentIndex); // Snap back
    }
}

function getPositionX(event) {
    return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

// Keyboard navigation
document.addEventListener("keydown", debounce((e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        if (currentIndex < cards.length - 1) {
            moveToSlide(currentIndex + 1);
        }
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        if (currentIndex > 0) {
            moveToSlide(currentIndex - 1);
        }
    }
}, 500));

// Window resize handler
window.addEventListener("resize", debounce(() => {
    initializeCarousel();
    moveToSlide(currentIndex);
}, 250));

// Add hover effects
cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
        if (!card.classList.contains("is-active")) return;
        const glitchEffect = () => {
            if (!card.matches(":hover") || !card.classList.contains("is-active")) return;
            const xOffset = Math.random() * 4 - 2;
            const yOffset = Math.random() * 4 - 2;
            card.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            const r = Math.random() * 10 - 5;
            const g = Math.random() * 10 - 5;
            const b = Math.random() * 10 - 5;
            card.style.boxShadow = `
                ${r}px 0 0 rgba(255, 0, 0, 0.2),
                ${g}px 0 0 rgba(0, 255, 0, 0.2),
                ${b}px 0 0 rgba(0, 0, 255, 0.2),
                0 15px 25px rgba(0, 0, 0, 0.5)
            `;
            setTimeout(() => {
                if (!card.matches(":hover") || !card.classList.contains("is-active")) return;
                card.style.transform = "none";
                card.style.boxShadow = "0 15px 25px rgba(0, 0, 0, 0.5)";
            }, 50);
            if (Math.random() > 0.7) {
                setTimeout(glitchEffect, Math.random() * 1000 + 500);
            }
        };
        setTimeout(glitchEffect, 500);
    });

    card.addEventListener("mouseleave", function () {
        if (card.classList.contains("is-active")) {
            card.style.transform = "none";
            card.style.boxShadow = "0 15px 25px rgba(0, 0, 0, 0.5)";
        }
    });
});

// Scanning animation
function animateActiveCard() {
    const activeCard = document.querySelector(".carousel-card.is-active");
    if (!activeCard) return;
    const scanLine = document.createElement("div");
    scanLine.style.cssText = `
        position: absolute;
        left: 0;
        top: 0;
        height: 2px;
        width: 100%;
        background: linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.8), transparent);
        opacity: 0.7;
        z-index: 10;
        pointer-events: none;
        animation: scanAnimation 2s ease-in-out;
    `;
    const style = document.createElement("style");
    style.textContent = `
        @keyframes scanAnimation {
            0% { top: 0; }
            75% { top: calc(100% - 2px); }
            100% { top: calc(100% - 2px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    const imageContainer = activeCard.querySelector(".card-image-container");
    imageContainer.appendChild(scanLine);
    setTimeout(() => {
        imageContainer.removeChild(scanLine);
    }, 2000);
}

// Data counter animation
function animateDataCounter() {
    const activeCard = document.querySelector(".carousel-card.is-active");
    if (!activeCard) return;
    const statsElement = activeCard.querySelector(".card-stats");
    const completionText = statsElement.lastElementChild.textContent;
    const percentageMatch = completionText.match(/(\d+)%/);
    if (percentageMatch) {
        const targetPercentage = parseInt(percentageMatch[1]);
        let currentPercentage = 0;
        statsElement.lastElementChild.textContent = "0% COMPLETE";
        const interval = setInterval(() => {
            currentPercentage += Math.ceil(targetPercentage / 15);
            if (currentPercentage >= targetPercentage) {
                currentPercentage = targetPercentage;
                clearInterval(interval);
            }
            statsElement.lastElementChild.textContent = `${currentPercentage}% COMPLETE`;
        }, 50);
        const progressBar = activeCard.querySelector(".progress-value");
        progressBar.style.width = "0%";
        setTimeout(() => {
            progressBar.style.transition = "width 0.8s ease-in-out";
            progressBar.style.width = `${targetPercentage}%`;
        }, 100);
    }
}

// Handle active card changes
function handleCardActivation() {
    animateActiveCard();
    animateDataCounter();
    setTimeout(() => {
        const progressBars = document.querySelectorAll(".progress-value");
        progressBars.forEach((bar) => {
            bar.style.transition = "none";
        });
    }, 1000);
}

// Mutation observer for active card changes
let previousActive = null;
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
            const target = mutation.target;
            if (target.classList.contains("is-active") && target !== previousActive) {
                previousActive = target;
                handleCardActivation();
            }
        }
    });
});
cards.forEach((card) => {
    observer.observe(card, { attributes: true });
});

// Keyboard navigation feedback
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowUp") {
        const button = e.key === "ArrowRight" || e.key === "ArrowDown" ? nextButton : prevButton;
        button.style.transform = "translateY(-50%) scale(1.2)";
        setTimeout(() => {
            button.style.transform = "translateY(-50%) scale(1)";
        }, 200);
    }
});

// Indicator animations
indicators.forEach((indicator) => {
    indicator.addEventListener("click", function () {
        this.style.transform = "scale(1.3)";
        setTimeout(() => {
            this.style.transform = "";
        }, 300);
    });
});

// Initialize
window.onload = () => {
    initializeCarousel();
    moveToSlide(0); // Start at first slide
    setTimeout(() => {
        handleCardActivation();
        setInterval(() => {
            if (Math.random() > 0.8) { // Reduced frequency
                animateActiveCard();
            }
        }, 10000); // Increased interval
    }, 500);
};
