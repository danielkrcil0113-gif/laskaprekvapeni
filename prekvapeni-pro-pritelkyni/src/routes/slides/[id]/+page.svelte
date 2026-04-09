<script lang="ts">
	import type { PageProps } from './$types';
	import { goto } from '$app/navigation';
	import { findSlideByCode } from '$lib/data';
	import { unlockSlide } from '$lib/storage';

	let { data }: PageProps = $props();

	let code = '';
	let errorMessage = '';

	// při otevření slide ho rovnou uložíme
	unlockSlide(data.slide.id);

	function handleNextCode() {
		const nextSlide = findSlideByCode(code);

		if (!nextSlide) {
			errorMessage = 'Tenhle kód zatím nic neotevře 💔';
			return;
		}

		errorMessage = '';
		unlockSlide(nextSlide.id);
		goto(`/slides/${nextSlide.id}`);
	}
</script>

<svelte:head>
	<title>{data.slide.title}</title>
</svelte:head>

<div class={`min-h-screen bg-gradient-to-br ${data.slide.bgClass} flex items-center justify-center p-6`}>
	<div class="w-full max-w-md bg-white/90 p-8 rounded-3xl shadow-2xl text-center">

		<div class="text-5xl mb-4">{data.slide.emoji ?? '💖'}</div>

		<h1 class="text-3xl font-bold text-rose-700 mb-4">
			{data.slide.title}
		</h1>

		<p class="text-lg text-rose-900 whitespace-pre-line">
			{data.slide.text}
		</p>

		{#if data.slide.nextHint}
			<p class="mt-6 text-sm italic text-rose-500">
				{data.slide.nextHint}
			</p>
		{/if}

		<!-- další kód -->
		<div class="mt-8 border-t pt-6">
			<h2 class="mb-2 text-lg font-semibold text-rose-700">
				Máš další kód?
			</h2>

			<form on:submit|preventDefault={handleNextCode} class="space-y-4">
				<input
					bind:value={code}
					type="text"
					placeholder="zadej další kód"
					class="w-full px-4 py-3 rounded-xl border text-center"
				/>

				<button class="w-full bg-rose-500 text-white py-3 rounded-xl">
					Pokračovat ❤️
				</button>
			</form>

			{#if errorMessage}
				<p class="mt-3 text-rose-600">{errorMessage}</p>
			{/if}
		</div>

		<div class="mt-6">
			<a href="/" class="text-sm text-rose-500 underline">
				Zpátky
			</a>
		</div>

	</div>
</div>