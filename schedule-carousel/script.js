let currentIndex = 0;
        const days = document.querySelectorAll('.day-container');
        const totalDays = days.length;
        const carousel = document.getElementById('carousel');

        function updateCarousel() {
            carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        function nextDay() {
            currentIndex = (currentIndex + 1) % totalDays;
            updateCarousel();
        }

        function prevDay() {
            currentIndex = (currentIndex - 1 + totalDays) % totalDays;
            updateCarousel();
        }

        // Make table cells editable and log changes
        document.querySelectorAll('td[contenteditable="true"]').forEach(cell => {
            cell.addEventListener('blur', () => {
                console.log('Cell edited:', cell.textContent);
            });
        });

        // Initialize carousel
        updateCarousel();