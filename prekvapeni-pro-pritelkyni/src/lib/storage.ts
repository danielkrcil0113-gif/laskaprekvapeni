import { browser } from '$app/environment';

const LAST_UNLOCKED_KEY = 'romance-last-unlocked-slide';
const UNLOCKED_SLIDES_KEY = 'romance-unlocked-slides';

export function getUnlockedSlides(): string[] {
	if (!browser) return [];

	const raw = localStorage.getItem(UNLOCKED_SLIDES_KEY);

	if (!raw) return [];

	try {
		const parsed = JSON.parse(raw);

		if (Array.isArray(parsed)) {
			return parsed.filter((value): value is string => typeof value === 'string');
		}

		return [];
	} catch {
		return [];
	}
}

export function getLastUnlockedSlide(): string | null {
	if (!browser) return null;
	return localStorage.getItem(LAST_UNLOCKED_KEY);
}

export function unlockSlide(slideId: string) {
	if (!browser) return;

	const unlocked = getUnlockedSlides();

	if (!unlocked.includes(slideId)) {
		unlocked.push(slideId);
		localStorage.setItem(UNLOCKED_SLIDES_KEY, JSON.stringify(unlocked));
	}

	localStorage.setItem(LAST_UNLOCKED_KEY, slideId);
}

export function isSlideUnlocked(slideId: string): boolean {
	return getUnlockedSlides().includes(slideId);
}

export function clearProgress() {
	if (!browser) return;

	localStorage.removeItem(LAST_UNLOCKED_KEY);
	localStorage.removeItem(UNLOCKED_SLIDES_KEY);
}