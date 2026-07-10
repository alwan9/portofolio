/**
 * CounterUp.js
 * Advanced vanilla JavaScript counter implementation
 * Inspired by the original jquery.counterUp.js
 *
 * No external dependencies
 */
export default class CounterUp {
    /**
     * Creates a new CounterUp instance
     * @param {string|Element|NodeList} selector - CSS selector, DOM element, or NodeList
     * @param {Object} options - Configuration options
     */
    constructor(selector, options = {}) {
        // Default settings
        this.defaults = {
            duration: 800,              // Total animation duration in ms
            easing: 'easeOutExpo',      // Easing function (easeLinear, easeInQuad, easeOutExpo, etc.)
            offset: '0%',               // Offset for IntersectionObserver
            once: false,                // Default changed to false - restart on each scroll into view
            decimals: null,             // Number of decimal places (null = auto-detect)
            separator: ',',             // Thousands separator
            prefix: '',                 // Prefix (e.g., '$')
            suffix: ''                  // Suffix (e.g., '%')
        };

        // Merge user options with defaults
        this.settings = Object.assign({}, this.defaults, options);

        // Easing functions
        this.easingFunctions = {
            easeLinear: t => t,
            easeInQuad: t => t * t,
            easeOutQuad: t => t * (2 - t),
            easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            easeInCubic: t => t * t * t,
            easeOutCubic: t => (--t) * t * t + 1,
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
            easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
        };

        // Handle different selector types
        this.elements = [];
        if (typeof selector === 'string') {
            this.elements = Array.from(document.querySelectorAll(selector));
        } else if (selector instanceof Element) {
            this.elements = [selector];
        } else if (selector instanceof NodeList || Array.isArray(selector)) {
            this.elements = Array.from(selector);
        }

        // Store observers and animation IDs
        this.observers = [];
        this.animations = new Map();

        // Track element visibility state
        this.elementState = new Map();

        // Validate elements
        if (this.elements.length === 0) {
            console.warn('CounterUp: No elements found matching selector');
            return;
        }

        // Initialize observers
        this.init();
    }

