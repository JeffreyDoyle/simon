var KEYS = ['c', 'd', 'e', 'f'];
var NOTE_DURATION = 1000;

// NoteBox
//
// Acts as an interface to the coloured note boxes on the page, exposing methods
// for playing audio, handling clicks,and enabling/disabling the note box.
function NoteBox(key, onClick) {
	// Create references to box element and audio element.
	var boxEl = document.getElementById(key);
	var audioEl = document.getElementById(key + '-audio');
	if (!boxEl) throw new Error('No NoteBox element with id' + key);
	if (!audioEl) throw new Error('No audio element with id' + key + '-audio');

	// When enabled, will call this.play() and this.onClick() when clicked.
	// Otherwise, clicking has no effect.
	var enabled = true;
	// Counter of how many play calls have been made without completing.
	// Ensures that consequent plays won't prematurely remove the active class.
	var playing = 0;

	this.boxEl = boxEl;
	this.key = key;
	this.onClick = onClick || function () {};

	// Plays the audio associated with this NoteBox
	this.play = function () {
		playing++;
		// Always play from the beginning of the file.
		audioEl.currentTime = 0;
		audioEl.play();

		// Set active class for NOTE_DURATION time
		boxEl.classList.add('active');
		setTimeout(function () {
			playing--
			if (!playing) {
				boxEl.classList.remove('active');
			}
		}, NOTE_DURATION)
	}

	// Enable this NoteBox
	this.enable = function () {
		enabled = true;
	}

	// Disable this NoteBox
	this.disable = function () {
		enabled = false;
	}

	// Call this NoteBox's clickHandler and play the note.
	this.clickHandler = function () {
		if (!enabled) return;

		this.onClick(this.key)
		this.play()



	}.bind(this)

	boxEl.addEventListener('mousedown', this.clickHandler);
}

// Example usage of NoteBox.
//
// This will create a map from key strings (i.e. 'c') to NoteBox objects so that
// clicking the corresponding boxes on the page will play the NoteBox's audio.
// It will also demonstrate programmatically playing notes by calling play directly.
var notes = {};

// I want to use an array.
var notesArray = [];

KEYS.forEach(function (key) {
	var box = new NoteBox(key);
	notes[key] = box
	notesArray.push(box);
});

// KEYS.concat(KEYS.slice().reverse()).forEach(function(key, i) {
// 	setTimeout(notes[key].play.bind(null, key), i * NOTE_DURATION);
// });


function SimonGame(notes) {

	// Are we currently in a game.
	var gameInSession = false;
	// The notes that will be used in this game.
	var gameNotes = [];
	// The index of the note in the game we're on.
	var noteCounter = 0;
	// Number of notes accumulator;
	var numberOfNotes = 0;

	this.startGame = () => {
        console.log('startGame');

		// Disable each notebox.
        notes.forEach(function(note) {
        	note.disable();
		});

		// Generates the first note for the game.
		this.generateNote();

		//Play the sequence of notes so far.
       	this.playSequence();

        // Enable each notebox.
        notes.forEach(function(note) {
            note.enable();
        });

		// The game is on.
		gameInSession = true;
	}

	this.nextLevel = () => {
        console.log('nextLevel');
        noteCounter = 0;
        // Disable each notebox.
        notes.forEach(function(note) {
            note.disable();
        });

        // Generates the first note for the game.
        this.generateNote();

        //Play the sequence of notes so far.
        this.playSequence();

        // Enable each notebox.
        notes.forEach(function(note) {
            note.enable();
        });
	}


	this.playSequence = () => {
        console.log('playSequence');
        for (var i = 0; i < numberOfNotes; i++) {
            setTimeout(gameNotes[i].play, i * NOTE_DURATION);
        }
	}

	this.generateNote = () => {
		console.log('generateNote');
        for (var i = 0; i < 1; i++) {
            gameNotes.push(notesArray[Math.floor(Math.random() * 3)]);
            numberOfNotes++;
        }
	}

	this.endGame = () => {
		console.log('endGame');
		// Reset the game.
		gameInSession = false;
        noteCounter = 0;
        numberOfNotes = 0;
        gameNotes = [];
	}

	this.clickHandler = (e) => {
		console.log('click', e);
		if (!e.target.id || e.target.id != gameNotes[noteCounter].key) {
			this.endGame();
		} else {
			gameNotes[noteCounter].play();
			noteCounter++;
			// Check if the user has beat this level.
			if (noteCounter === numberOfNotes) {
                this.nextLevel();
			}
		}
		console.log('cick', noteCounter, numberOfNotes);
	}

	notes.forEach((note) => {
		note.boxEl.addEventListener('mousedown', this.clickHandler);
	});
}

var game = new SimonGame(notesArray);
game.startGame();

