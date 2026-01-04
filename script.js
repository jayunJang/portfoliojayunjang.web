document.addEventListener('DOMContentLoaded', () => {
    const textOverlay = document.querySelector('.text-overlay');
    const txtTop = document.querySelector('.txt-top');
    const txtBottom = document.querySelector('.txt-bottom');
    const sliderContainer = document.getElementById('slider-container');
    const sliderHandle = document.getElementById('slider-handle');
    const carrierWrapper = document.getElementById('carrier-wrapper');

    // [핵심 변경 1] 스크롤 로직을 별도 함수로 분리했습니다.
    function handleScroll() {
        const scrollTop = window.scrollY;
        const maxScroll = document.body.scrollHeight - window.innerHeight;

        // Progress: 0 to 1
        let progress = scrollTop / maxScroll;
        if (progress < 0) progress = 0;
        if (progress > 1) progress = 1;

        // A. Carrier Logic
        const startY = 80;
        const endY = 15; // 아까 설정한 값 유지

        const currentY = startY - ((startY - endY) * progress);
        sliderContainer.style.transform = `translate(-50%, ${currentY}%)`;

        // B. Typography Logic
        let currentTextTop;
        const initialTop = 30;
        const finalTop = -50;   // Moves completely off-screen

        if (progress < 0.3) {
            currentTextTop = initialTop;
        } else {
            const phaseProgress = (progress - 0.3) / 0.7;
            currentTextTop = initialTop - ((initialTop - finalTop) * phaseProgress);
        }

        textOverlay.style.top = `${currentTextTop}%`;

        // *ALL PACKED fades out
        // Removed individual txtTop animation to keep them moving together
        // let opacity = 1 - (progress * 3);
        // if (opacity < 0) opacity = 0;

        // txtTop.style.opacity = opacity;
        // txtTop.style.transform = `translateY(${progress * -20}px)`;

        // C. Slider Logic - Always visible now
        sliderContainer.style.pointerEvents = 'auto';
    }

    // [핵심 변경 2] 이벤트 리스너에 함수 연결
    window.addEventListener('scroll', handleScroll);

    // [핵심 변경 3] 페이지 로드 직후 강제로 한 번 실행! (이게 점프 현상을 막아줍니다)
    handleScroll();


    // 2. Slider Interaction Logic (드래그 기능)
    let isDragging = false;

    function initSlider() {
        sliderHandle.addEventListener('mousedown', startDrag);
        window.addEventListener('mouseup', stopDrag);
        window.addEventListener('mousemove', moveDrag);

        sliderHandle.addEventListener('touchstart', startDrag);
        window.addEventListener('touchend', stopDrag);
        window.addEventListener('touchmove', moveDrag);
    }

    function startDrag(e) {
        isDragging = true;
        sliderContainer.style.cursor = 'ew-resize';
    }

    function stopDrag() {
        isDragging = false;
        sliderContainer.style.cursor = 'default';
    }

    function moveDrag(e) {
        if (!isDragging) return;

        let clientX = e.clientX || e.touches[0].clientX;
        const rect = sliderContainer.getBoundingClientRect();

        let offsetX = clientX - rect.left;

        if (offsetX < 0) offsetX = 0;
        if (offsetX > rect.width) offsetX = rect.width;

        sliderHandle.style.left = `${offsetX}px`;
        carrierWrapper.style.width = `${offsetX}px`;
    }

    initSlider();
});