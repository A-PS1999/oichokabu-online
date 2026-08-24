import { useEffect, useRef } from "react";

const FOCUSABLE_ELEMENTS = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(",");

export function useFocusTrap({ active, onClose, containerRef }) {
    const previousFocusElement = useRef(null);

    useEffect(() => {
        if (!active) return;

        const container = containerRef.current;
        if (!container) return;

        previousFocusElement.current = document.activeElement;
        const focusableElems = container.querySelectorAll(FOCUSABLE_ELEMENTS);

        const autofocus = container.querySelector('[autofocus]');
        if (autofocus) {
            autofocus.focus();
        } else if (focusableElems.length > 0) {
            focusableElems[0].focus();
        } else {
            container.setAttribute('tabindex', '-1');
            container.focus();
        }

        const handleKeyDown = (e) => {
            if (!container) return;
            switch (e.key) {
                case 'Escape': {
                    e.stopPropagation();
                    onClose();
                    return;
                }
                case 'Tab': break;
                default: return;
            }

            const focusables = Array.from(focusableElems).filter(elem => elem.offsetParent !== null);
            if (focusables.length === 0) {
                e.preventDefault();
                container.focus();
                return;
            }

            const firstElem = focusables[0];
            const lastElem = focusables[focusables.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElem) {
                    e.preventDefault();
                    lastElem.focus();
                }
            } else {
                if (document.activeElement === lastElem) {
                    e.preventDefault();
                    firstElem.focus();
                }
            }
        }

        container.addEventListener('keydown', handleKeyDown);

        return () => {
            container.removeEventListener('keydown', handleKeyDown);
            container.removeAttribute('tabindex');
            const trigger = previousFocusElement.current;
            if (trigger && typeof trigger.focus === 'function') {
                trigger.focus();
            }
            previousFocusElement.current = null;
        }
    }, [active, onClose, containerRef]);
}