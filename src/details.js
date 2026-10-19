import { getShow, saveNote, notes } from './state.js';

let currentShowId = null;

function htmlToPlainText(htmlString) {
    if (!htmlString) return '—';
    const doc = new DOMParser().parseFromString(String(htmlString), 'text/html');
    return (doc.body.textContent || '').trim() || '—';
}

function clearRatingError(ratingInput, errorEl) {
    if (ratingInput) {
        ratingInput.removeAttribute('aria-invalid');
        ratingInput.setCustomValidity('');
    }
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.hidden = true;
    }
}

function showRatingError(ratingInput, errorEl, message) {
    if (ratingInput) {
        ratingInput.setAttribute('aria-invalid', 'true');
        if (errorEl && errorEl.id) {
            ratingInput.setAttribute('aria-describedby', errorEl.id);
        }
    }
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.hidden = false;
    }
}

function parseValidRating(ratingInput) {
    if (!ratingInput) return null;
    const raw = ratingInput.value.trim();
    if (raw === '') return null;
    const num = Number(raw);
    if (!Number.isInteger(num) || num < 1 || num > 10) return null;
    return num;
}

/**
 * C4. Відкриває діалог #details для серіалу: назва, опис, посилання на сторінку TVmaze і форма
 * з моєю оцінкою й нотаткою. Специфікація — ТЗ, C4.
 *
 * @param {number} id
 */
export function openDetails(id) {
    const numericId = Number(id);
    const show = getShow(numericId);
    if (!show) return;

    currentShowId = numericId;

    const dialog = document.querySelector('#details');
    const titleEl = document.querySelector('#details-title');
    const summaryEl = document.querySelector('#details-summary');
    const linkEl = document.querySelector('#details-link');
    const form = document.querySelector('#note-form');
    const errorEl = document.querySelector('#note-rating-error');

    if (!dialog) return;

    if (titleEl) {
        titleEl.textContent = show.name;
    }
    if (dialog.getAttribute('aria-labelledby') !== 'details-title') {
        dialog.setAttribute('aria-labelledby', 'details-title');
    }
    if (linkEl) {
        linkEl.setAttribute('href', show.url || '#');
    }

    if (summaryEl) {
        summaryEl.textContent = htmlToPlainText(show.summary);
    }

    if (form) {
        const ratingInput = form.elements.namedItem('rating');
        const noteInput = form.elements.namedItem('note');
        const saved = notes.get(numericId);

        clearRatingError(ratingInput, errorEl);

        if (ratingInput) {
            ratingInput.value = saved ? String(saved.rating) : '';
            if (errorEl && errorEl.id) {
                ratingInput.setAttribute('aria-describedby', errorEl.id);
            }
        }
        if (noteInput) {
            noteInput.value = saved && saved.text ? saved.text : '';
        }
    }

    if (!dialog.open) {
        dialog.showModal();
    }
}

function focusDetailsButtonForCurrentShow() {
    if (currentShowId == null) return;
    const btn = document.querySelector(
        `#results li[data-id="${currentShowId}"] button[data-action="details"]`
    );
    if (btn) {
        btn.focus();
    }
}
/**
 * C4. Підключає діалог #details: закриття й форму «Моя оцінка й нотатка». main.js викликає цю
 * функцію один раз. Специфікація — ТЗ, C4.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initDetails(refresh) {
    const dialog = document.querySelector('#details');
    const form = document.querySelector('#note-form');
    const errorEl = document.querySelector('#note-rating-error');

    if (!dialog || !form) return;

    form.noValidate = true;

    const ratingInput = form.elements.namedItem('rating');
    const noteInput = form.elements.namedItem('note');

    if (ratingInput) {
        ratingInput.addEventListener('input', () => {
            if (parseValidRating(ratingInput) !== null) {
                clearRatingError(ratingInput, errorEl);
            }
        });
    }

    const cancelBtn =
        form.querySelector('[data-action="cancel"], button[type="button"], button[value="cancel"]') ||
        Array.from(form.querySelectorAll('button')).find((b) =>
            b.textContent.trim().toLowerCase().includes('скасувати')
        );

    if (cancelBtn) {
        cancelBtn.addEventListener('click', (event) => {
            event.preventDefault();
            clearRatingError(ratingInput, errorEl);
            dialog.close();
            focusDetailsButtonForCurrentShow();
        });
    }

    dialog.addEventListener('close', () => {
        focusDetailsButtonForCurrentShow();
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (currentShowId == null) return;

        const validRating = parseValidRating(ratingInput);

        if (validRating === null) {
            showRatingError(
                ratingInput,
                errorEl,
                'Введіть ціле число від 1 до 10.'
            );
            if (ratingInput) ratingInput.focus();
            return;
        }

        clearRatingError(ratingInput, errorEl);

        const noteText = noteInput ? noteInput.value.trim() : '';
        const show = getShow(currentShowId);

        saveNote(currentShowId, { rating: validRating, text: noteText });

        if (typeof refresh === 'function') {
            refresh();
        }

        dialog.close();

        const statusEl = document.querySelector('#status');
        if (statusEl && show) {
            statusEl.textContent = `Нотатку до ${show.name} збережено`;
        }

        focusDetailsButtonForCurrentShow();
    });
}
