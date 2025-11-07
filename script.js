// AI vs Human Therapist Comparison Interface
// Preliminary implementation for CS2790r project

document.addEventListener('DOMContentLoaded', function() {
    console.log('AI Therapy Comparison Interface loaded');

    // Future functionality can be added here:
    // - Dynamic message loading
    // - Interactive highlighting of techniques
    // - Message synchronization between panels
    // - Filtering by therapeutic technique
    // - Export comparison data

    // Sync scroll between AI and Human conversation panels (optional feature)
    const aiPanel = document.querySelector('#ai-panel .chat-container');
    const humanPanel = document.querySelector('#human-panel .chat-container');

    if (aiPanel && humanPanel) {
        let isScrolling = false;

        aiPanel.addEventListener('scroll', function() {
            if (!isScrolling) {
                isScrolling = true;
                humanPanel.scrollTop = aiPanel.scrollTop;
                setTimeout(() => { isScrolling = false; }, 100);
            }
        });

        humanPanel.addEventListener('scroll', function() {
            if (!isScrolling) {
                isScrolling = true;
                aiPanel.scrollTop = humanPanel.scrollTop;
                setTimeout(() => { isScrolling = false; }, 100);
            }
        });
    }

    // Add click handlers for technique tags to highlight corresponding text
    const techniqueTags = document.querySelectorAll('.technique-tag');
    techniqueTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const technique = this.textContent.toLowerCase();
            const highlightClass = `highlight-${technique}`;
            const highlights = document.querySelectorAll(`.${highlightClass}`);

            // Add temporary pulse animation
            highlights.forEach(highlight => {
                highlight.style.animation = 'pulse 0.5s ease-in-out';
                setTimeout(() => {
                    highlight.style.animation = '';
                }, 500);
            });
        });
    });
});

// Add CSS animation for pulse effect
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);
