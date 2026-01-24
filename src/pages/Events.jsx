import React, { useEffect, useState } from 'react';
import events from '../data/events';
import EventCard from '../components/EventCard';
import bgImage from '../assets/home page theme.png';

export default function Events() {
	// Fisher‑Yates shuffle helper
	function shuffleArray(a) {
		const arr = a.slice();
		for (let i = arr.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[arr[i], arr[j]] = [arr[j], arr[i]];
		}
		return arr;
	}

	// store shuffled events so order is different each load
	const [eventsList] = useState(() => shuffleArray(events));

	// Scroll to middle of page when component mounts
	useEffect(() => {
		const scrollToMiddle = () => {
			const viewportHeight = window.innerHeight;
			const documentHeight = document.documentElement.scrollHeight;
			const middlePosition = (documentHeight - viewportHeight) / 2;
			
			// Small delay to ensure page is fully rendered
			setTimeout(() => {
				window.scrollTo({
					top: middlePosition,
					behavior: 'smooth'
				});
			}, 100);
		};

		scrollToMiddle();
	}, []);

	useEffect(() => {
		console.log('🎴 Scatter animation useEffect triggered');
		const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
		if (prefersReduced) {
			console.log('⏸️ Reduced motion preference detected, skipping animation');
			return;
		}

		const grid = document.querySelector('.events-grid');
		if (!grid) {
			console.log('❌ Grid not found');
			return;
		}
		const cards = Array.from(grid.querySelectorAll('.flip-card'));
		if (!cards.length) {
			console.log('❌ No cards found');
			return;
		}
		
		console.log(`✅ Found ${cards.length} cards, starting scatter animation`);

		// Helper: wait for all images inside cards to load (max 1s)
		const waitImages = (root) =>
			new Promise((resolve) => {
				const imgs = Array.from(root.querySelectorAll('img'));
				if (imgs.length === 0) return resolve();
				let done = 0;
				const finish = () => (++done >= imgs.length ? resolve() : null);
				const to = setTimeout(resolve, 1000);
				imgs.forEach((img) => {
					if (img.complete) return finish();
					img.addEventListener('load', finish, { once: true });
					img.addEventListener('error', finish, { once: true });
				});
			});

		(async () => {
			await waitImages(grid);

			const vw = window.innerWidth;
			const vh = window.innerHeight;
			const finals = cards.map((el) => el.getBoundingClientRect());

			grid.classList.add('events-grid--animating');

			// Phase 1: Set cards to scattered positions IMMEDIATELY (this is the starting state)
			console.log('📍 Setting initial scattered positions...');
			cards.forEach((el, i) => {
				const f = finals[i];
				const centerX = f.left + f.width / 2;
				const centerY = f.top + f.height / 2;

				// Random target within safe viewport bounds
				const targetX = vw * (0.15 + Math.random() * 0.7);
				const targetY = vh * (0.15 + Math.random() * 0.7);

				const dx = targetX - centerX;
				const dy = targetY - centerY;
				const rot = (Math.random() * 2 - 1) * 60; // -60..60 for more dramatic
				const scale = 0.7 + Math.random() * 0.4;

				// Remove zig-zag classes temporarily
				el.classList.remove('zig-left', 'zig-right');
				
				el.style.transition = 'none';
				el.style.willChange = 'transform';
				el.style.transformOrigin = '50% 50%';
				el.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${rot}deg) scale(${scale})`;
				el.style.zIndex = String(2000 + i);

				console.log(`Card ${i}: scattered to dx=${Math.round(dx)}, dy=${Math.round(dy)}, rot=${Math.round(rot)}°`);

				// Force reflow for this element so the browser commits phase 1
				// eslint-disable-next-line no-unused-expressions
				el.offsetWidth;
			});
			console.log('✨ Cards are scattered! Settling immediately...');

			// Phase 2: Smoothly animate cards to their grid positions
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					console.log('🎯 Settling cards to grid positions...');
					cards.forEach((el, i) => {
						const delay = i * 80; // Slightly faster stagger
						
						// Restore zig-zag class
						if (i % 2 === 0) {
							el.classList.add('zig-left');
						} else {
							el.classList.add('zig-right');
						}
						
						// Smoother easing curve for more fluid motion
						el.style.transition = `transform 1400ms cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}ms`;
						el.style.transform = '';
					});

					const total = 1400 + (cards.length - 1) * 80 + 400;
					setTimeout(() => {
						console.log('🧹 Cleaning up animation styles...');
						cards.forEach((el) => {
							el.style.transition = '';
							el.style.transform = '';
							el.style.willChange = '';
							el.style.zIndex = '';
							el.style.transformOrigin = '';
						});
						grid.classList.remove('events-grid--animating');
						console.log('✅ Animation complete!');
					}, total);
				});
			});
		})();

		// no cleanup necessary (one-shot)
	}, [eventsList]);

	return (
		<div className="events-page" style={{ backgroundImage: `url(${bgImage})` }}>
			<style>{`
				.events-page {
					min-height: 100vh;
					background-size: cover;
					background-position: center top;
					background-repeat: no-repeat;
					background-attachment: scroll;
					position: relative;
					padding: 20px;
					padding-top: 120px;
					padding-bottom: 100px;
				}
				.events-page::before {
					content: '';
					position: absolute;
					top: 0; left: 0; right: 0; bottom: 0;
					background: rgba(0, 0, 0, 0.4);
					z-index: 0;
					pointer-events: none;
				}
				.events-grid {
					position: relative;
					z-index: 1;
					text-align: center;
					margin-bottom: 60px;
				}
				/* Override zig-zag during scatter animation */
				.events-grid--animating .flip-card.zig-left,
				.events-grid--animating .flip-card.zig-right,
				.events-grid--animating .flip-card.is-flipped.zig-left,
				.events-grid--animating .flip-card.is-flipped.zig-right {
					transform: none !important;
					text-align: center;
					margin-bottom: 60px;
				}
				/* Disable interactions during animation */
				.events-grid--animating .flip-card { pointer-events: none; }
			`}</style>

			<div className="events-grid">
				{eventsList.map((ev, i) => (
					<EventCard key={ev.id} event={ev} index={i} />
				))}
			</div>
		</div>
	);
}