    /**
     * Initialize observation of elements
     */
    init() {
        this.elements.forEach(element => {
            // Check for empty content
            const text = element.innerText.trim();
            if (text === '') {
                console.warn('CounterUp: Element is empty:', element);
                return;
            }

            // Store original value and parse number
            const parsedData = this.parseValue(text);
            if (!parsedData) {
                console.warn('CounterUp: Could not parse a valid number from:', text);
                return;
            }

            // Store the parsed data in dataset
            element.dataset.counterupValue = text;
            element.dataset.counterupNumber = parsedData.number;
            element.dataset.counterupDecimals = parsedData.decimals;
            element.dataset.counterupHasCommas = parsedData.hasComma;

            // Initialize element state (not visible initially)
            this.elementState.set(element, false);

            // Create an intersection observer to trigger when element is scrolled into view
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    const currentlyVisible = entry.isIntersecting;
                    const wasVisible = this.elementState.get(element);

                    // Update visibility state
                    this.elementState.set(element, currentlyVisible);

                    // If element became visible (scrolled into view)
                    if (currentlyVisible) {
                        // Always animate when becoming visible
                        this.animate(element);

                        // Disconnect observer if it should only trigger once
                        if (this.settings.once) {
                            observer.disconnect();
                            this.observers = this.observers.filter(obs => obs !== observer);
                        }
                    } else if (wasVisible && !currentlyVisible) {
                        // Element scrolled out of view - cancel animation
                        this.cancelAnimation(element);

                        // Reset to zero for next scroll-in if not in "once" mode
                        if (!this.settings.once) {
                            element.innerText = '0';
                        }
                    }
                });
            }, {
                threshold: 0,
                rootMargin: this.settings.offset + ' 0px'
            });

            // Start observing the element
            observer.observe(element);

            // Store observer reference
            this.observers.push(observer);
        });
    }

    /**
     * Parse value from string
     * @param {string} value - String value to parse
     * @returns {Object|null} - Parsed data or null if invalid
     */
    parseValue(value) {
        if (!value || typeof value !== 'string') return null;

        // Check if value contains commas
        const hasComma = value.includes(this.settings.separator);

        // Remove prefix and suffix if present
        let cleanValue = value;
        if (this.settings.prefix && cleanValue.startsWith(this.settings.prefix)) {
            cleanValue = cleanValue.substring(this.settings.prefix.length);
        }
        if (this.settings.suffix && cleanValue.endsWith(this.settings.suffix)) {
            cleanValue = cleanValue.substring(0, cleanValue.length - this.settings.suffix.length);
        }

        // Remove commas or other separators for calculation
        cleanValue = cleanValue.replace(new RegExp(this.settings.separator, 'g'), '');

        // Try to parse as number - handle different formats
        let number;
        let decimals = 0;

        // Check for exponential notation
        if (/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(cleanValue)) {
            number = parseFloat(cleanValue);

            // Determine decimal places
            const match = cleanValue.match(/\.([0-9]+)/);
            if (match) {
                decimals = match[1].length;
            }
        } else {
            return null; // Invalid number format
        }

        return {
            number,
            decimals: this.settings.decimals !== null ? this.settings.decimals : decimals,
            hasComma
        };
    }

    /**
     * Format number according to settings
     * @param {number} number - Number to format
     * @param {number} decimals - Decimal places
     * @param {boolean} hasComma - Whether to add commas
     * @returns {string} - Formatted number
     */
    formatNumber(number, decimals, hasComma) {
        // Format to fixed decimal places
        let formattedNumber = number.toFixed(decimals);

        // Add commas if needed
        if (hasComma) {
            const parts = formattedNumber.split('.');
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.settings.separator);
            formattedNumber = parts.join('.');
        }

        // Add prefix and suffix
        return this.settings.prefix + formattedNumber + this.settings.suffix;
    }

    /**
     * Animate the counting effect using requestAnimationFrame
     * @param {Element} element - The DOM element to animate
     */
    animate(element) {
        // Cancel any existing animation
        this.cancelAnimation(element);

        // Get stored values
        const targetValue = parseFloat(element.dataset.counterupNumber);
        const decimals = parseInt(element.dataset.counterupDecimals);
        const hasComma = element.dataset.counterupHasCommas === 'true';

        // Validation
        if (isNaN(targetValue) || isNaN(decimals)) {
            console.warn('CounterUp: Invalid values for animation:', element);
            return;
        }

        // Set initial state
        let startValue = 0;
        let startTime = null;
        const duration = this.settings.duration;
        const easingFn = this.easingFunctions[this.settings.easing] || this.easingFunctions.easeOutExpo;

        // Animation function using requestAnimationFrame
        const step = (timestamp) => {
            // Initialize start time on first frame
            if (startTime === null) startTime = timestamp;

            // Calculate progress
            const progress = Math.min(1, (timestamp - startTime) / duration);
            const easedProgress = easingFn(progress);

            // Calculate current value
            const currentValue = startValue + (easedProgress * (targetValue - startValue));

            // Update element
            element.innerText = this.formatNumber(currentValue, decimals, hasComma);

            // Continue animation if not complete
            if (progress < 1) {
                const animId = requestAnimationFrame(step);
                this.animations.set(element, animId);
            } else {
                // Ensure final value is exactly the target
                element.innerText = this.formatNumber(targetValue, decimals, hasComma);
                this.animations.delete(element);
            }
        };

        // Start animation
        const animId = requestAnimationFrame(step);
        this.animations.set(element, animId);
    }

    /**
     * Cancel an ongoing animation
     * @param {Element} element - Element whose animation should be canceled
     */
    cancelAnimation(element) {
        if (this.animations.has(element)) {
            cancelAnimationFrame(this.animations.get(element));
            this.animations.delete(element);
        }
    }

    /**
     * Update configuration options
     * @param {Object} options - New configuration options
     */
    updateOptions(options = {}) {
        this.settings = Object.assign({}, this.settings, options);

        // Re-initialize
        this.reset();
        this.init();
    }

    /**
     * Reset all observers and counters
     */
    reset() {
        // Cancel all animations
        this.animations.forEach((animId, element) => {
            cancelAnimationFrame(animId);
        });
        this.animations.clear();

        // Clear element states
        this.elementState.clear();

        // Disconnect all observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];

        // Reset elements to original values
        this.elements.forEach(element => {
            if (element.dataset.counterupValue) {
                element.innerText = element.dataset.counterupValue;
            }
        });
    }

    /**
     * Manually trigger counting for all elements
     */
    restart() {
        this.reset();
        this.init();
    }

    /**
     * Manually trigger counting for all elements without resetting observers
     */
    replay() {
        this.elements.forEach(element => {
            // Reset to zero first
            element.innerText = '0';
            // Then animate
            this.animate(element);
        });
    }

    /**
     * Clean up resources when instance is no longer needed
     */
    destroy() {
        this.reset();
        this.elements = [];
    }
}

// Usage example:
// const counter = new CounterUp('.counter');
