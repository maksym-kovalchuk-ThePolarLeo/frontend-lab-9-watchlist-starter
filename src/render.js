/** @typedef {import('./state.js').Show} Show */

/**
 * C1. Показує серіали в списку #results — по картці з шаблону #show-card на кожен, у тому
 * самому порядку, — і оновлює рядок статусу #status. Специфікація — ТЗ, C1.
 *
 * @param {readonly Show[]} list серіали, які треба показати
 */
import { shows, watchlist, notes } from './state.js';

function setFieldText(root, names, value) {
    for (const name of names) {
        const el = root.querySelector(`[data-field="${name}"]`);
        if (el) {
            el.textContent = value;
            return el;
        }
    }
    return null;
}

export function renderShows(list = shows) {
    const resultsEl = document.querySelector('#results');
    const statusEl = document.querySelector('#status');
    const countEl = document.querySelector('#watchlist-count');
    const template = document.querySelector('#show-card');

    if (countEl) {
        countEl.textContent = String(watchlist.size);
    }

    if (!resultsEl || !template) return;

    const fragment = document.createDocumentFragment();

    for (const show of list) {
        const clone = template.content.cloneNode(true);
        const li = clone.querySelector('li') || clone.firstElementChild;

        li.dataset.id = String(show.id);

        const nameText = show.name ?? '—';
        const yearText = show.year != null && !Number.isNaN(show.year) ? String(show.year) : '—';
        const genresText = Array.isArray(show.genres) && show.genres.length > 0
            ? show.genres.join(', ')
            : '—';
        const ratingText = show.rating != null && !Number.isNaN(show.rating) ? String(show.rating) : '—';

        setFieldText(li, ['name', 'title'], nameText);
        setFieldText(li, ['year'], yearText);
        setFieldText(li, ['genres', 'genre'], genresText);
        setFieldText(li, ['rating'], ratingText);

        // Кнопки картки та їхні доступні імена (C1.4, C1.5, C2.2)
        const toggleBtn = li.querySelector('[data-action="toggle"]');
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-label', `До списку: ${nameText}`);
            toggleBtn.setAttribute('aria-pressed', String(watchlist.has(show.id)));
        }

        const detailsBtn = li.querySelector('[data-action="details"]');
        if (detailsBtn) {
            detailsBtn.setAttribute('aria-label', `Детальніше про ${nameText}`);
        }

        // Моя оцінка та нотатка на картці (C4.10)
        const savedNote = notes.get(show.id);
        const userRatingEl = li.querySelector(
            '[data-field="user-rating"], [data-field="my-rating"], [data-field="note-rating"], [data-field="userRating"]'
        );
        const userNoteEl = li.querySelector(
            '[data-field="note"], [data-field="user-note"], [data-field="my-note"], [data-field="note-text"], [data-field="userNote"]'
        );

        if (savedNote) {
            if (userRatingEl) {
                userRatingEl.textContent = `Моя оцінка: ${savedNote.rating}/10`;
                userRatingEl.hidden = false;
            }
            if (userNoteEl) {
                userNoteEl.textContent = savedNote.text ?? '';
                userNoteEl.hidden = !savedNote.text;
            }
            // Якщо в шаблоні є спільний контейнер нотатки з hidden
            const noteBox = (userRatingEl || userNoteEl)?.closest('[hidden]');
            if (noteBox) noteBox.hidden = false;
        } else {
            if (userRatingEl) {
                userRatingEl.textContent = '';
                userRatingEl.hidden = true;
            }
            if (userNoteEl) {
                userNoteEl.textContent = '';
                userNoteEl.hidden = true;
            }
        }

        fragment.appendChild(clone);
    }

    resultsEl.replaceChildren(fragment);

    if (statusEl) {
        if (list.length === 0) {
            statusEl.textContent = 'Нічого не знайдено';
        } else {
            statusEl.textContent = `Знайдено: ${list.length} з ${shows.length}`;
        }
    }
}
