document.addEventListener('DOMContentLoaded', function() {
    const numBars = 15; // count columns
    const numSpans = 15; // count lines
    const animationSpeed = 50; // speed update

    const colors = [
        '#fc0127', '#fb0275', '#b50cd3', '#6407e9', '#2a06a9',
        '#080ad7', '#0265e2', '#03fcfc', '#02fe46', '#05fb0f',
        '#97f611', '#f5e506', '#d7a414', '#fc6b02', '#df1506'
    ];

    const equalizer = document.querySelector('.equalizer');

    // Create equalizer bars
    for (let i = 0; i < numBars; i++) {
        const bar = document.createElement('div');
        bar.classList.add('equalizer-bar');

        for (let j = 0; j < numSpans; j++) {
            const span = document.createElement('span');
            span.style.backgroundColor = colors[i % colors.length];
            bar.appendChild(span);
        }

        equalizer.appendChild(bar);
    }

    const bars = document.querySelectorAll('.equalizer-bar');

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function updateBars() {
        bars.forEach(bar => {
            const spans = bar.querySelectorAll('span');
            const visibleSpans = Array.from(spans).filter(span => span.style.opacity === '1').length;
            const newVisibleSpans = getRandomInt(Math.max(0, visibleSpans - 1), Math.min(spans.length, visibleSpans + 1));

            spans.forEach((span, index) => {
                if (index < newVisibleSpans) {
                    span.style.opacity = '1';
                    span.style.height = '8px';
                } else {
                    span.style.opacity = '0';
                    span.style.height = '4px';
                }
            });
        });
    }

    setInterval(updateBars, animationSpeed);
});