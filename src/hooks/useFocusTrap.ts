import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_ELEMENTS = [
	'a[href]',
	'button:not([disabled])',
	'textarea:not([disabled])',
	'input:not([disabled]):not([type="hidden"])',
	'select:not([disabled])',
	'[tabindex]:not([tabindex="-1"])',
].join(',');

export type UseFocusTrapArgs = {
	active: boolean;
	onClose: () => void;
	containerRef: RefObject<HTMLElement | null>;
};

export function useFocusTrap({ active, onClose, containerRef }: UseFocusTrapArgs): void {
	const previousFocusElement = useRef<HTMLElement | null>(null);

	useEffect(() => {
		if (!active) return;

		const container = containerRef.current;
		if (!container) return;

		previousFocusElement.current = document.activeElement as HTMLElement | null;
		const focusableElems = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS));

		const autofocus = container.querySelector<HTMLElement>('[autofocus]');
		const firstFocusable = focusableElems[0];
		if (autofocus) {
			autofocus.focus();
		} else if (firstFocusable) {
			firstFocusable.focus();
		} else {
			container.setAttribute('tabindex', '-1');
			container.focus();
		}

		const handleKeyDown = (e: KeyboardEvent): void => {
			if (!container) return;
			switch (e.key) {
				case 'Escape': {
					e.stopPropagation();
					onClose();
					return;
				}
				case 'Tab':
					break;
				default:
					return;
			}

			const focusables = focusableElems.filter((elem) => elem.offsetParent !== null);
			if (focusables.length === 0) {
				e.preventDefault();
				container.focus();
				return;
			}

			const firstElem = focusables[0];
			const lastElem = focusables[focusables.length - 1];

			if (e.shiftKey) {
				if (document.activeElement === firstElem && lastElem) {
					e.preventDefault();
					lastElem.focus();
				}
			} else {
				if (document.activeElement === lastElem && firstElem) {
					e.preventDefault();
					firstElem.focus();
				}
			}
		};

		container.addEventListener('keydown', handleKeyDown);

		return () => {
			container.removeEventListener('keydown', handleKeyDown);
			container.removeAttribute('tabindex');
			const trigger = previousFocusElement.current;
			if (trigger && typeof trigger.focus === 'function') {
				trigger.focus();
			}
			previousFocusElement.current = null;
		};
	}, [active, onClose, containerRef]);
}
