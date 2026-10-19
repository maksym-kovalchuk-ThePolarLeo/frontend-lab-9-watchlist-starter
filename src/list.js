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
    const buttons = document.querySelectorAll('#results button');
    buttons.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            const card = event.target.parentElement;
            const id = card.dataset.id;
            if (event.target.dataset.action === 'toggle') {
                toggle(id);
                document.querySelector('#watchlist-count').textContent = watchlist.size;
                refresh();
            } else if (event.target.dataset.action === 'details') {
                openDetails(id);
            }
        });
    });
}