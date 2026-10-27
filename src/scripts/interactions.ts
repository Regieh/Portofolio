// Apple-style interactions shared across pages:
// - [data-tilt]: tvOS-like 3D tilt with a moving glare. Exposes --px/--py
//   (-0.5..0.5) so layers inside can shift for a parallax effect.
// - [data-reveal]: fades/slides in when scrolled into view.
// - [data-timeline]: fills the progress line as you scroll and marks entries
//   the line has reached with .reached (they turn from grey to color).
// - [data-object]: rotates the striped 3D object with scroll (inside its
//   [data-object-scroll] section) and the pointer, eased every frame.
// - [data-lightbox]: links open their image (or video, with ="video") in a zoomed dialog.

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

function initTilt() {
	if (reducedMotion || !finePointer) return;
	document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
		const max = Number(card.dataset.tilt) || 8;
		card.addEventListener('pointermove', (e) => {
			const rect = card.getBoundingClientRect();
			const x = (e.clientX - rect.left) / rect.width;
			const y = (e.clientY - rect.top) / rect.height;
			card.style.setProperty('--rx', `${(0.5 - y) * max}deg`);
			card.style.setProperty('--ry', `${(x - 0.5) * max}deg`);
			card.style.setProperty('--gx', `${x * 100}%`);
			card.style.setProperty('--gy', `${y * 100}%`);
			card.style.setProperty('--px', `${x - 0.5}`);
			card.style.setProperty('--py', `${y - 0.5}`);
			card.classList.add('is-tilting');
		});
		card.addEventListener('pointerleave', () => {
			card.style.setProperty('--rx', '0deg');
			card.style.setProperty('--ry', '0deg');
			card.style.setProperty('--px', '0');
			card.style.setProperty('--py', '0');
			card.classList.remove('is-tilting');
		});
	});
}

function initReveal() {
	const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
	if (reducedMotion || !('IntersectionObserver' in window)) {
		items.forEach((el) => el.classList.add('is-visible'));
		return;
	}
	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				entry.target.classList.add('is-visible');
				observer.unobserve(entry.target);
			});
		},
		{ rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
	);
	items.forEach((el) => observer.observe(el));
}

function initLightbox() {
	const links = document.querySelectorAll<HTMLAnchorElement>('[data-lightbox]');
	if (!links.length) return;

	const dialog = document.createElement('dialog');
	dialog.className = 'lightbox';
	// Lucide "x" icon
	const closeIcon =
		'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
	dialog.innerHTML = `<figure><img alt="" /><video controls playsinline loop></video><figcaption></figcaption></figure><button type="button" aria-label="Close">${closeIcon}</button>`;
	document.body.append(dialog);
	const img = dialog.querySelector('img')!;
	const video = dialog.querySelector('video')!;
	const caption = dialog.querySelector('figcaption')!;

	const close = () => {
		dialog.classList.remove('is-open');
		video.pause();
		setTimeout(() => dialog.close(), reducedMotion ? 0 : 250);
	};
	dialog.addEventListener('click', close);
	// Let people use the video controls without closing the dialog.
	video.addEventListener('click', (e) => e.stopPropagation());
	dialog.addEventListener('cancel', (e) => {
		e.preventDefault();
		close();
	});

	links.forEach((link) => {
		link.addEventListener('click', (e) => {
			e.preventDefault();
			const isVideo = link.dataset.lightbox === 'video';
			caption.textContent = link.dataset.caption ?? '';
			caption.hidden = !link.dataset.caption;
			img.hidden = isVideo;
			video.hidden = !isVideo;
			if (isVideo) {
				video.src = link.href;
				video.setAttribute('aria-label', link.getAttribute('aria-label') ?? '');
				video.play().catch(() => {});
			} else {
				img.src = link.href;
				img.alt = link.querySelector('img')?.alt ?? '';
			}
			dialog.showModal();
			requestAnimationFrame(() => dialog.classList.add('is-open'));
		});
	});
}

