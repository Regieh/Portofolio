import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const source = path.resolve('src/assets/icon.svg');

export const GET: APIRoute = async () => {
	const svg = await readFile(source);
	const png = await sharp(svg, { density: 1200 }).resize(180, 180).png().toBuffer();

	return new Response(new Uint8Array(png), {
		headers: { 'Content-Type': 'image/png' },
	});
};
