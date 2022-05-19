const canvas = document.getElementById('canvas');
const advanceButton = document.getElementById('advance');
const randomiseButton = document.getElementById('randomise');
const clearButton = document.getElementById('clear');
const playPauseButton = document.getElementById('play-pause');
const speedRange = document.getElementById('speed');

let playIntervalObject;

const getPlayInterval = () => {
	const rangeMax = Number(speedRange.max);
	return ((speedRange.value * -1 + rangeMax) / rangeMax) * config.maxInterval
}

class GameOfLife {
	constructor(canvas) {
		this.canvas = canvas;
		this.canvas.width = config.width * config.scale;
		this.canvas.height = config.height * config.scale;
		this.ctx = canvas.getContext('2d');
		this.cells = [... Array(config.width)].map(() => [... Array(config.height)].fill(false));
	}

	// Apply the rules to a cell.
	updateCell(x, y, alive, neighbours) {
		if (alive) {
			this.cells[x][y] = neighbours >= config.rules.survivalRange[0] && neighbours <= config.rules.survivalRange[1];
		} else {
			this.cells[x][y] = neighbours >= config.rules.creationRange[0] && neighbours <= config.rules.creationRange[1];
		}
	}

	// Advance to the next generation.
	advance() {
		// Copy the map so that we aren't operating on updating data
		let columns = structuredClone(this.cells);
		columns.forEach((column, cellX) => {
			column.forEach((alive, cellY) => {
				// Calculate the number of neighbours the cell has
				let neighbours = 0;
				for (let x = cellX - 1; x <= cellX + 1; x++) {
					for (let y = cellY - 1; y <= cellY + 1; y++) {
						if (x != cellX || y != cellY) {
							// Out of bounds
							if (x < 0 || y < 0 || x >= config.width || y >= config.height) { continue; }	
							neighbours += columns[x][y] ? 1 : 0;
						}
					}
				}
				this.updateCell(cellX, cellY, alive, neighbours);
			});
		});
	}

	// Render a single frame.
	render() {
		this.ctx.fillStyle = config.colours.background;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = config.colours.cell;
		this.cells.forEach((column, cellX) => {
			column.forEach((alive, cellY) => {
				if (alive) {
					this.ctx.fillRect(cellX * config.scale, cellY * config.scale, config.scale, config.scale);
				}
			});
		});
	}
}

let gol = new GameOfLife(canvas);

// Advance button
advanceButton.addEventListener('click', () => {
	// Ignore if playing
	if (playIntervalObject) { return; }
	console.time('advance');
	gol.advance();
	gol.render();
	console.timeEnd('advance');
});

// Randomise button
randomiseButton.addEventListener('click', () => {
	for (cellX = 0; cellX < config.width; cellX++) {
		for (cellY = 0; cellY < config.height; cellY++) {
			gol.cells[cellX][cellY] = Math.random() > 0.5;
		}
	}
	gol.render();
});

// Clear button
clearButton.addEventListener('click', () => {
	for (cellX = 0; cellX < config.width; cellX++) {
		for (cellY = 0; cellY < config.height; cellY++) {
			gol.cells[cellX][cellY] = false;
		}
	}
	gol.render();
});

// Toggle cells with mouse
canvas.addEventListener('click', (e) => {
	const elementRelativeX = e.offsetX;
	const elementRelativeY = e.offsetY;
	const x = elementRelativeX * canvas.width / canvas.clientWidth;
	const y = elementRelativeY * canvas.height / canvas.clientHeight;
	const cellX = Math.floor(x / config.scale);
	const cellY = Math.floor(y / config.scale);
	gol.cells[cellX][cellY] = !gol.cells[cellX][cellY];
	gol.render();
});

// Play and pause
playPauseButton.addEventListener('click', () => {
	if (playIntervalObject) {
		// Pause
		playPauseButton.textContent = 'play_arrow';
		clearInterval(playIntervalObject);
		playIntervalObject = null;
	} else {
		// Play
		playPauseButton.textContent = 'pause';
		playIntervalObject = setInterval(() => {
			gol.advance();
			gol.render();
		}, getPlayInterval());
	}
});

// Changing speed
speedRange.addEventListener('change', () => {
	// Ignore if not playing
	if (!playIntervalObject) { return };
	clearInterval(playIntervalObject);
	playIntervalObject = setInterval(() => {
		gol.advance();
		gol.render();
	}, getPlayInterval());
});

gol.render();