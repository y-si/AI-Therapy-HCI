// AI vs Human Therapist Comparison Interface
// Preliminary implementation for CS2790r project

document.addEventListener('DOMContentLoaded', function() {
    console.log('AI Therapy Comparison Interface loaded');

    // ========== Menu Toggle ==========
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const sessionItems = document.querySelectorAll('.session-item');

    function openMenu() {
        menuToggle.classList.add('active');
        sideMenu.classList.add('open');
        menuOverlay.classList.add('visible');
    }

    function closeMenu() {
        menuToggle.classList.remove('active');
        sideMenu.classList.remove('open');
        menuOverlay.classList.remove('visible');
    }

    menuToggle.addEventListener('click', function() {
        if (sideMenu.classList.contains('open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    menuOverlay.addEventListener('click', closeMenu);

    // ========== Add Session Modal ==========
    const addSessionBtn = document.getElementById('add-session-btn');
    const modal = document.getElementById('add-session-modal');
    const modalClose = document.getElementById('modal-close');
    const modalCancel = document.getElementById('modal-cancel');
    const modalSubmit = document.getElementById('modal-submit');
    const dropzones = document.querySelectorAll('.upload-dropzone');

    function openModal() {
        modal.classList.add('visible');
        closeMenu();
    }

    function closeModal() {
        modal.classList.remove('visible');
    }

    addSessionBtn.addEventListener('click', openModal);
    modalClose.addEventListener('click', closeModal);
    modalCancel.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Placeholder for submit - just close the modal
    modalSubmit.addEventListener('click', function() {
        alert('Session creation functionality coming soon!');
        closeModal();
    });

    // Add dragover effects to dropzones
    dropzones.forEach(dropzone => {
        dropzone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });

        dropzone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });

        dropzone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            // Placeholder - just show the file name
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const textEl = this.querySelector('.dropzone-text');
                textEl.textContent = files[0].name;
            }
        });
    });

    // Handle session switching
    sessionItems.forEach(item => {
        item.addEventListener('click', function() {
            const sessionId = this.dataset.session;

            // Update active state in menu
            sessionItems.forEach(s => s.classList.remove('active'));
            this.classList.add('active');

            // Load session data (placeholder for now)
            loadSession(sessionId);

            // Close menu
            closeMenu();
        });
    });

    function loadSession(sessionId) {
        console.log(`Loading session: ${sessionId}`);

        // Hide all session content
        const allSessionContent = document.querySelectorAll('.session-content');
        allSessionContent.forEach(content => {
            content.classList.add('hidden');
        });

        // Show selected session content
        const selectedContent = document.querySelectorAll(`.session-content[data-session="${sessionId}"]`);
        selectedContent.forEach(content => {
            content.classList.remove('hidden');
        });

        // Reset selections when switching sessions
        resetSelections();

        // Re-initialize click handlers for the new session's messages
        initClickableMessages();
    }

    // ========== Comparison Panel Logic ==========
    const emptyState = document.getElementById('empty-state');
    let selectedAI = null;
    let selectedHuman = null;
    let activeStrategy = null;

    function initClickableMessages() {
        const clickableMessages = document.querySelectorAll('.message.clickable');

        clickableMessages.forEach(message => {
            // Remove existing listeners by cloning
            const newMessage = message.cloneNode(true);
            message.parentNode.replaceChild(newMessage, message);

            newMessage.addEventListener('click', function() {
                const responseId = this.dataset.responseId;
                // Check if it's an AI response (contains 'ai-' but not 'human-')
                const isAI = responseId.includes('ai-');
                const isHuman = responseId.includes('human-');

                // Handle AI panel selection
                if (isAI) {
                    if (selectedAI === responseId) {
                        this.classList.remove('selected');
                        selectedAI = null;
                    } else {
                        if (selectedAI) {
                            const prevSelected = document.querySelector(`.message[data-response-id="${selectedAI}"]`);
                            if (prevSelected) prevSelected.classList.remove('selected');
                        }
                        this.classList.add('selected');
                        selectedAI = responseId;
                    }
                }

                // Handle Human panel selection
                if (isHuman) {
                    if (selectedHuman === responseId) {
                        this.classList.remove('selected');
                        selectedHuman = null;
                    } else {
                        if (selectedHuman) {
                            const prevSelected = document.querySelector(`.message[data-response-id="${selectedHuman}"]`);
                            if (prevSelected) prevSelected.classList.remove('selected');
                        }
                        this.classList.add('selected');
                        selectedHuman = responseId;
                    }
                }

                updateComparisonPanel();
                // Clear highlights when changing selected messages
                clearAllHighlights();
            });
        });
    }

    function clearAllHighlights() {
        // Remove active state from all tags
        const allTags = document.querySelectorAll('.technique-tag.clickable-tag');
        allTags.forEach(t => t.classList.remove('active'));

        // Remove all highlight classes from all segments
        const allSegments = document.querySelectorAll('.text-segment');
        allSegments.forEach(s => {
            s.className = 'text-segment'; // Reset to base class
        });

        activeStrategy = null;
    }

    function updateComparisonPanel() {
        const comparisonSections = document.querySelectorAll('.comparison-section');

        // Hide all comparison sections first
        comparisonSections.forEach(section => {
            section.classList.add('hidden');
        });

        // Show selected sections
        const hasSelection = selectedAI || selectedHuman;

        if (hasSelection) {
            emptyState.classList.add('hidden');

            if (selectedAI) {
                const aiSection = document.querySelector(`.comparison-section[data-response-id="${selectedAI}"]`);
                if (aiSection) aiSection.classList.remove('hidden');
            }

            if (selectedHuman) {
                const humanSection = document.querySelector(`.comparison-section[data-response-id="${selectedHuman}"]`);
                if (humanSection) humanSection.classList.remove('hidden');
            }
        } else {
            emptyState.classList.remove('hidden');
        }
    }

    function resetSelections() {
        // Clear all selections
        if (selectedAI) {
            const prevAI = document.querySelector(`.message[data-response-id="${selectedAI}"]`);
            if (prevAI) prevAI.classList.remove('selected');
        }
        if (selectedHuman) {
            const prevHuman = document.querySelector(`.message[data-response-id="${selectedHuman}"]`);
            if (prevHuman) prevHuman.classList.remove('selected');
        }

        selectedAI = null;
        selectedHuman = null;
        updateComparisonPanel();
    }

    // Initialize clickable messages
    initClickableMessages();

    // ========== Tag Click Highlighting ==========
    function highlightStrategy(strategy) {
        // First clear all existing highlights
        clearAllHighlights();

        // Set active strategy
        activeStrategy = strategy;

        // Activate all tags with this strategy across all visible comparison items
        const allTags = document.querySelectorAll(`.technique-tag.clickable-tag[data-strategy="${strategy}"]`);
        allTags.forEach(tag => {
            // Only activate if the tag's comparison section is visible
            const section = tag.closest('.comparison-section');
            if (section && !section.classList.contains('hidden')) {
                tag.classList.add('active');
            }
        });

        // Highlight all text segments that contain this strategy across all visible responses
        const allSegments = document.querySelectorAll('.text-segment');
        allSegments.forEach(segment => {
            // Only highlight if the segment's comparison section is visible
            const section = segment.closest('.comparison-section');
            if (section && !section.classList.contains('hidden')) {
                const strategies = segment.dataset.strategies || '';
                if (strategies.split(',').includes(strategy)) {
                    segment.classList.add(`highlighted-${strategy}`);
                }
            }
        });
    }

    function initTagClickHandlers() {
        const clickableTags = document.querySelectorAll('.technique-tag.clickable-tag');

        clickableTags.forEach(tag => {
            // Remove existing listeners by cloning
            const newTag = tag.cloneNode(true);
            tag.parentNode.replaceChild(newTag, tag);

            newTag.addEventListener('click', function(e) {
                e.stopPropagation();
                const strategy = this.dataset.strategy;

                // Check if this strategy is already active
                if (activeStrategy === strategy) {
                    // Deselect - clear all highlights
                    clearAllHighlights();
                } else {
                    // Select new strategy
                    highlightStrategy(strategy);
                }
            });
        });
    }

    // Initialize tag click handlers
    initTagClickHandlers();

    // Re-initialize tag handlers when session changes
    const originalLoadSession = loadSession;
    loadSession = function(sessionId) {
        originalLoadSession(sessionId);
        initTagClickHandlers();
    };

    // ========== Scroll Sync ==========
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
