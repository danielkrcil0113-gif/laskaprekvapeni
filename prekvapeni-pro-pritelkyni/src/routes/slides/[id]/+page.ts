import { error } from '@sveltejs/kit';
import { getSlideById } from '$lib/data';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const slide = getSlideById(params.id);

	if (!slide) {
		throw error(404, 'Slide nebyl nalezen');
	}

	return { slide };
};