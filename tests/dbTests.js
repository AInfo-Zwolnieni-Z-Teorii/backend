const categoryModel = require("../src/database/schemas/category");
const userModel = require("../src/database/schemas/user");
const {
	Post: PostModel,
	Introduction: IntroductionModel,
	TextBlock: TextBlockModel,
	ImageBlock: ImageBlockModel,
	ImageTextBlock: ImageTextBlockModel,
	TableOfContents: TableOfContentsModel,
} = require("../src/database/schemas/post");
const generateTableOfContents = require("../src/utils/tableOfContents");

// Basic tests for post, user and category schemas
const createUser = async () => {
	console.log("Creating user");

	// For tests purposes
	const newUser = new userModel({
		username: "dimkainfo",
		email: "ainfoproject2024@gmail.com",
		password: "ainfoprojectzse2024",
		avatar:
			"https://qqpwxxowxij7oyty.public.blob.vercel-storage.com/avatars/adorable-capybaras-wild_23-2151919498-OcGbPYqNAIOnn4xFtCWNulqlc0Pm3z.jpg",
		isAdmin: true,
	});

	try {
		var savedUser = await newUser.save();
		console.log("Nowy użytkownik: ", savedUser);
		return true;
	} catch (err) {
		console.log(err);
		return false;
	}
};

