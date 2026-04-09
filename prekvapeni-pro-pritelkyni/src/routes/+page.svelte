<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { findSlideByCode } from '$lib/data';
	import { getLastUnlockedSlide, unlockSlide, clearProgress } from '$lib/storage';

	let code = '';
	let error = '';
	let showIntro = true;
	let showCard = false;
	let hasSavedProgress = false;
	let lastUnlockedSlide: string | null = null;

	onMount(() => {
		const hideIntroTimer = setTimeout(() => {
			showIntro = false;
		}, 2200);

		const showCardTimer = setTimeout(() => {
			showCard = true;
		}, 2600);

		lastUnlockedSlide = getLastUnlockedSlide();
		hasSavedProgress = !!lastUnlockedSlide;

		return () => {
			clearTimeout(hideIntroTimer);
			clearTimeout(showCardTimer);
		};
	});

	function handleSubmit() {
		const slide = findSlideByCode(code);

		if (!slide) {
			error = 'Tenhle kód tentokrát nefunguje 💔';
			return;
		}

		error = '';
		unlockSlide(slide.id);
		goto(`/slides/${slide.id}`);
	}

	function continueJourney() {
		if (!lastUnlockedSlide) return;
		goto(`/slides/${lastUnlockedSlide}`);
	}

	function resetProgress() {
		clearProgress();
		hasSavedProgress = false;
		lastUnlockedSlide = null;
		code = '';
		error = '';
	}
</script>

<svelte:head>
	<title>Pro tebe ❤️</title>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<div class="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-300 via-pink-200 to-fuchsia-300">
	<div class="pointer-events-none absolute inset-0 overflow-hidden">
		<div class="absolute left-[8%] top-[10%] text-5xl opacity-25 animate-pulse">💖</div>
		<div class="absolute right-[10%] top-[16%] text-4xl opacity-25 animate-pulse">💕</div>
		<div class="absolute left-[15%] bottom-[20%] text-5xl opacity-20 animate-pulse">❤️</div>
		<div class="absolute right-[18%] bottom-[14%] text-4xl opacity-20 animate-pulse">💗</div>
		<div class="absolute left-[48%] top-[7%] text-2xl opacity-25 animate-pulse">✨</div>
		<div class="absolute right-[32%] top-[30%] text-2xl opacity-20 animate-pulse">✨</div>
	</div>

	<div class="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-10 text-center">
		{#if showIntro}
			<div in:fade={{ duration: 3200 }} class="max-w-2xl">
				<div class="mb-6 text-6xl">💗</div>
				<h1 class="mb-4 text-3xl font-bold leading-tight text-white drop-shadow md:text-4xl">
					Nevěřil bych, že může být pár dnů bez tebe tak dlouhých,
					proto si teď užijeme menší dobrodružství
				</h1>
				<p class="text-white/90 text-base">Mám pro tebe něco hezkého...</p>
			</div>
		{/if}

		{#if showCard}
			<div in:fly={{ y: 30, duration: 800 }} class="mt-8 w-full max-w-sm">
				<div
					in:scale={{ start: 0.94, duration: 800 }}
					class="rounded-[2rem] border border-white/40 bg-white/85 p-6 shadow-2xl backdrop-blur-xl"
				>
					<div class="mb-4 text-5xl">💘</div>

					<h2 class="mb-2 text-2xl font-bold text-rose-700">
						Zadej kód
					</h2>

					<p class="mb-5 text-sm leading-relaxed text-rose-600">
						Až ho zadáš správně, otevře se další část našeho malého dobrodružství.
					</p>

					<form on:submit|preventDefault={handleSubmit} class="space-y-4">
						<input
							bind:value={code}
							type="text"
							inputmode="numeric"
							autocomplete="off"
							placeholder="např. 28214"
							class="w-full rounded-2xl border border-rose-200 bg-white px-4 py-3 text-center text-lg text-rose-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-300"
						/>

						<button
							type="submit"
							class="w-full rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-3 font-semibold text-white shadow-lg transition hover:scale-[1.01] hover:from-rose-600 hover:to-pink-600 active:scale-[0.99]"
						>
							Odemknout ❤️
						</button>
					</form>

					{#if error}
						<p class="mt-4 text-sm text-rose-600">{error}</p>
					{/if}

					{#if hasSavedProgress}
						<div class="mt-6 border-t border-rose-100 pt-5">
							<p class="mb-3 text-sm text-rose-500">
								Malé dobrodružství už je rozehrané ✨
							</p>

							<button
								type="button"
								on:click={continueJourney}
								class="mb-3 w-full rounded-2xl bg-white px-4 py-3 font-semibold text-rose-700 shadow border border-rose-200 transition hover:bg-rose-50"
							>
								Pokračovat 💖
							</button>

							<button
								type="button"
								on:click={resetProgress}
								class="w-full rounded-2xl px-4 py-3 text-sm font-medium text-rose-500 transition hover:bg-rose-50"
							>
								Resetovat testování
							</button>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>