/** @typedef {import('./state.js').Filters} Filters */

/**
 * C3. Повертає поточні значення форми фільтрів #filters. Поки C3 не виконано, фільтрів немає,
 * і список показує всі серіали. Специфікація — ТЗ, C3.
 *
 * @returns {Filters}
 */
export function readFilters() {
  const form = document.querySelector('#filters');
  if (!form) {
    return { query: '', genre: '', mine: false };
  }

  const queryField = form.elements.namedItem('query');
  const genreField = form.elements.namedItem('genre');
  const mineField = form.elements.namedItem('mine');

  return {
    query: queryField ? queryField.value.trim() : '',
    genre: genreField ? genreField.value : '',
    mine: mineField ? Boolean(mineField.checked) : false,
  };
}

/**
 * C3. Підключає форму фільтрів: після кожної зміни — refresh(). main.js викликає цю функцію
 * один раз. Специфікація — ТЗ, C3.
 *
 * @param {() => void} refresh перемальовує список для поточних фільтрів
 */
export function initFilters(refresh) {
  const form = document.querySelector('#filters');
  if (!form) return;

  const queryField = form.elements.namedItem('query');
  const genreField = form.elements.namedItem('genre');
  const mineField = form.elements.namedItem('mine');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
  });

  if (queryField) {
    queryField.addEventListener('input', () => {
      if (typeof refresh === 'function') refresh();
    });
  }

  if (genreField) {
    genreField.addEventListener('change', () => {
      if (typeof refresh === 'function') refresh();
    });
  }

  if (mineField) {
    mineField.addEventListener('change', () => {
      if (typeof refresh === 'function') refresh();
    });
  }

  form.addEventListener('reset', () => {
    if (queryField) queryField.value = '';
    if (genreField) genreField.value = '';
    if (mineField) mineField.checked = false;

    if (typeof refresh === 'function') refresh();
  });
}