function initTimeline() {
	document.querySelectorAll<HTMLElement>('[data-timeline]').forEach((timeline) => {
		const progress = timeline.querySelector<HTMLElement>('.progress');
		const entries = [...timeline.querySelectorAll<HTMLElement>('.entry')];
		if (!progress) return;

		// Dot centres measured from layout (offsetTop), which ignores transforms,
		// so entries still sliding in (data-reveal) can't skew the line.
		const dotCenter = (entry: HTMLElement) => {
			const dot = entry.querySelector<HTMLElement>('.dot')!;
			return entry.offsetTop + dot.offsetTop + dot.offsetHeight / 2;
		};

		// The track runs from the first dot to the last one.
		const layout = () => {
			if (!entries.length) return;
			const top = dotCenter(entries[0]);
			progress.style.top = `${top}px`;
			progress.style.height = `${dotCenter(entries[entries.length - 1]) - top}px`;
		};

		let ticking = false;
		const update = () => {
			ticking = false;
			layout();
			// The "playhead" sits a bit below the middle of the screen, then slides
			// to the bottom edge as you near the end of the page, so the last
			// entries can always be reached.
			const h = window.innerHeight;
			const remaining = document.documentElement.scrollHeight - (window.scrollY + h);
			const nearEnd = 1 - Math.min(Math.max(remaining / (h * 0.5), 0), 1);
			const anchor = h * (0.6 + 0.4 * nearEnd);
			const line = progress.getBoundingClientRect();
			const filled = Math.min(Math.max(anchor - line.top, 0), line.height);
			progress.style.setProperty('--progress', `${filled}px`);

			const base = timeline.getBoundingClientRect().top;
			entries.forEach((entry) => {
				// The current entry (.active) is always lit; the rest light up as you scroll.
				entry.classList.toggle(
					'reached',
					entry.classList.contains('active') || base + dotCenter(entry) <= anchor,
				);
			});
		};
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(update);
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll);
		// Images change the layout as they load, so re-measure then.
		window.addEventListener('load', update);
		update();
	});
}

function initObjects() {
	document.querySelectorAll<HTMLElement>('[data-object]').forEach((stage) => {
		const section = stage.closest<HTMLElement>('[data-object-scroll]');
		const rest = { x: -20, y: 35, z: 0 };
		const current = { ...rest };
		const pointer = { x: 0, y: 0 };
		let visible = true;
		let frame = 0;

		const apply = () => {
			stage.style.setProperty('--ox', `${current.x}deg`);
			stage.style.setProperty('--oy', `${current.y}deg`);
			stage.style.setProperty('--oz', `${current.z}deg`);
		};
		if (reducedMotion) {
			apply();
			return;
		}

		const scrollProgress = () => {
			if (!section) return Math.min(window.scrollY / window.innerHeight, 1);
			const rect = section.getBoundingClientRect();
			const travel = Math.max(rect.height - window.innerHeight, 1);
			return Math.min(Math.max(-rect.top / travel, 0), 1);
		};

		const tick = (time: number) => {
			const p = scrollProgress();
			const drift = Math.sin(time / 2400) * 4;
			const target = {
				x: rest.x + p * 45 - pointer.y * 18 + drift,
				y: rest.y + p * 320 + pointer.x * 28,
				z: rest.z - p * 25,
			};
			current.x += (target.x - current.x) * 0.08;
			current.y += (target.y - current.y) * 0.08;
			current.z += (target.z - current.z) * 0.08;
			apply();
			frame = visible ? requestAnimationFrame(tick) : 0;
		};

		if (finePointer) {
			window.addEventListener('pointermove', (e) => {
				pointer.x = e.clientX / window.innerWidth - 0.5;
				pointer.y = e.clientY / window.innerHeight - 0.5;
			});
		}

		new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			if (visible && !frame) frame = requestAnimationFrame(tick);
		}).observe(stage);
	});
}

initTilt();
initReveal();
initObjects();
initTimeline();
initLightbox();
