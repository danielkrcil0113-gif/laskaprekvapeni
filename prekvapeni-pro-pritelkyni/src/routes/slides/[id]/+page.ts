import { getSlideById } from '$lib/data';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    // SvelteKit z URL /slides/1 vezme "1" a vloží to do params.id
    const slide = getSlideById(params.id);

    // Pokud slide neexistuje (např. někdo zadá špatnou URL), vyhodíme úhlednou 404 chybu
    if (!slide) {
        error(404, { message: 'Tento krok jsme nenašli 💔' });
    }

    // Vrátíme nalezený slide – ten se pak automaticky propíše do `data.slide` ve +page.svelte
    return {
        slide
    };
};