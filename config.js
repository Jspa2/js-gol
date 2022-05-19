// Configuration

const config = {
	// How many screen pixels each cell should occupy.
	scale: 5,

	// The size of the map, in units of cells.
	width: 256,
	height: 128,

	// Colours to be used on the canvas.
	colours: {
		background: '#000',
		cell: '#fff',
	},

	// The game rules.
	rules: {
		// The range of neighbours that will cause a cell to live on to the next generation.
		survivalRange: [2, 3],

		// The range of neighbours that will cause a cell to be created.
		creationRange: [3, 3],
	},

	// The maximum playback interval allowed.
	maxInterval: 200
}