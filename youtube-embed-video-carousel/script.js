// Initialize variables
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;
let currentIndex = 0;

// Get DOM elements
const track = document.querySelector('.carousel-track');
const items = Array.from(track.children);
const titles = document.querySelectorAll('.title');
const snippets = document.querySelectorAll('.snippet');
const leftBtn = document.querySelector('.left-btn');
const rightBtn = document.querySelector('.right-btn');

// Set initial title and snippet
updateContent();

// Drag functionality
track.addEventListener('mousedown', startDragging);
track.addEventListener('touchstart', startDragging);
track.addEventListener('mouseup', endDragging);
track.addEventListener('touchend', endDragging);
track.addEventListener('mousemove', drag);
track.addEventListener('touchmove', drag);
track.addEventListener('mouseleave', endDragging);

function startDragging(e) {
    isDragging = true;
    startPos = getPositionX(e);
    animationID = requestAnimationFrame(animation);
    track.style.cursor = 'grabbing';
}

function endDragging() {
    isDragging = false;
    cancelAnimationFrame(animationID);
    const movedBy = currentTranslate - prevTranslate;
    if (movedBy < -100 && currentIndex < items.length - 1) currentIndex++;
    if (movedBy > 100 && currentIndex > 0) currentIndex--;
    setPositionByIndex();
    track.style.cursor = 'grab';
}

function drag(e) {
    if (isDragging) {
        const currentPosition = getPositionX(e);
        currentTranslate = prevTranslate + currentPosition - startPos;
    }
}

function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
}

function animation() {
    setTransform();
    if (isDragging) requestAnimationFrame(animation);
}

function setTransform() {
    track.style.transform = `translateX(${currentTranslate}px)`;
    prevTranslate = currentTranslate;
}

function setPositionByIndex() {
    currentTranslate = -currentIndex * (items[0].offsetWidth + 20);
    setTransform();
    updateContent();
}

// Button controls
leftBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        setPositionByIndex();
    }
});

rightBtn.addEventListener('click', () => {
    if (currentIndex < items.length - 1) {
        currentIndex++;
        setPositionByIndex();
    }
});

// Update title and snippet
function updateContent() {
    titles.forEach((title, index) => {
        if (index === currentIndex) {
            title.style.transform = 'translateX(0)';
            title.style.display = 'block';
        } else {
            title.style.transform = 'translateX(100%)';
            title.style.display = 'none';
        }
    });
    snippets.forEach((snippet, index) => {
        snippet.style.display = index === currentIndex ? 'block' : 'none';
    });
}

// Initial slide-in effect for title
setTimeout(() => {
    titles[currentIndex].style.transform = 'translateX(0)';
}, 100);