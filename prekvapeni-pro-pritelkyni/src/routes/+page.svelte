<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import { fade, fly, scale } from 'svelte/transition';
    import { findSlideByCode } from '$lib/data';
    import { getLastUnlockedSlide, unlockSlide, clearProgress } from '$lib/storage';

    let code = '';
    let error = '';
    let mounted = false;
    let hasSavedProgress = false;
    let lastUnlockedSlide: string | null = null;

    onMount(() => {
        // Okamžitě po načtení zobrazíme obsah (žádné čekání)
        mounted = true;
        
        lastUnlockedSlide = getLastUnlockedSlide();
        hasSavedProgress = !!lastUnlockedSlide;
    });

    function handleSubmit() {
        const slide = findSlideByCode(code);

        if (!slide) {
            error = 'Tenhle kód tentokrát nefunguje 💔';
            setTimeout(() => error = '', 3500);
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
    <style>
        /* Jemné plovoucí animace pro dekorace na pozadí */
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float {
            animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
            animation: float 5s ease-in-out infinite;
            animation-delay: 1.5s;
        }

        /* Elegantní průhledná karta (Glassmorphism) */
        .glass-card {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.6);
        }
    </style>
</svelte:head>

<div class="relative min-h-screen overflow-hidden bg-gradient-to-br from-rose-300 via-pink-200 to-fuchsia-300 flex flex-col items-center justify-center p-4 sm:p-6">
    
    <!-- Plovoucí dekorace na pozadí -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute left-[8%] top-[10%] text-5xl opacity-30 animate-float">💖</div>
        <div class="absolute right-[10%] top-[16%] text-4xl opacity-30 animate-float-delayed">💕</div>
        <div class="absolute left-[15%] bottom-[20%] text-5xl opacity-25 animate-float" style="animation-delay: 1s">❤️</div>
        <div class="absolute right-[18%] bottom-[14%] text-4xl opacity-25 animate-float-delayed" style="animation-delay: 0.5s">💗</div>
        <div class="absolute left-[48%] top-[7%] text-3xl opacity-30 animate-float">✨</div>
        <div class="absolute right-[32%] top-[30%] text-3xl opacity-25 animate-float-delayed">✨</div>
    </div>

    {#if mounted}
        <!-- Úvodní vzkaz, který rovnou zůstává nad kartou -->
        <div in:fade={{ duration: 1200 }} class="relative z-10 max-w-2xl text-center mb-8 px-4">
            <div class="mb-4 text-5xl inline-block drop-shadow-md">💗</div>
            <h1 class="mb-2 text-2xl sm:text-3xl font-extrabold leading-tight text-rose-900 drop-shadow-sm">
                Nevěřil bych, že může být pár dnů bez tebe tak dlouhých...
            </h1>
            <p class="text-rose-800/90 text-base sm:text-lg font-medium">Proto si teď užijeme menší dobrodružství.</p>
        </div>

        <!-- Přihlašovací karta -->
        <div 
            in:fly={{ y: 40, duration: 1000, delay: 300 }}
            class="relative z-10 w-full max-w-sm glass-card p-8 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(225,29,72,0.3)] text-center"
        >
            <div class="mb-4 text-5xl inline-block drop-shadow-sm" in:scale={{ start: 0.5, duration: 800, delay: 500 }}>💘</div>

            <h2 class="mb-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-pink-600">
                Mám pro tebe něco hezkého
            </h2>

            <p class="mb-8 text-sm leading-relaxed text-rose-600 font-medium">
                Až zadáš kód správně, otevře se další část.
            </p>

            <form on:submit|preventDefault={handleSubmit} class="space-y-4">
                <div class="relative">
                    <input
                        bind:value={code}
                        type="text"
                        inputmode="numeric"
                        autocomplete="off"
                        placeholder="Např. 28214"
                        class="w-full rounded-2xl border-2 border-rose-100 bg-white/70 px-5 py-4 text-center text-lg font-semibold text-rose-800 outline-none transition-all focus:border-rose-400 focus:bg-white shadow-inner placeholder-rose-300"
                    />
                </div>

                <button
                    type="submit"
                    class="w-full rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 px-5 py-4 font-bold text-white shadow-[0_8px_20px_-6px_rgba(225,29,72,0.5)] transition-all hover:scale-[1.02] hover:from-rose-600 hover:to-pink-600 active:scale-[0.98] flex items-center justify-center gap-2 group"
                >
                    <span class="tracking-wide">Odemknout</span>
                    <span class="group-hover:translate-x-1 group-hover:scale-110 transition-transform">❤️</span>
                </button>
            </form>

            {#if error}
                <p in:fade class="mt-4 text-sm font-semibold text-rose-600 bg-red-50 py-2 px-4 rounded-xl border border-red-100 shadow-sm">
                    {error}
                </p>
            {/if}

            {#if hasSavedProgress}
                <div class="mt-8 border-t border-rose-200/60 pt-6" in:fade={{ delay: 800 }}>
                    <p class="mb-4 text-xs font-bold tracking-widest uppercase text-rose-400">
                        Dobrodružství je rozehrané ✨
                    </p>

                    <button
                        type="button"
                        on:click={continueJourney}
                        class="mb-3 w-full rounded-2xl bg-white/80 px-4 py-3.5 font-bold text-rose-700 shadow-sm border border-rose-100 transition-all hover:bg-white hover:border-rose-300 active:scale-95"
                    >
                        Pokračovat tam, kde jsi skončila 💖
                    </button>

                    <button
                        type="button"
                        on:click={resetProgress}
                        class="w-full rounded-2xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-rose-400 transition-colors hover:text-rose-600"
                    >
                        Resetovat testování
                    </button>
                </div>
            {/if}
        </div>
    {/if}
</div>
