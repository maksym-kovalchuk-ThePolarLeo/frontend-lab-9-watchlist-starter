/** @typedef {import('./state.js').Show} Show */

/**
 * C1. Показує серіали в списку #results — по картці з шаблону #show-card на кожен, у тому
 * самому порядку, — і оновлює рядок статусу #status. Специфікація — ТЗ, C1.
 *
 * @param {readonly Show[]} list серіали, які треба показати
 */
export function renderShows(list = []) {
    const results = document.querySelector('#results');
    results.innerHTML = '';

    for (const show of list) {
        results.innerHTML += `
      <li class="card" data-id="${show.id}">
        <h3>${show.name}</h3>
        <p>${show.year} · ${show.genres.join(', ')} · ${show.rating}</p>
        <button type="button" data-action="toggle">До списку</button>
        <button type="button" data-action="details">Детальніше</button>
      </li>
    `;
    }
}