const createCategory = async () => {
	console.log("Creating category");

	const newCategory = new categoryModel({
		name: "Dla Programistów",
		slug: "dla-programistow",
	});

	try {
		const savedCategory = await newCategory.save();
		console.log("Nowa kategoria: ", savedCategory);
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

const createPost = async () => {
	console.log("Creating posts...");

	try {
		// POST 1: AI w edukacji
		const introduction1 = new IntroductionModel({
			header: "AI w edukacji",
			content:
				"Sztuczna inteligencja rewolucjonizuje sposób, w jaki uczniowie zdobywają wiedzę i nauczyciele prowadzą zajęcia. Automatyzacja oceniania, personalizacja nauki i wirtualni asystenci to tylko niektóre z możliwości, jakie oferuje AI w sektorze edukacyjnym.",
		});

		const savedIntroduction1 = await introduction1.save();

		const contentBlock1_1 = new TextBlockModel({
			type: "text",
			data: {
				header: "Spersonalizowane metody nauczania",
				paragraph:
					"Dzięki algorytmom AI możliwe jest dostosowanie tempa i poziomu nauczania do indywidualnych potrzeb ucznia. Systemy oparte na AI analizują wyniki testów, nawyki uczenia się i zainteresowania, aby sugerować najlepsze materiały dydaktyczne. W efekcie uczniowie mogą efektywniej zdobywać wiedzę, a nauczyciele zyskują lepszy wgląd w ich postępy.",
				anchor: "spersonalizowane-metody-nauczania",
			},
		});

		const contentBlock1_2 = new ImageBlockModel({
			type: "image",
			data: {
				src: "ai-education.jpg",
				alt: "Uczeń korzystający z AI w nauce",
			},
		});

		const contentBlock1_3 = new ImageTextBlockModel({
			type: "image-text",
			data: {
				image: {
					src: "ai-virtual-teacher.jpg",
					alt: "Wirtualny nauczyciel wspierający ucznia",
				},
				text: [
					{
						header: "AI jako wirtualny nauczyciel",
						paragraph:
							"Inteligentne chatboty edukacyjne i wirtualni nauczyciele umożliwiają uczniom dostęp do pomocy 24/7. Mogą odpowiadać na pytania, tłumaczyć trudne pojęcia i prowadzić interaktywne lekcje, co znacznie poprawia komfort i skuteczność nauki.",
						anchor: "ai-jako-wirtualny-nauczyciel",
					},
				],
				layout: "right",
			},
		});

		const savedBlock1_1 = await contentBlock1_1.save();
		const savedBlock1_2 = await contentBlock1_2.save();
		const savedBlock1_3 = await contentBlock1_3.save();

		// Generating table of contents
		var generatedTableOfContents = generateTableOfContents([
			savedBlock1_1,
			savedBlock1_2,
			savedBlock1_3,
		]);

		var tableOfContents = new TableOfContentsModel({
			content: generatedTableOfContents,
		});

		var savedTableOfContents = await tableOfContents.save();

		const newPost1 = new PostModel({
			title: "Jak sztuczna inteligencja zmienia edukację?",
			slug: "jak-sztuczna-inteligencja-zmienia-edukacje",
			author: "67975fe8e4a214e75d46ebc7",
			category: ["67975f5305ed19129568fb4e"],
			thumbnailName: "ai-education.jpg",
			introduction: savedIntroduction1._id,
			contentBlocks: [savedBlock1_1._id, savedBlock1_2._id, savedBlock1_3._id],
			tableOfContents: savedTableOfContents._id,
			isMainFeatured: false,
		});

		await newPost1.save();
		console.log("Post 1 zapisany");

		// POST 2: AI w biznesie
		const introduction2 = new IntroductionModel({
			header: "Sztuczna inteligencja w biznesie",
			content:
				"Firmy na całym świecie wdrażają sztuczną inteligencję, aby zwiększać wydajność, redukować koszty i poprawiać obsługę klienta. AI pomaga w analizie danych, automatyzacji procesów oraz personalizacji ofert dla klientów.",
		});

		const savedIntroduction2 = await introduction2.save();

		const contentBlock2_1 = new TextBlockModel({
			type: "text",
			data: {
				header: "Automatyzacja procesów biznesowych",
				paragraph:
					"AI umożliwia firmom automatyzację powtarzalnych zadań, co pozwala pracownikom skupić się na bardziej strategicznych działaniach. Chatboty obsługujące klientów, systemy rekomendacji produktów i analiza Big Data to tylko kilka przykładów wykorzystania AI w firmach.",
				anchor: "automatyzacja-procesow-biznesowych",
			},
		});

		const contentBlock2_2 = new ImageBlockModel({
			type: "image",
			data: {
				src: "ai-business.jpg",
				alt: "AI w analizie danych biznesowych",
			},
		});

		const savedBlock2_1 = await contentBlock2_1.save();
		const savedBlock2_2 = await contentBlock2_2.save();

		// Generating table of contents
		var generatedTableOfContents = generateTableOfContents([
			savedBlock2_1,
			savedBlock2_2,
		]);

		var tableOfContents = new TableOfContentsModel({
			content: generatedTableOfContents,
		});

		var savedTableOfContents = await tableOfContents.save();

		const newPost2 = new PostModel({
			title: "Jak AI rewolucjonizuje biznes?",
			slug: "jak-ai-rewolucjonizuje-biznes",
			author: "67975fe8e4a214e75d46ebc7",
			category: ["67975f5305ed19129568fb4e"],
			thumbnailName: "ai-business.jpg",
			introduction: savedIntroduction2._id,
			contentBlocks: [savedBlock2_1._id, savedBlock2_2._id],
			tableOfContents: savedTableOfContents._id,
			isMainFeatured: false,
		});

		await newPost2.save();
		console.log("Post 2 zapisany");

		// POST 3: AI w motoryzacji
		const introduction3 = new IntroductionModel({
			header: "Sztuczna inteligencja w motoryzacji",
			content:
				"AI napędza rozwój autonomicznych pojazdów, optymalizację ruchu drogowego i poprawę bezpieczeństwa na drogach. Technologia ta zmienia sposób, w jaki podróżujemy i transportujemy towary.",
		});

		const savedIntroduction3 = await introduction3.save();

		const contentBlock3_1 = new ImageBlockModel({
			type: "image",
			data: {
				src: "ai-cars.jpg",
				alt: "Autonomiczne pojazdy napędzane AI",
			},
		});

		const savedBlock3_1 = await contentBlock3_1.save();

		// Generating table of contents
		var generatedTableOfContents = generateTableOfContents([savedBlock3_1]);

		var tableOfContents = new TableOfContentsModel({
			content: generatedTableOfContents,
		});

		var savedTableOfContents = await tableOfContents.save();

		const newPost3 = new PostModel({
			title: "AI w motoryzacji – przyszłość transportu",
			slug: "ai-w-motoryzacji-przyszlosc-transportu",
			author: "67975fe8e4a214e75d46ebc7",
			category: ["67975f76108299c36cf4f903"],
			thumbnailName: "ai-cars.jpg",
			introduction: savedIntroduction3._id,
			contentBlocks: [savedBlock3_1._id],
			tableOfContents: savedTableOfContents._id,
			isMainFeatured: false,
		});

		await newPost3.save();
		console.log("Post 3 zapisany");

		// POST 4: AI w rozrywce
		const introduction4 = new IntroductionModel({
			header: "Sztuczna inteligencja w rozrywce",
			content:
				"AI zmienia branżę rozrywkową poprzez generowanie treści, personalizację rekomendacji oraz wspomaganie twórców w procesie kreatywnym. Dzięki AI powstają filmy, gry i muzyka na niespotykaną dotąd skalę.",
		});

		const savedIntroduction4 = await introduction4.save();

		const contentBlock4_1 = new TextBlockModel({
			type: "text",
			data: {
				header: "Personalizowane rekomendacje treści",
				paragraph:
					"Serwisy streamingowe, takie jak Netflix czy Spotify, wykorzystują AI do przewidywania preferencji użytkowników i dostarczania im najbardziej trafnych propozycji filmów i muzyki.",
				anchor: "personalizowane-rekomendacje",
			},
		});

		const savedBlock4_1 = await contentBlock4_1.save();

		// Generating table of contents
		var generatedTableOfContents = generateTableOfContents([savedBlock4_1]);

		var tableOfContents = new TableOfContentsModel({
			content: generatedTableOfContents,
		});

		var savedTableOfContents = await tableOfContents.save();

		const newPost4 = new PostModel({
			title: "Jak AI zmienia rozrywkę?",
			slug: "jak-ai-zmienia-rozrywke",
			author: "67975fe8e4a214e75d46ebc7",
			category: ["67975f5305ed19129568fb4e"],
			thumbnailName: "ai-entertainment.jpg",
			introduction: savedIntroduction4._id,
			contentBlocks: [savedBlock4_1._id],
			tableOfContents: savedTableOfContents._id,
			isMainFeatured: false,
		});

		await newPost4.save();
		console.log("Post 4 zapisany");

		// POST 5: AI w zdrowiu psychicznym
		const introduction5 = new IntroductionModel({
			header: "AI w zdrowiu psychicznym",
			content:
				"Sztuczna inteligencja wspiera terapie psychologiczne poprzez analizę emocji, chatboty terapeutyczne oraz aplikacje monitorujące stan psychiczny użytkowników.",
		});

		const savedIntroduction5 = await introduction5.save();

		const contentBlock5_1 = new TextBlockModel({
			type: "text",
			data: {
				header: "Chatboty terapeutyczne",
				paragraph:
					"Nowoczesne chatboty, jak Woebot czy Wysa, analizują sposób komunikacji użytkownika, aby dostarczyć mu spersonalizowane porady psychologiczne. To nowa era wsparcia psychicznego, dostępna 24/7.",
				anchor: "chatboty-terapeutyczne",
			},
		});

		const savedBlock5_1 = await contentBlock5_1.save();

		// Generating table of contents
		var generatedTableOfContents = generateTableOfContents([savedBlock5_1]);

		var tableOfContents = new TableOfContentsModel({
			content: generatedTableOfContents,
		});

		var savedTableOfContents = await tableOfContents.save();

		const newPost5 = new PostModel({
			title: "Czy AI może wspierać zdrowie psychiczne?",
			slug: "czy-ai-moze-wspierac-zdrowie-psychiczne",
			author: "67975fe8e4a214e75d46ebc7",
			category: ["67975f5305ed19129568fb4e"],
			thumbnailName: "ai-mental-health.jpg",
			introduction: savedIntroduction5._id,
			contentBlocks: [savedBlock5_1._id],
			tableOfContents: savedTableOfContents._id,
			isMainFeatured: false,
		});

		await newPost5.save();
		console.log("Post 5 zapisany");

		// POST 6: AI w cyberbezpieczeństwie
		const introduction6 = new IntroductionModel({
			header: "AI w cyberbezpieczeństwie",
			content:
				"Sztuczna inteligencja pomaga w wykrywaniu zagrożeń, analizowaniu podejrzanych aktywności i przewidywaniu cyberataków przed ich wystąpieniem.",
		});

		const savedIntroduction6 = await introduction6.save();

		const contentBlock6_1 = new ImageBlockModel({
			type: "image",
			data: {
				src: "ai-cybersecurity.jpg",
				alt: "AI w analizie zagrożeń cybernetycznych",
			},
		});

		const savedBlock6_1 = await contentBlock6_1.save();

		// Generating table of contents
		var generatedTableOfContents = generateTableOfContents([savedBlock6_1]);

		var tableOfContents = new TableOfContentsModel({
			content: generatedTableOfContents,
		});

		var savedTableOfContents = await tableOfContents.save();

		const newPost6 = new PostModel({
			title: "Jak AI chroni nas przed cyberatakami?",
			slug: "jak-ai-chroni-przed-cyberatakami",
			author: "67975fe8e4a214e75d46ebc7",
			category: ["67975f76108299c36cf4f903"],
			thumbnailName: "ai-cybersecurity.jpg",
			introduction: savedIntroduction6._id,
			contentBlocks: [savedBlock6_1._id],
			tableOfContents: savedTableOfContents._id,
			isMainFeatured: false,
		});

		await newPost6.save();
		console.log("Post 6 zapisany");

		// POST 7: AI w sztuce
		const introduction7 = new IntroductionModel({
			header: "Sztuczna inteligencja w sztuce",
			content:
				"AI otwiera nowe możliwości dla artystów, tworząc obrazy, muzykę i poezję na niespotykaną dotąd skalę.",
		});

		const savedIntroduction7 = await introduction7.save();

		const contentBlock7_1 = new ImageTextBlockModel({
			type: "image-text",
			data: {
				image: {
					src: "ai-art.jpg",
					alt: "Obraz wygenerowany przez AI",
				},
				text: [
					{
						header: "AI jako artysta",
						paragraph:
							"Systemy jak DALL·E czy DeepArt pozwalają na generowanie unikalnych dzieł sztuki na podstawie opisów tekstowych, co inspiruje twórców na całym świecie.",
						anchor: "ai-jako-artysta",
					},
				],
				layout: "left",
			},
		});

		const savedBlock7_1 = await contentBlock7_1.save();

		// Generating table of contents
		var generatedTableOfContents = generateTableOfContents([savedBlock7_1]);

		var tableOfContents = new TableOfContentsModel({
			content: generatedTableOfContents,
		});

		var savedTableOfContents = await tableOfContents.save();

		const newPost7 = new PostModel({
			title: "Czy AI może być artystą?",
			slug: "czy-ai-moze-byc-artysta",
			author: "67975fe8e4a214e75d46ebc7",
			category: ["67975f5305ed19129568fb4e"],
			thumbnailName: "ai-art.jpg",
			introduction: savedIntroduction7._id,
			contentBlocks: [savedBlock7_1._id],
			tableOfContents: savedTableOfContents._id,
			isMainFeatured: false,
		});

		await newPost7.save();
		console.log("Post 7 zapisany");

		// POST 8: AI w e-commerce
		const introduction8 = new IntroductionModel({
			header: "Sztuczna inteligencja w e-commerce",
			content:
				"AI pomaga firmom e-commerce personalizować oferty, przewidywać trendy i optymalizować logistykę.",
		});

		const savedIntroduction8 = await introduction8.save();

		const contentBlock8_1 = new TextBlockModel({
			type: "text",
			data: {
				header: "Personalizacja zakupów online",
				paragraph:
					"Systemy AI analizują historię zakupów użytkowników i sugerują produkty, które najlepiej odpowiadają ich preferencjom, zwiększając sprzedaż i satysfakcję klientów.",
				anchor: "personalizacja-zakupow-online",
			},
		});

		const savedBlock8_1 = await contentBlock8_1.save();

		// Generating table of contents
		var generatedTableOfContents = generateTableOfContents([savedBlock8_1]);

		var tableOfContents = new TableOfContentsModel({
			content: generatedTableOfContents,
		});

		var savedTableOfContents = await tableOfContents.save();

		const newPost8 = new PostModel({
			title: "Jak AI zmienia zakupy online?",
			slug: "jak-ai-zmienia-zakupy-online",
			author: "67975fe8e4a214e75d46ebc7",
			category: ["67975f76108299c36cf4f903"],
			thumbnailName: "ai-ecommerce.jpg",
			introduction: savedIntroduction8._id,
			contentBlocks: [savedBlock8_1._id],
			tableOfContents: savedTableOfContents._id,
			isMainFeatured: false,
		});

		await newPost8.save();
		console.log("Post 8 zapisany");

		// POST 9: AI w finansach
		const introduction9 = new IntroductionModel({
			header: "Sztuczna inteligencja w finansach",
			content:
				"Sztuczna inteligencja wspiera zarządzanie finansami, przewidywanie trendów rynkowych i automatyczne doradztwo inwestycyjne.",
		});

		const savedIntroduction9 = await introduction9.save();

		const contentBlock9_1 = new ImageBlockModel({
			type: "image",
			data: {
				src: "ai-finance.jpg",
				alt: "AI w analizie rynków finansowych",
			},
		});

		const savedBlock9_1 = await contentBlock9_1.save();

		// Generating table of contents
		var generatedTableOfContents = generateTableOfContents([savedBlock9_1]);

		var tableOfContents = new TableOfContentsModel({
			content: generatedTableOfContents,
		});

		var savedTableOfContents = await tableOfContents.save();

		const newPost9 = new PostModel({
			title: "Jak AI pomaga w inwestycjach?",
			slug: "jak-ai-pomaga-w-inwestycjach",
			author: "67975fe8e4a214e75d46ebc7",
			category: ["67975f5305ed19129568fb4e"],
			thumbnailName: "ai-finance.jpg",
			introduction: savedIntroduction9._id,
			contentBlocks: [savedBlock9_1._id],
			tableOfContents: savedTableOfContents._id,
			isMainFeatured: false,
		});

		await newPost9.save();
		console.log("Post 9 zapisany");

		// POST 10: AI w komunikacji
		const introduction10 = new IntroductionModel({
			header: "AI w komunikacji",
			content:
				"AI zmienia sposób, w jaki się komunikujemy – od automatycznych tłumaczeń po wirtualnych asystentów wspierających codzienną konwersację.",
		});

		const savedIntroduction10 = await introduction10.save();

		const contentBlock10_1 = new TextBlockModel({
			type: "text",
			data: {
				header: "Automatyczne tłumaczenia AI",
				paragraph:
					"Dzięki narzędziom AI, jak Google Translate czy DeepL, możliwe jest szybkie i dokładne tłumaczenie tekstów na wiele języków, ułatwiając komunikację międzynarodową.",
				anchor: "automatyczne-tlumaczenia-ai",
			},
		});

		const savedBlock10_1 = await contentBlock10_1.save();

		// Generating table of contents
		var generatedTableOfContents = generateTableOfContents([savedBlock10_1]);

		var tableOfContents = new TableOfContentsModel({
			content: generatedTableOfContents,
		});

		var savedTableOfContents = await tableOfContents.save();

		const newPost10 = new PostModel({
			title: "Jak AI ułatwia komunikację?",
			slug: "jak-ai-ulatwia-komunikacje",
			author: "67975fe8e4a214e75d46ebc7",
			category: ["67975f5305ed19129568fb4e"],
			thumbnailName: "ai-communication.jpg",
			introduction: savedIntroduction10._id,
			contentBlocks: [savedBlock10_1._id],
			tableOfContents: savedTableOfContents._id,
			isMainFeatured: false,
		});

		await newPost10.save();
		console.log("Post 10 zapisany");
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

const main = async () => {
	const post = await postModel.findOne().populate("author");
	console.log(post.author.username);
};

const createPostExample = async () => {
	try {
		// Creating introduction
		const introduction5 = new IntroductionModel({
			header: "AI w zdrowiu psychicznym",
			content:
				"Sztuczna inteligencja wspiera terapie psychologiczne poprzez analizę emocji, chatboty terapeutyczne oraz aplikacje monitorujące stan psychiczny użytkowników.",
		});

		const savedIntroduction5 = await introduction5.save();

		// Creating content blocks (can be multiple)
		const contentBlock5_1 = new TextBlockModel({
			type: "text",
			data: {
				header: "Chatboty terapeutyczne",
				paragraph:
					"Nowoczesne chatboty, jak Woebot czy Wysa, analizują sposób komunikacji użytkownika, aby dostarczyć mu spersonalizowane porady psychologiczne. To nowa era wsparcia psychicznego, dostępna 24/7.",
				anchor: "chatboty-terapeutyczne",
			},
		});

		const savedBlock5_1 = await contentBlock5_1.save();

		// Generating table of contents
		const generatedTableOfContents = generateTableOfContents([savedBlock5_1]);

		const tableOfContents = new TableOfContentsModel({
			content: generatedTableOfContents,
		});

		const savedTableOfContents = await tableOfContents.save();

		// Creating final post
		const newPost5 = new PostModel({
			title: "Czy AI może wspierać zdrowie psychiczne?",
			slug: "czy-ai-moze-wspierac-zdrowie-psychiczne",
			author: "67975fe8e4a214e75d46ebc7",
			category: ["67975f5305ed19129568fb4e"],
			thumbnailName: "ai-mental-health.jpg",

			// Referations to other documents (intro, content etc.)
			introduction: savedIntroduction5._id,
			contentBlocks: [savedBlock5_1._id],
			tableOfContents: savedTableOfContents._id,

			isMainFeatured: false,
		});

		await newPost5.save();
		console.log("Post 5 zapisany");
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

const createFakePost = async () => {
	try {
		// Creating introduction
		const introduction5 = new IntroductionModel({
			header: "Sztuczna inteligencja a zdrowie psychiczne",
			content:
				"Sztuczna inteligencja staje się ważnym narzędziem w obszarze zdrowia psychicznego, oferując nowoczesne podejście do terapii i monitorowania samopoczucia.",
		});

		const savedIntroduction5 = await introduction5.save();

		// Creating content blocks (can be multiple)
		const contentBlock5_1 = new TextBlockModel({
			type: "text",
			data: {
				header: "Analiza emocji przez AI",
				paragraph:
					"Sztuczna inteligencja analizuje emocje użytkowników na podstawie ich wypowiedzi, pomagając w identyfikacji problemów i sugerując skuteczne strategie radzenia sobie. Przykłady takich narzędzi to Woebot i Wysa, które oferują spersonalizowane wsparcie 24/7.",
				anchor: "analiza-emocji-przez-ai",
			},
		});

		const savedBlock5_1 = await contentBlock5_1.save();

		// Generating table of contents
		const generatedTableOfContents = generateTableOfContents([savedBlock5_1]);

		const tableOfContents = new TableOfContentsModel({
			content: generatedTableOfContents,
		});

		const savedTableOfContents = await tableOfContents.save();

		// Creating final post
		const newPost5 = new PostModel({
			title: "Sztuczna inteligencja w leczeniu zdrowia psychicznego",
			slug: "ai-w-zdrowiu-psychicznym",
			author: "67975fe8e4a214e75d46ebc7",
			category: ["67975f5305ed19129568fb4e"],
			thumbnailName: "ai-mental-health.jpg",

			// Referations to other documents (intro, content etc.)
			introduction: savedIntroduction5._id,
			contentBlocks: [savedBlock5_1._id],
			tableOfContents: savedTableOfContents._id,

			isMainFeatured: false,
		});

		await newPost5.save();
		console.log("Post 5 zapisany");
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

const deleteTest = async () => {
	try {
		await PostModel.deleteOne({ _id: "679a65d5a17fb03bb4a7eaa7" });
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

module.exports = {
	createCategory,
	createPost,
	createUser,
	createFakePost,
	deleteTest,
};
