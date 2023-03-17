document.addEventListener('DOMContentLoaded', () => {
	const pokemonModal = new bootstrap.Modal(
		document.getElementById('pokemon-modal')
	);

	let boxArray = [];
  let currentPage = 1;
  const boxPerPage = 25;

	async function getPokemonData(pokemonName) {
		const response = await fetch(
			`https://pokeapi.co/api/v2/pokemon/${pokemonName}`
		);
		const pokemonData = await response.json();
		return pokemonData;
	}

	function createPagination(totalBoxes, boxPerPage, setCurrentPage) {
		const pagination = document.getElementById('box-pagination');
		const totalPages = Math.ceil(totalBoxes / boxPerPage);

		for (let i = 1; i <= totalPages; i++) {
			const li = document.createElement('li');
			li.classList.add('page-item');

			const a = document.createElement('a');
			a.classList.add('page-link');
			a.textContent = i;
			a.href = '#';

			a.addEventListener('click', (e) => {
				e.preventDefault();
				setCurrentPage(i);
			});

			li.appendChild(a);
			pagination.appendChild(li);
		}
	}

	async function createTableCell(pokemon) {
		const cell = document.createElement('td');
		cell.style.width = '4.5em';
		cell.style.height = '4.5em';
		cell.style.textAlign = 'center';
		cell.style.verticalAlign = 'middle';

		const sprite = document.createElement('img');
		sprite.src = pokemon.sprites.front_default;
		sprite.alt = pokemon.name;
		sprite.width = 50;
		sprite.height = 50;
		sprite.addEventListener('click', async () => {
			const pokemonData = await getPokemonData(pokemon.name);
			showPokemonModal(pokemon, pokemonData);
		});

		cell.appendChild(sprite);
		return cell;
  }
  
  async function setCurrentPage(pageNumber) {
    currentPage = pageNumber;
    const pokemonsInBox = getPokemonInBox(
      boxArray,
      boxPerPage,
      currentPage
    );
    await renderBox(pokemonsInBox);
  };

  function removePagination() {
    const pagination = document.getElementById('box-pagination');
    pagination.innerHTML = '';
  }

	function showPokemonModal(pokemon, pokemonData) {
		const pokemonModalElement = document.getElementById('pokemon-modal');
		const localPokemonModal = new bootstrap.Modal(pokemonModalElement);
		const modalLabel = document.getElementById('modal-label');

		const type = pokemonData.types.map((t) => t.type.name).join(', ');
		modalLabel.textContent = `${pokemon.name} (Lvl ${pokemon.lvl}, Type: ${type})`;

		const modalPokemonInfo = document.getElementById('modal-pokemon-info');
		const releaseBtn = document.getElementById('release');

		modalLabel.textContent = `${pokemon.name} (Lvl ${pokemon.lvl}, Type: ${pokemon.type})`;
		modalPokemonInfo.innerHTML = `
    <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" width="100" height="100">
  `;

  releaseBtn.onclick = async () => {
    if (
      confirm(
        `Are you sure you want to release ${pokemon.name} back to the wild?`
      )
    ) {
      boxArray = boxArray.filter((p) => p.name !== pokemon.name);
  
      const pokemonsInBox = getPokemonInBox(
        boxArray,
        boxPerPage,
        currentPage
      );
      await renderBox(pokemonsInBox);
  
      removePagination();
      createPagination(boxArray.length, 25, setCurrentPage);
      await setCurrentPage(currentPage);
  
      localPokemonModal.hide(); // Use the global pokemonModal variable
    }
  };
  
		localPokemonModal.show(); // Use the global pokemonModal variable
	}

	function getPokemonInBox(boxArray, boxPerPage, currentPage) {
		const start = (currentPage - 1) * boxPerPage;
		const end = start + boxPerPage;
		return boxArray.slice(start, end);
	}

	async function renderBox(pokemonsInBox) {
		const table = document.getElementById('pokemon-table');
		table.innerHTML = ''; // Clear the table

		const totalRows = Math.ceil(pokemonsInBox.length / 5);

		for (let i = 0; i < totalRows; i++) {
			const row = document.createElement('tr');
			for (let j = 0; j < 5; j++) {
				const cellIndex = i * 5 + j;
				if (cellIndex < pokemonsInBox.length) {
					const pokemon = pokemonsInBox[cellIndex];
					const cell = await createTableCell(pokemon);
					row.appendChild(cell);
				} else {
					const emptyCell = document.createElement('td');
					emptyCell.style.width = '100px';
					emptyCell.style.height = '100px';
					row.appendChild(emptyCell);
				}
			}
			table.appendChild(row);
		}
	}

	async function init() {
		fetch('/assets/box_pokemon.json')
			.then((response) => response.json())
			.then((data) => {
				boxArray = data; // Update the boxArray with the fetched data
				
				let currentPage = 1;

				createPagination(boxArray.length, boxPerPage, setCurrentPage);
				setCurrentPage(currentPage); // Move this line inside the .then() block
			});
	}

	// Initialize the app
	init();
});
