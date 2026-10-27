import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import ico from 'sharp-ico';

// Built once at build time from the same source as /favicon.svg.
const source = path.resolve('src/assets/icon.svg');

export const GET: APIRoute = async () => {
	const svg = await readFile(source);
	const buffers = await Promise.all(
		[16, 32, 48].map((size) => sharp(svg, { density: 384 }).resize(size, size).png().toBuffer()),
	);

	return new Response(new Uint8Array(ico.encode(buffers)), {
		headers: { 'Content-Type': 'image/x-icon' },
	});
};
