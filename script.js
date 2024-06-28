async function searchRequest() {
  const input = document.querySelector(".search__input");
  const inputData = input.value.trim();
  if (!inputData) {
    return;
  }
  const perPage = 5;
  const url = `https://api.github.com/search/repositories?q=${inputData}&perPage=${perPage}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Ooops!");
    }
    const result = await response.json();
    return result.items.slice(0, perPage);
  } catch (error) {
    console.error(error);
  }
}
function debounce(fn, debounceTime) {
  let timeout;
  return function () {
    const fnCall = () => {
      fn.apply(this, arguments);
    };
    clearTimeout(timeout);
    timeout = setTimeout(fnCall, debounceTime);
  };
}
function drawResults(dataArr) {
  const resultsEl = document.querySelector(".search__results");
  resultsEl.innerHTML = "";
  if (!dataArr || dataArr.length === 0) {
    return;
  }
  const fragment = document.createDocumentFragment();
  dataArr.forEach((item) => {
    const searchItem = document.createElement("li");
    searchItem.classList.add("search__item");
    searchItem.textContent = item.name;
    fragment.append(searchItem);
  });
  resultsEl.append(fragment);
}
async function search() {
  results = await searchRequest();
  drawResults(results);
}
function clearInput() {
  const input = document.querySelector(".search__input");
  input.value = "";
}
let results;
const input = document.querySelector(".search__input");
input.addEventListener("input", debounce(search, 600));
input.addEventListener("submit", (e) => {
  e.preventDefault();
});

function createCard(cardData) {
  const name = cardData.name;
  const owner = cardData.owner.login;
  const stars = cardData.stargazers_count;
  const cards = document.querySelector(".cards");
  cards.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="card">
      <ul class="card__content">
        <li class="cards__data-item">Name: ${name}</li>
        <li class="cards__data-item">Owner: ${owner}</li>
        <li class="cards__data-item">Stars: ${stars}</li>
      </ul>
      <button class="card__btn close-btn" type="button"></button>
    </div>
    `
  );
}
function deleteCard(event) {
  if (event.target.classList.contains("close-btn")) {
    event.target.parentNode.remove();
  }
}
function resultsClickHandler(event) {
  clearInput();
  drawResults();
  const name = event.target.textContent;
  const cardData = results.find((item) => item.name === name);
  createCard(cardData);
}

const resultsEl = document.querySelector(".search__results");
const cards = document.querySelector(".cards");
resultsEl.addEventListener("click", resultsClickHandler);
cards.addEventListener("click", deleteCard);
