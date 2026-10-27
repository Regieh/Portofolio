import type { ImageMetadata } from 'astro';

import ombPic from '../assets/about/college/omb-2021-pic.png';
import mentoring from '../assets/about/college/mentoring-2023.png';
import bangkitCertificate from '../assets/about/bangkit/certificate.png';
import bangkitLetter from '../assets/about/bangkit/distinction-letter.png';
import bangkitTranscript from '../assets/about/bangkit/transcript.png';
import paperCertificate from '../assets/about/paper/internship-certificate.png';
import iotDiorama from '../assets/about/academy/iot-diorama.png';
import cohort from '../assets/about/academy/cohort.png';
import badminton from '../assets/about/academy/badminton.png';
import appShowcase from '../assets/about/academy/app-showcase.png';
import pingoo from '../assets/about/academy/pingoo.png';
import team from '../assets/about/academy/team.png';
import photoBooth from '../assets/about/academy/photo-booth.png';
import eventOne from '../assets/about/event-leader/event-1.png';
import halloween from '../assets/about/event-leader/halloween.png';
import eventTwo from '../assets/about/event-leader/event-2.png';
import unfoldedShowcase from '../assets/about/game-institute/unfolded-showcase.png';
import unfoldedTeam from '../assets/about/game-institute/unfolded-team.png';
import pattyPaw from '../assets/about/game-institute/pattypaw.png';
import catmouflageTeam from '../assets/about/game-institute/catmouflage-team.png';

// `caption` is the story behind the picture: 1–2 short lines, shown under the
// thumbnail and in full when the picture is opened.
// In descriptions and captions, wrap a phrase in ==double equals== to underline it.
export type TimelineMedia =
	| { src: ImageMetadata; alt: string; caption?: string }
	// Videos live in public/videos/ (served as-is); poster is the first frame.
	| { video: string; poster?: string; alt: string; caption?: string };

export interface TimelineEntry {
	date: string;
	title: string;
	description?: string;
	// Papers, reports, store pages… shown as small link pills.
	links?: { label: string; href: string }[];
	// Ongoing entries get the colorful line; past ones stay grey.
	active?: boolean;
	// Shown as rectangle tiles. Leave empty to show greybox tiles.
	media: TimelineMedia[];
}

// Most recent first.
// TODO: confirm the Academy / Game Institute years.
export const TIMELINE: TimelineEntry[] = [
	{
		date: '2026 – Present',
		title: 'Apple Developer Academy, Game Institute',
		description:
			'Second year at the Academy, focused on games. Developed Unfolded and PattyPaw, and now ==Catmouflage== (in TestFlight).',
		active: true,
		media: [
			{ src: catmouflageTeam, alt: 'The Catmouflage team at the TestFlight showcase' },
			{
				video: '/videos/catmouflage-playtest.mp4',
				poster: '/videos/catmouflage-playtest.jpg',
				alt: 'Playtesting Catmouflage from TestFlight',
			},
			{ src: unfoldedShowcase, alt: 'Unfolded and Shape Shift showcase screens' },
			{ src: unfoldedTeam, alt: 'Unfolded team at the showcase' },
			{ src: pattyPaw, alt: 'PattyPaw gameplay screen' },
		],
	},
	{
		date: '2025',
		title: 'Event Leader: Independence Day & Halloween',
		description: '==Selected twice== to lead Academy events.',
		media: [
			{ src: eventOne, alt: 'Academy event gathering' },
			{ src: halloween, alt: 'Halloween event setup' },
			{ src: eventTwo, alt: 'Academy event group photo' },
		],
	},
	{
		date: '2025',
		title: 'Apple Developer Academy',
		media: [
			{ src: appShowcase, alt: 'Showcasing our app' },
			{ src: team, alt: 'Team working session' },
			{ src: pingoo, alt: 'Pingoo game presentation' },
			{ src: iotDiorama, alt: 'IoT road diorama project' },
			{ src: cohort, alt: 'Academy cohort' },
			{ src: badminton, alt: 'Academy badminton session' },
			{ src: photoBooth, alt: 'Academy photo booth' },
		],
	},
	{
		date: 'Aug 2023 – Feb 2024',
		title: 'Internship at Paper.id',
		links: [
			{
				label: 'Internship report: Back-End Infrastructure at PT. Pakar Digital Global',
				href: 'https://kc.umn.ac.id/id/eprint/28520/',
			},
		],
		description:
			'Helped the Paper team update its technical writer API, and built backend services for the activation team in Golang, Express.js and Laravel, all on top of ==Clean Architecture==. It was hard, but ==I grew a lot from it==.',
		media: [{
				src: paperCertificate,
				alt: 'Paper.id certificate of internship',
				caption: 'Certificate of internship, August 2023 to February 2024.',
			}],
	},
	{
		date: 'Feb 2023 – Jul 2023',
		title: 'Bangkit Academy 2023',
		description: 'Machine Learning path. ==Graduated with Distinction==.',
		media: [
			{
				src: bangkitCertificate,
				alt: 'Bangkit certificate of completion with distinction',
				caption: 'Graduated with Distinction from Bangkit 2023, Machine Learning path.',
			},
			{ src: bangkitLetter, alt: 'Bangkit distinction graduate letter' },
			{ src: bangkitTranscript, alt: 'Bangkit 2023 final transcript' },
		],
	},
	{
		date: '2020 – 2024',
		title: 'Informatics, Universitas Multimedia Nusantara',
		description:
			'Graduated ==with Distinction==, GPA ==3.94==. My thesis applied audio augmentation to Wav2Vec2 speech recognition for Javanese and Sundanese, improving accuracy by 24.43% for Sundanese and 8.2% for Javanese.',
		links: [
			{
				label: 'Thesis: Audio Augmentation for Javanese & Sundanese Speech Recognition (Wav2Vec2)',
				href: 'https://kc.umn.ac.id/id/eprint/33983/',
			},
		],
		media: [
			{ src: ombPic, alt: 'OMB UMN 2021 person in charge certificate' },
			{ src: mentoring, alt: 'Character Building Mentoring 2023 certificate' },
		],
	},
];
