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
    const closeSettingsBtn = document.getElementById('closeSettings'); // Get the close button

    // Initialize the game variable here, inside the DOMContentLoaded listener
    game = document.getElementById('game');

    settingsIcon.addEventListener('click', () => {
        // Toggle the display of the settings panel
        settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    });

    applySettingsBtn.addEventListener('click', () => {
        // Apply settings and hide the settings panel
        updateSettings();
        settingsPanel.style.display = 'none';
    });

    closeSettingsBtn.addEventListener('click', () => {
        // Hide the settings panel when the close button is clicked
        settingsPanel.style.display = 'none';
    });

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

    toggleState(index);
    if (col > 0) toggleState(index - 1);
    if (col < n - 1) toggleState(index + 1);
    if (row > 0) toggleState(index - n);
    if (row < n - 1) toggleState(index + n);
    if (includeDiagonals) {
        if (row > 0 && col > 0) toggleState(index - n - 1);
        if (row > 0 && col < n - 1) toggleState(index - n + 1);
        if (row < n - 1 && col > 0) toggleState(index + n - 1);
        if (row < n - 1 && col < n - 1) toggleState(index + n + 1);
    }
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

function updateSettings() {
    n = parseInt(document.getElementById('gridSize').value);
    m = parseInt(document.getElementById('numStates').value);
    includeDiagonals = document.getElementById('diagonals').checked;
    colorScheme = document.getElementById('colorScheme').value;
    colors = colorSchemes[colorScheme]; // Update colors based on selected scheme
    initializeGrid();
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

