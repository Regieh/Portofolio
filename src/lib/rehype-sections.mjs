// Lays articles out as a mix of text cards and image galleries:
// - Each top-level heading (the highest level used: h1 or h2) and the content
//   after it becomes <section class="block">. Long sections get "block wide".
// - Images on their own (one or more on consecutive lines) become a
//   <div class="gallery g-N"> between the cards, laid out by how many there are.
// - Text after a gallery with no heading of its own gets a card too.
// - Top-level <hr> dividers are dropped; the cards already separate sections.

const textLength = (node) =>
	node.type === 'text' ? node.value.length : (node.children ?? []).reduce((n, c) => n + textLength(c), 0);

const isEl = (node, tag) => node.type === 'element' && node.tagName === tag;

const isBlank = (node) => node.type === 'text' && !node.value.trim();

// A paragraph that holds only images (and line breaks / whitespace).
const imagesOnly = (node) =>
	isEl(node, 'p') &&
	node.children.some((c) => isEl(c, 'img')) &&
	node.children.every((c) => isEl(c, 'img') || isEl(c, 'br') || isBlank(c));

export default function rehypeSections() {
	return (tree) => {
		const level = tree.children.some((n) => isEl(n, 'h1')) ? 'h1' : 'h2';
		const out = [];
		let section = null;
		let gallery = null;
		let started = false; // past the intro (seen a heading or a gallery)

		const closeSection = () => {
			if (!section) return;
			const content = section.children.filter((c) => !isBlank(c));
			if (content.length === 1) {
				// A heading with nothing but images after it titles the gallery.
				content[0].properties.className = ['gallery-title'];
				out.push(content[0]);
			} else if (content.length) {
				section.properties.className = textLength(section) > 420 ? ['block', 'wide'] : ['block'];
				out.push(section);
			}
			section = null;
		};
		const closeGallery = () => {
			if (!gallery) return;
			const count = gallery.children.length;
			gallery.properties.className = ['gallery', `g-${Math.min(count, 6)}`];
			out.push(gallery);
			gallery = null;
		};

		for (const node of tree.children) {
			if (isEl(node, 'hr')) continue;
			if (imagesOnly(node)) {
				closeSection();
				started = true;
				gallery ??= { type: 'element', tagName: 'div', properties: {}, children: [] };
				gallery.children.push(...node.children.filter((c) => isEl(c, 'img')));
				continue;
			}
			if (isBlank(node)) continue;
			closeGallery();
			if (isEl(node, level)) {
				closeSection();
				started = true;
				section = { type: 'element', tagName: 'section', properties: {}, children: [node] };
			} else if (section) {
				section.children.push(node);
			} else if (!started) {
				// Intro text before the first heading stays as plain text.
				out.push(node);
			} else {
				section = { type: 'element', tagName: 'section', properties: {}, children: [node] };
			}
		}
		closeSection();
		closeGallery();

		// Short cards sit two per row; an odd one out would leave a gap, so it
		// spans the row instead.
		let run = [];
		const flush = () => {
			if (run.length % 2 === 1) run[run.length - 1].properties.className = ['block', 'wide'];
			run = [];
		};
		for (const node of out) {
			const cls = node.properties?.className ?? [];
			if (!cls.includes('block') || cls.includes('wide')) flush();
			else run.push(node);
		}
		flush();

		tree.children = out;
	};
}
