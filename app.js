let game; // Reference to the game grid container
let n = 3; // Default grid size
let m = 2; // Default number of states
let includeDiagonals = false; // Default behavior for diagonals
let colorScheme = 'blue'; // Default color scheme
const colorSchemes = {
    blue: ['#E6F0FA', '#99C2E7', '#4D88D1', '#0047AB', '#002366'],
    red: ['#FAD4D4', '#F78F8F', '#D64545', '#A80000', '#750000'],
    green: ['#E8F5E9', '#A5D6A7', '#66BB6A', '#2E7D32', '#1B5E20'],
    greyscale: ['#F0F0F0', '#CCCCCC', '#888888', '#444444', '#000000']
};
let colors = colorSchemes[colorScheme]; // Initial color set to blue shades

document.addEventListener('DOMContentLoaded', () => {
    const settingsIcon = document.getElementById('settingsIcon');
    const settingsPanel = document.getElementById('settingsPanel');
    const applySettingsBtn = document.getElementById('applySettings');
    const closeSettingsBtn = document.getElementById('closeSettings');

    // Set default values dynamically
    document.getElementById('gridSize').value = '3';  // Default to 3x3 grid
    document.getElementById('numStates').value = '2';  // Default to 2 states
    document.getElementById('moveset').value = 'adjacent';  // Default moveset to 'Adjacent'
    document.getElementById('colorScheme').value = 'blue';  // Default color scheme to 'Blue'

    // Ensure the game container is initialized correctly
    game = document.getElementById('game');

    // Toggle the settings panel visibility
    settingsIcon.addEventListener('click', () => {
        settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    });

    // Apply the settings from the panel and hide it
    applySettingsBtn.addEventListener('click', () => {
        updateSettings();
        settingsPanel.style.display = 'none';
    });

    // Simply hide the settings panel
    closeSettingsBtn.addEventListener('click', () => {
        settingsPanel.style.display = 'none';
    });

    // Initialize the game grid
    initializeGrid();
});

function initializeGrid() {
    game.innerHTML = '';
    // Use 100% divided by n to create flexible grid columns and rows
    game.style.gridTemplateColumns = `repeat(${n}, 1fr)`;
    game.style.gridTemplateRows = `repeat(${n}, 1fr)`;

    for (let i = 0; i < n * n; i++) {
        let cell = document.createElement('div');
        cell.className = `cursor-pointer flex justify-center items-center`; // Using TailwindCSS for flexbox
        cell.style.backgroundColor = colors[0];
        cell.dataset.state = 0;
        cell.dataset.index = i;
        cell.onclick = () => {
            toggleCells(i);
            checkWin();
        };
        game.appendChild(cell);
    }
    scrambleGrid();
}

function toggleCells(index) {
    const row = Math.floor(index / n);
    const col = index % n;

    toggleState(index); // Toggles the state of the clicked cell

    // Handling moves based on selected moveset
    const moveset = document.getElementById('moveset').value;
    if (moveset === 'adjacent' || moveset === 'square') {
        if (col > 0) toggleState(index - 1);
        if (col < n - 1) toggleState(index + 1);
        if (row > 0) toggleState(index - n);
        if (row < n - 1) toggleState(index + n);
    }
    if (moveset === 'square' || moveset === 'diagonalsOnly') {
        if (row > 0 && col > 0) toggleState(index - n - 1);
        if (row > 0 && col < n - 1) toggleState(index - n + 1);
        if (row < n - 1 && col > 0) toggleState(index + n - 1);
        if (row < n - 1 && col < n - 1) toggleState(index + n + 1);
    }
}

function updateSettings() {
    console.log("Updating settings...");

    n = parseInt(document.getElementById('gridSize').value);
    console.log("Grid size (n):", n);

    m = parseInt(document.getElementById('numStates').value);
    console.log("Number of states (m):", m);

    colorScheme = document.getElementById('colorScheme').value;
    colors = colorSchemes[colorScheme]; 
    console.log("Color scheme:", colorScheme);

    const moveset = document.getElementById('moveset').value;
    console.log("Moveset:", moveset);
    switch (moveset) {
        case 'adjacent':
            includeDiagonals = false;
            break;
        case 'square':
            includeDiagonals = true;
            break;
        case 'diagonalsOnly':
            includeDiagonals = 'diagonalsOnly';
            break;
    }

    initializeGrid(); // Reinitialize the grid with new settings
}

function toggleState(index) {
    const cell = game.children[index];
    let currentState = parseInt(cell.dataset.state);
    let nextState = (currentState + 1) % m;
    cell.style.backgroundColor = colors[nextState % colors.length]; // Change color based on the state
    cell.dataset.state = nextState;
}

function scrambleGrid() {
    let moveCount = 0;
    do {
        for (let i = 0; i < 30; i++) { // Make 30 random moves
            const randomIndex = Math.floor(Math.random() * (n * n));
            toggleCells(randomIndex);
        }
        moveCount++;
    } while (isSolved()); // Keep scrambling if the puzzle is solved
}

function isSolved() {
    const firstState = game.children[0].dataset.state;
    return Array.from(game.children).every(cell => cell.dataset.state === firstState);
}

function checkWin() {
    // Using setTimeout to delay the win check slightly
    setTimeout(function() {
        if (isSolved()) {
            if (confirm("You Won! Play Again?")) {
                initializeGrid(); // Reinitialize and scramble the grid if the user chooses to play again
            }
        }
    }, 100); // Delay in milliseconds, adjust as necessary
}