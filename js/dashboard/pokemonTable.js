const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

function createImageCell(pokemon, data, carousel, partyIndex) {
  const imageCell = document.createElement('td');
  imageCell.height = 128;
  imageCell.width = 128;

  const imageContainer = document.createElement('div');
  imageContainer.style.position = 'relative';

  const image = document.createElement('img');
  image.src = data.sprites.front_default;
  image.alt = data.name;
  image.width = 100;
  image.height = 100;

  const name = document.createElement('div');
  name.innerHTML = `<strong>${pokemon.name}</strong>`;
  name.style.padding = '2px';

  const level = document.createElement('div');
  level.innerHTML = `Lv. ${pokemon.lvl}`;
  level.style.padding = '2px';

  image.addEventListener('click', () => {
    let carouselInstance = new bootstrap.Carousel(carousel, {
      interval: false,
      wrap: false,
    });
    carouselInstance.to(partyIndex + 1);
  });

  imageContainer.appendChild(name);
  imageContainer.appendChild(level);
  imageContainer.appendChild(image);
  imageCell.appendChild(imageContainer);
  
	const progressBar = document.createElement('div');
	progressBar.classList.add('progress', 'col-10');
	progressBar.style.height = '10px';

	const successProgressBar = document.createElement('div');
	successProgressBar.classList.add('progress-bar', 'bg-success');
	successProgressBar.setAttribute('role', 'progressbar');
	successProgressBar.style.width = `${
		(pokemon.currentHP / data.stats[0].base_stat) * 100
	}%`;
	successProgressBar.textContent = `${pokemon.currentHP}/${data.stats[0].base_stat}`;

	const dangerProgressBar = document.createElement('div');
	dangerProgressBar.classList.add('progress-bar', 'bg-danger');
	dangerProgressBar.setAttribute('role', 'progressbar');
	dangerProgressBar.style.width = `${
		((data.stats[0].base_stat - pokemon.currentHP) / data.stats[0].base_stat) *
		100
	}%`;

	progressBar.appendChild(successProgressBar);
	progressBar.appendChild(dangerProgressBar);

	imageCell.appendChild(progressBar);

	return imageCell;
}

