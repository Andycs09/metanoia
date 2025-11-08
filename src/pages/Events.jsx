import React, { useEffect, useState } from 'react';
import events from '../data/events';
import EventCard from '../components/EventCard';

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

	useEffect(() => {
		// Shuffle animation for grid cards on page load:
		// - scatter cards randomly with transform + z-index stagger
		// - after duration, animate them back to their grid positions
		const doShuffle = () => {
			const grid = document.querySelector('.events-grid');
			if (!grid) return;
			const cards = Array.from(grid.querySelectorAll('.flip-card'));
			if (!cards.length) return;

			// small stagger and random transforms
			cards.forEach((card, i) => {
				// ensure card has will-change for smoother animation
				card.style.willChange = 'transform, opacity';
				const dx = Math.round((Math.random() - 0.5) * 1200); // horizontal spread
				const dy = Math.round((Math.random() - 0.5) * 600);  // vertical spread
				const rot = Math.round((Math.random() - 0.5) * 40);   // rotation degrees
				const scl = (1 + (Math.random() * 0.12)).toFixed(3);
				// stagger timing via transition delay
				const delay = (i * 45); // ms
				card.style.transition = `transform 900ms cubic-bezier(.2,.8,.2,1) ${delay}ms, opacity 700ms ${delay}ms`;
				card.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${scl})`;
				card.style.zIndex = 2000 + i;
			});

			// return to grid after a pause
			const totalDelay = 900 + (cards.length * 45);
			const hold = 900; // how long cards stay scattered before returning
			setTimeout(() => {
				cards.forEach((card, i) => {
					// restore with small stagger
					const delay = (i * 30);
					card.style.transition = `transform 900ms cubic-bezier(.2,.8,.2,1) ${delay}ms, opacity 700ms ${delay}ms`;
					card.style.transform = '';
					// clear z-index after transition ends
					setTimeout(() => {
						card.style.zIndex = '';
						card.style.willChange = '';
						// keep transition property minimal
						card.style.transition = '';
					}, 1200 + delay);
				});
			}, totalDelay + hold);
		};

		// run shuffle shortly after mount so DOM is ready
		const timeout = setTimeout(doShuffle, 320);
		return () => clearTimeout(timeout);
	}, [eventsList]); // re-run if eventsList changes

	return (
		<div className="events-page">
			{/* Primary events grid (Three.js scene removed) */}
			<div className="events-grid">
				{eventsList.map((ev, i) => (
					<EventCard key={ev.id} event={ev} index={i} />
				))}
			</div>
		</div>
	);
}
