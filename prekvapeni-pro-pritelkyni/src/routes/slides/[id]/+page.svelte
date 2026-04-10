<script lang="ts">
    import type { PageProps } from './$types';
    import { goto } from '$app/navigation';
    import { findSlideByCode } from '$lib/data';
    import { unlockSlide } from '$lib/storage';
    import { onMount } from 'svelte';
    import { fade, fly, scale } from 'svelte/transition';

    let { data }: PageProps = $props();

    let code = $state('');
    let errorMessage = $state('');
    let mounted = $state(false);
    
    // --- PROMĚNNÁ PRO POSLEDNÍ SLAJD ---
    let finalMessageShown = $state(false);

    // --- PROMĚNNÉ PRO MINIGHRU ---
    let score = $state(0);
    let gameWon = $state(false);
    let activeFoods = $state<{id: number, emoji: string, top: number, left: number}[]>([]);
    let foodInterval: ReturnType<typeof setInterval>;

    // Funkce na chytání jídla v minihře
    function catchFood(id: number) {
        activeFoods = activeFoods.filter(f => f.id !== id);
        score++;
        if (score >= 5) {
            clearInterval(foodInterval);
            gameWon = true;
            activeFoods = []; // Vyčistit zbytek jídla
        }
    }

    $effect(() => {
        if (data?.slide) {
            unlockSlide(data.slide.id);
            finalMessageShown = false; // Resetovat pro jistotu při změně slajdu

            // Logika minihry pro slajd číslo 2
            if (data.slide.id === '2') {
                score = 0;
                gameWon = false;
                activeFoods = [];
                let idCounter = 0;
                // Dobroty pro ovečku!
                const foodEmojis = ['🌿', '🍀', '🍎', '🥕', '🌾', '🥬'];

                foodInterval = setInterval(() => {
                    if (activeFoods.length < 5) { // Na obrazovce max 5 kousků najednou
                        activeFoods = [...activeFoods, {
                            id: idCounter++,
                            emoji: foodEmojis[Math.floor(Math.random() * foodEmojis.length)],
                            top: 15 + Math.random() * 60, // Náhodná pozice vertikálně (15% - 75%)
                            left: 10 + Math.random() * 70, // Náhodná pozice horizontálně (10% - 80%)
                        }];
                    }
                }, 850); // Každých 850ms se objeví nové jídlo
            } else {
                clearInterval(foodInterval);
            }
        }

        // Úklid po odchodu ze slajdu
        return () => {
            if (foodInterval) clearInterval(foodInterval);
        };
    });

    onMount(() => {
        mounted = true;
    });

    // Přidali jsme parametr event typu Event, abychom mohli zastavit výchozí chování
    function handleNextCode(event: Event) {
        event.preventDefault();
        
        const nextSlide = findSlideByCode(code);

        if (!nextSlide) {
            errorMessage = 'Tenhle kód zatím nic neotevře 💔';
            setTimeout(() => errorMessage = '', 3500);
            return;
        }

        errorMessage = '';
        code = '';
        goto(`/slides/${nextSlide.id}`);
    }
</script>

<svelte:head>
    <title>{data.slide.title}</title>
    <style>
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-delayed { animation: float 5s ease-in-out infinite; animation-delay: 1.5s; }
        
        @keyframes pulse-soft {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
        }
        .animate-pulse-soft { animation: pulse-soft 2.5s ease-in-out infinite; }

        .glass-card {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.6);
        }
    </style>
</svelte:head>

