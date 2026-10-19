/**
 * C2. Підключає кнопки карток у списку #results: «До списку» додає серіал до мого списку або
 * прибирає з нього, «Детальніше» відкриває діалог (openDetails з details.js). main.js викликає
 * цю функцію один раз, після першого показу списку. Специфікація — ТЗ, C2.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
import { toggle, watchlist } from './state.js';
import { openDetails } from './details.js';

export function initList(refresh) {
    const resultsEl = document.querySelector('#results');
    if (!resultsEl) return;

    resultsEl.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-action]');
        if (!button || !resultsEl.contains(button)) return;

        const card = button.closest('li[data-id]');
        if (!card) return;

        const id = Number(card.dataset.id);
        const action = button.dataset.action;

        if (action === 'toggle') {
            const cardsBefore = Array.from(resultsEl.querySelectorAll('li[data-id]'));
            const currentIndex = cardsBefore.indexOf(card);

            toggle(id);

            const countEl = document.querySelector('#watchlist-count');
            if (countEl) {
                countEl.textContent = String(watchlist.size);
            }

            if (typeof refresh === 'function') {
                refresh();
            }

            const sameCardToggle = resultsEl.querySelector(
                `li[data-id="${id}"] button[data-action="toggle"]`
            );

            if (sameCardToggle) {
                sameCardToggle.focus();
            } else {
                const cardsAfter = Array.from(resultsEl.querySelectorAll('li[data-id]'));
                if (cardsAfter.length > 0) {
                    const targetIndex = Math.min(currentIndex, cardsAfter.length - 1);
                    const nextToggleBtn = cardsAfter[targetIndex].querySelector(
                        'button[data-action="toggle"]'
                    );
                    if (nextToggleBtn) nextToggleBtn.focus();
                } else {
                    const heading = document.querySelector('#results-heading');
                    if (heading) {
                        if (!heading.hasAttribute('tabindex')) {
                            heading.tabIndex = -1;
                        }
                        heading.focus();
                    }
                }
            }
        } else if (action === 'details') {
            openDetails(id);
        }
    });
}