function createSlides(carousel, pokemon, data) {
  const slide = document.createElement('div');
  slide.classList.add('carousel-item');
  slide.id = `pokemon-${pokemon.name}`;

  const table = document.createElement('table');
  table.classList.add('table');
  slide.appendChild(table);

  const thead = document.createElement('thead');
  table.appendChild(thead);

  const headerRow = document.createElement('tr');
  thead.appendChild(headerRow);

  const nameHeader = document.createElement('th');
  nameHeader.textContent = pokemon.name;
  nameHeader.colSpan = 2;
  headerRow.appendChild(nameHeader);

  const levelHeader = document.createElement('th');
  levelHeader.textContent = `Lvl: ${pokemon.lvl}`;
  headerRow.appendChild(levelHeader);

  const typeHeader = document.createElement('th');
  typeHeader.textContent = `Type: ${pokemon.type}`;
  headerRow.appendChild(typeHeader);

  const tbody = document.createElement('tbody');
  table.appendChild(tbody);

  const spriteRow = document.createElement('tr');
  tbody.appendChild(spriteRow);

  // Add a larger sprite
  const spriteCell = document.createElement('td');
  spriteRow.appendChild(spriteCell);
  spriteCell.colSpan = 6;

  const spriteImage = document.createElement('img');
  spriteImage.src = data.sprites.front_default;
  spriteImage.alt = data.name;
  spriteImage.width = 200;
  spriteImage.height = 200;
  spriteCell.appendChild(spriteImage);

  // Add health bar
  const healthBarRow = document.createElement('tr');
  tbody.appendChild(healthBarRow);

  const healthBarCell = document.createElement('td');
  healthBarCell.colSpan = 6;
  healthBarRow.appendChild(healthBarCell);

  const healthProgressBar = document.createElement('div');
  healthProgressBar.classList.add('progress');
  healthProgressBar.style.height = '20px';
  healthBarCell.appendChild(healthProgressBar);

  const healthSuccessProgressBar = document.createElement('div');
  healthSuccessProgressBar.classList.add('progress-bar', 'bg-success');
  healthSuccessProgressBar.setAttribute('role', 'progressbar');
  healthSuccessProgressBar.style.width = `${
    (pokemon.currentHP / data.stats[0].base_stat) * 100
  }%`;
  healthSuccessProgressBar.textContent = `${pokemon.currentHP}/${data.stats[0].base_stat}`;
  healthProgressBar.appendChild(healthSuccessProgressBar);

  // Add experience bar
  const experienceBarRow = document.createElement('tr');
  tbody.appendChild(experienceBarRow);

  const experienceBarCell = document.createElement('td');
  experienceBarCell.colSpan = 6;
  experienceBarRow.appendChild(experienceBarCell);

  const experienceProgressBar = document.createElement('div');
  experienceProgressBar.classList.add('progress');
  experienceProgressBar.style.height = '20px';
  experienceBarCell.appendChild(experienceProgressBar);

  const experienceSuccessProgressBar = document.createElement('div');
  experienceSuccessProgressBar.classList.add('progress-bar', 'bg-info');
  experienceSuccessProgressBar.setAttribute('role', 'progressbar');
  experienceSuccessProgressBar.style.width = `${
    (pokemon.exp / pokemon.maxExp) * 100
  }%`;
  experienceSuccessProgressBar.textContent = `${pokemon.exp}/${pokemon.maxExp}`;
  experienceProgressBar.appendChild(experienceSuccessProgressBar);

  const movesTitleRow = document.createElement('tr');
  tbody.appendChild(movesTitleRow);

  const movesTitleCell = document.createElement('td');
  movesTitleCell.colSpan = 6;
  movesTitleRow.appendChild(movesTitleCell);

  const movesTitle = document.createElement('strong');
  movesTitle.textContent = 'Moves:';
  movesTitleCell.appendChild(movesTitle);

  // Moves in a 2x2 grid
  const moveCells = pokemon.moves.slice(0, 4).map((move) => {
    const moveCell = document.createElement('td');
    moveCell.colSpan = 3;
    moveCell.textContent = move;
    return moveCell;
  });

  for (let i = 0; i < moveCells.length; i += 2) {
    const moveRow = document.createElement('tr');
    tbody.appendChild(moveRow);

    moveRow.appendChild(moveCells[i]);

    if (moveCells[i + 1]) {
      moveRow.appendChild(moveCells[i + 1]);
    }
  }

  const backButton = document.createElement('button');
  backButton.classList.add('btn', 'btn-primary');
  backButton.textContent = 'Back';
  backButton.addEventListener('click', () => {
    let carouselInstance = new bootstrap.Carousel(carousel, {
      interval: false,
    });

    let activeIndex = Array.from(carousel.children).findIndex((child) =>
      child.classList.contains('active')
    );

    if (activeIndex !== 1) {
      carouselInstance.to(0);
      carouselInstance.pause();
    } else {
      carouselInstance.to(activeIndex - 1);
    }
  });

  slide.appendChild(backButton);

  document.querySelector('.carousel-inner').appendChild(slide);
  return slide;
}

async function displayCurrentParty() {
  let partyPokemon = JSON.parse(localStorage.getItem("current_party"));
  if (!partyPokemon) {
    const partyResponse = await fetch('/assets/current_party.json');
    partyPokemon = await partyResponse.json();
  }
  return partyPokemon;
}

async function createTableRows(party, index, carousel) {
  const tableRow = document.createElement('tr');

  const promises = [];

  for (let j = 0; j < 3 && index + j < party.length; j++) {
    const pokemon = party[index + j];

    const promise = fetch(`${apiUrl}${pokemon.name}`)
      .then((response) => response.json())
      .then((data) => {
        const imageCell = createImageCell(pokemon, data, carousel, index + j);
        tableRow.appendChild(imageCell);
      });

    promises.push(promise);
  }

  await Promise.all(promises);
  return tableRow;
}

(async () => {
  const party = await displayCurrentParty();
  const carousel = document.getElementById('carouselExampleControls');

  for (let index = 0; index < party.length; index++) {
    const pokemon = party[index];

    const data = await fetch(`${apiUrl}${pokemon.name}`).then((response) =>
      response.json()
    );

    const availableMoves = data.moves
      .filter(
        (move) =>
          move.version_group_details[0].level_learned_at <= pokemon.lvl
      )
      .map((move) => move.move.name);

    const selectedMoves = [];
    for (let i = 0; i < 4 && availableMoves.length > 0; i++) {
      const randomMove = availableMoves.splice(
        Math.floor(Math.random() * availableMoves.length),
        1
      )[0];
      selectedMoves.push(randomMove);
    }
    pokemon.moves = selectedMoves;

    createSlides(carousel, pokemon, data);
  }

  const tableRows = [];
  for (let i = 0; i < party.length; i += 3) {
    const tableRow = await createTableRows(party, i, carousel);
    tableRows.push(tableRow);
  }

  // Append table rows in the correct order
  tableRows.forEach((tableRow) => {
    document.getElementById('pokemon-table').appendChild(tableRow);
  });
})();