<div class={`min-h-screen bg-gradient-to-br ${data.slide.bgClass} flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden transition-colors duration-1000`}>
    
    <!-- Levitující dekorace na pozadí -->
    <div class="absolute top-10 left-10 text-4xl opacity-20 animate-float pointer-events-none">✨</div>
    <div class="absolute bottom-20 right-10 text-5xl opacity-20 animate-float-delayed pointer-events-none">💖</div>
    <div class="absolute top-1/4 right-16 text-3xl opacity-20 animate-float pointer-events-none" style="animation-delay: 1s">🌸</div>
    <div class="absolute bottom-1/3 left-12 text-4xl opacity-20 animate-float-delayed pointer-events-none" style="animation-delay: 0.5s">💌</div>

    {#if mounted}
        {#key data.slide.id}
            <div 
                in:fly={{ y: 30, duration: 800 }}
                class="w-full max-w-lg glass-card p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(225,29,72,0.25)] text-center relative z-10"
            >
                
                <div 
                    in:scale={{ start: 0.5, duration: 800, delay: 200 }} 
                    class="text-6xl sm:text-7xl mb-6 inline-block animate-pulse-soft drop-shadow-md"
                >
                    {data.slide.emoji ?? '💖'}
                </div>

                <h1 
                    in:fade={{ duration: 800, delay: 400 }} 
                    class="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-500 mb-6 drop-shadow-sm leading-tight"
                >
                    {data.slide.title}
                </h1>

                <div 
                    in:fade={{ duration: 800, delay: 600 }} 
                    class="text-base sm:text-lg text-rose-900/90 whitespace-pre-line leading-relaxed font-medium"
                >
                    {data.slide.text}
                </div>

                <!-- MINIHRA PRO SLAJD 2 -->
                {#if data.slide.id === '2'}
                    <div in:fade={{ delay: 800 }} class="mt-8 p-6 bg-white/60 rounded-[2rem] border border-rose-200 shadow-inner relative h-64 overflow-hidden">
                        {#if !gameWon}
                            <!-- Během hry -->
                            <div class="text-center relative z-10 pointer-events-none">
                                <p class="text-rose-800 font-bold text-lg mb-1">Nakrm ovečku! 🐑</p>
                                <p class="text-sm font-semibold text-rose-500 bg-white/80 inline-block px-3 py-1 rounded-full shadow-sm">
                                    Chyť 5 dobrot ({score}/5)
                                </p>
                            </div>
                            
                            <!-- Stín ovečky v pozadí hry -->
                            <div class="absolute inset-0 flex items-center justify-center text-[7rem] opacity-20 pointer-events-none">
                                🐑
                            </div>

                            <!-- Padající mňamky -->
                            {#each activeFoods as food (food.id)}
                                <button
                                    class="absolute text-4xl cursor-pointer hover:scale-125 active:scale-90 transition-transform drop-shadow-md"
                                    style="top: {food.top}%; left: {food.left}%;"
                                    onclick={() => catchFood(food.id)}
                                    in:scale={{ start: 0.2, duration: 400 }}
                                    out:scale={{ start: 1.5, duration: 200, opacity: 0 }}
                                >
                                    {food.emoji}
                                </button>
                            {/each}
                        {:else}
                            <!-- Po vyhrání -->
                            <div class="h-full flex flex-col items-center justify-center text-center" in:scale>
                                <div class="text-6xl mb-3 animate-bounce">🐑</div>
                                <p class="text-xl font-bold text-rose-700 mb-2">Bééé, to byla dobrota!</p>
                                <p class="text-sm text-rose-600 font-medium mb-1">Ovečka je plná a za odměnu ti prozradí kód:</p>
                                <p class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500 mt-2 drop-shadow-md tracking-widest">
                                    11426
                                </p>
                            </div>
                        {/if}
                    </div>
                {/if}

                <!-- SPECIÁLNÍ ZAKONČENÍ PRO POSLEDNÍ SLAJD (ID 4) -->
                {#if data.slide.id === '4'}
                    <div in:fade={{ duration: 800, delay: 1000 }} class="mt-10 pt-8 border-t border-rose-200/60 relative">
                        {#if !finalMessageShown}
                            <button 
                                onclick={() => finalMessageShown = true}
                                class="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-95 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_8px_20px_-6px_rgba(225,29,72,0.5)] flex items-center justify-center gap-2 group"
                            >
                                <span class="tracking-wide">Pokračovat v dobrodružství</span>
                                <span class="group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300">✨</span>
                            </button>
                        {:else}
                            <div in:scale={{ duration: 500 }} class="p-6 bg-white/70 rounded-[2rem] border border-rose-200 shadow-sm text-center">
                                <div class="text-4xl mb-3 animate-pulse-soft">💖💕💗</div>
                                <p class="text-lg font-bold text-rose-700 leading-relaxed">
                                    Toto jsi úspěšně zvládla, pokračování bude večer, vždycky hledej kolem sebe kartičky, které ti napoví možná další naší cestu 💗💖💕
                                </p>
                            </div>
                        {/if}
                    </div>

                <!-- SCHOVÁME FORMULÁŘ NA SLAJDU 2, DOKUD NEVYHRAJE HRU A NEZOBRAZUJEME HO NA SLAJDU 4 -->
                {:else if data.slide.id !== '2' || gameWon}
                    {#if data.slide.nextHint}
                        <div in:fade={{ duration: 800, delay: 800 }}>
                            <p class="mt-8 text-sm font-semibold italic text-rose-500 bg-rose-50/70 py-2.5 px-5 rounded-full inline-block shadow-inner border border-rose-100">
                                {data.slide.nextHint}
                            </p>
                        </div>

                        <!-- Formulář na další kód s opraveným zápisem onsubmit -->
                        <div 
                            in:fade={{ duration: 800, delay: 1000 }} 
                            class="mt-10 pt-8 border-t border-rose-200/60 relative"
                        >
                            <h2 class="mb-4 text-xs font-bold tracking-widest uppercase text-rose-400">
                                Zadej odhalený kód
                            </h2>

                            <form onsubmit={handleNextCode} class="space-y-4">
                                <div class="relative">
                                    <input
                                        bind:value={code}
                                        type="text"
                                        inputmode="text"
                                        autocomplete="off"
                                        placeholder="Zadej tajemný kód..."
                                        class="w-full px-5 py-4 rounded-2xl border-2 border-rose-100 bg-white/60 text-rose-800 placeholder-rose-300 text-center text-lg font-semibold focus:outline-none focus:border-rose-400 focus:bg-white transition-all shadow-inner"
                                    />
                                </div>

                                <button type="submit" class="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-95 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_8px_20px_-6px_rgba(225,29,72,0.5)] flex items-center justify-center gap-2 group">
                                    <span class="tracking-wide">Pokračovat</span>
                                    <span class="group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300">❤️</span>
                                </button>
                            </form>

                            {#if errorMessage}
                                <p in:fade class="mt-4 text-sm font-semibold text-rose-600 bg-red-50 py-2 px-4 rounded-xl border border-red-100 shadow-sm">
                                    {errorMessage}
                                </p>
                            {/if}
                        </div>
                    {/if}
                {/if}

                <div class="mt-8">
                    <a href="/" class="text-xs font-bold text-rose-400 hover:text-rose-600 transition-colors uppercase tracking-wider flex items-center justify-center gap-1 group">
                        <span class="group-hover:-translate-x-1 transition-transform">←</span> Zpátky na začátek
                    </a>
                </div>

            </div>
        {/key}
    {/if}
</div>
