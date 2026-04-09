export type Slide = {
	id: string;
	code: string;
	title: string;
	text: string;
	bgClass: string;
	nextHint?: string;
	emoji?: string;
};

export const slides: Slide[] = [
	{
		id: '1',
		code: '28214',
		title: 'Vítej doma, lásko ❤️',
		text: `To nejhezčí na dnešku je to, že jsi zase tady.

A tohle je teprve začátek našeho malého dobrodružství.`,
		bgClass: 'from-rose-100 via-pink-100 to-fuchsia-200',
		nextHint: 'Až přijde další indicie, zadej nový kód níže ✨',
		emoji: '💖'
	},
	{
		id: '2',
		code: '10426',
		title: ' 🌸',
		text: `Ani tato květina nedokáže popsat to jak jsi skvělá

A taky možná, že dostaneš další indicii aby jsi se tady dostala dál. 11426`,
		bgClass: 'from-pink-100 via-rose-100 to-fuchsia-200',
		nextHint: 'A možná i něco co tě tady posune dál 💌',
		emoji: '🌸'
	},
	{
		id: '3',
		code: '11426',
		title: 'Pro tebe, moje lásko 💗',
		text: `Víš, já si občas říkám, kde jsem měl to štěstí tě poznat, kde se to vzalo, že to nejde úplně uchopit. Nejde ani pochopit, kolik citů se ve mně tvoří, když jsem v tvojí přítomnosti.

Jsou občas dny, kdy mám pocit, že ty růžové brýle jsou prostě až moc s nějakým filtrem, ale postupem času chápu, že to filtr není. Že jsi prostě čistá duše, co má svoje rány, který občas způsobí nějakou tu bouřku, ale taky vášeň.

Já úplně nezapomenu na náš první kiss, na to, že jsi mě přijmula jako extrovertního magora, co prostě zkusí všechno bez ohledu na to, kde je a před kým je. Člověka, který ti ukázal jeho citlivý místa, svou citlivost, kde vím, že se můžu s tebou chovat na 100 % jen jako já, DAN.

Nikdo mi vlastně neříká Dáňo, jen ty, a když to slyším, je mi dobře.

Vím, že jsem udělal pár chyb v tom, jak jsi byla pryč. Vím, že to máš občas těžší než s jakýmkoliv klukem, kterého jsi měla, ale jsem tu od toho, abych na určitých věcech zapracoval, vzal tvou ruku do té mé a nepustil tě.

Jsme tu, abychom žili to, co je, a já už vím, že nemusím koukat nikam jinam a jen běžet.

A proto taky...

NEKOUKEJ A BĚŽ PO NAŠICH CESTÁCH A UŽÍVEJME SI TO. A možná zkus poslední kod MILUJUTE

MILUJU TĚ.`,
		bgClass: 'from-rose-200 via-pink-100 to-rose-300',
		nextHint: 'A tohle pořád nemusí být konec... ❤️',
		emoji: '💗'
	},
	{
	id: '4',
	code: 'milujute',
	title: 'A teď poslední věc… ❤️',
	text: `Dnes za tebou přijedu v 18:30.

Buď hezky oblečená, půjdeme na naše místo a užijeme si dnešní den.

Ale je tu malé překvapení, aby to bylo ještě větší dobrodružství…

Zabal si BATŮŽEK a dej si do něj:

 mikinu  
 tepláky  
 něco teplého  
 powerbanku  
 kabely  
 dobrou náladu 😄  
 teplejší ponožky  
 přenosný repráček  
 hezké tričko  

Víc už se nedozvíš…

Protože to necháme jen tak plynout 💫`,
	bgClass: 'from-fuchsia-200 via-rose-200 to-pink-300',
	nextHint: 'Uvidíme se večer ❤️',
	emoji: '✨'
}
];

function normalizeCode(code: string): string {
	return code.replace(/[^0-9a-z]/gi, '').toLowerCase();
}

export function findSlideByCode(code: string): Slide | undefined {
	const normalized = normalizeCode(code);
	return slides.find((slide) => normalizeCode(slide.code) === normalized);
}

export function getSlideById(id: string): Slide | undefined {
	return slides.find((slide) => slide.id === id);
}