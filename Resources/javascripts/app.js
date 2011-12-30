// Config
// ------------------------------------------------------------------------
var _minute = 60 * 1000;
var _stretchInterval = _minute * 0.1;

// Stretches array
// ------------------------------------------------------------------------
var _stretches = [
	{image:'arm_circles.png', desc:'arm circles'},
	{image:'arm_stretch.png', desc:'arm stretch'},
	{image:'back_stretch.png', desc:'back stretch'},
	{image:'calf_stretch.png', desc:'calf stretch'},
	{image:'elbow_press.png', desc:'elbow press'},
	{image:'finger_stretch.png', desc:'finger stretch'},
	{image:'head_tilt.png', desc:'head tilt'},
	{image:'shoulder_shrug.png', desc:'shoulder shrug'},
	{image:'shoulder_stretch.png', desc:'shoulder stretch'},
	{image:'wholearm_stretch.png', desc:'whole arm stretch'},
	{image:'wrist_warmup.png', desc:'wrist warmup'}
];
var _numStretches = _stretches.length;
var _curStretchIndex = Math.round( Math.random() * _numStretches );
var _stretchImg = $('img#stretch_img');
var _imgPath = 'images/stretch/';

var setCurStretch = function(){
	_stretchImg.attr( 'src', _imgPath + _stretches[_curStretchIndex].image );
};
setCurStretch();


// close app on ESC
// ------------------------------------------------------------------------
$(document).keyup(function(e) {
	if (e.keyCode == 27) { Titanium.App.exit(); }   // esc
});

// disable clicking and dragging image
// ------------------------------------------------------------------------
var recurseDisableImages = function ( elem ) {
	if( elem ) {
		// disable clicking/dragging
		if( elem.tagName && elem.tagName.toLowerCase() == 'img' ) {
			try {
				elem.onmousedown = function(e){ return false; };
				elem.onselectstart = function(){ return false; };
			} catch(err) {}
		}
		// loop through children and do the same
		if( elem.childNodes.length > 0 ){
			for( var i=0; i < elem.childNodes.length; i++ ) {
				this.recurseDisableImages( elem.childNodes[i] );
			}
		}
	}
};
recurseDisableImages( document.getElementById("outer") );

// update on interval
// ------------------------------------------------------------------------
var _timerInterval = null;
var _numStretchesIgnored = 0;
var _pingSound = Titanium.Media.createSound('app://sounds/ping.wav');
var _soundOn = localStorage.getItem('sound_enabled') || false;

var clearBadge = function() {
	_numStretchesIgnored = 0;
	Titanium.UI.setBadge('');
}

var setNewTimer = function( minutes ){
	// set correct highlight
	setTimeout(function(){
		for (var i=0; i < numIntervals; i++) {
			console.log('minutes = '+minutes);
			var label = intervalMenu.getItemAt(i).getLabel();
			if( parseInt( label.split(' ')[0] ) == minutes ) {
				intervalMenu.getItemAt(i).setState( true );
			} else {
				intervalMenu.getItemAt(i).setState( false );
			}
		};
	},10);
	
	// clear & kick off new timer
	_stretchInterval = _minute * minutes;
	if( _timerInterval ) clearInterval( _timerInterval );
	_timerInterval = setInterval(function(){
		// increment stretch
		_curStretchIndex++;
		if( _curStretchIndex >= _numStretches ) _curStretchIndex = 0;
		
		// update image
		setCurStretch();
		
		// increment ignored stretches and set badge
		_numStretchesIgnored++;
		Titanium.UI.setBadge( ''+_numStretchesIgnored );
		// Titanium.Media.beep();
		if( _soundOn ) _pingSound.play();
		
		// focus the window
		// Titanium.UI.getMainWindow().setTopMost();
		
		// clear the badge when clicked
		var notification = Titanium.Notification.createNotification({
			'title': "Stretch Time!",
			'message': "Perhaps you'd like to try a " + _stretches[_curStretchIndex].desc + '?',
			'timeout': 10,
			'callback': clearBadge,
			'icon': 'app://' + _imgPath + _stretches[_curStretchIndex].image
		});
		notification.show();
	},_stretchInterval);
};


// Listen for window focus event
// ------------------------------------------------------------------------
Titanium.API.addEventListener(Titanium.FOCUSED, function(event) {
	clearBadge();
});



// Build app menu
// ------------------------------------------------------------------------

// Create main menu
var mainMenu = Titanium.UI.createMenu();

// create interval setting
mainMenu.addItem("Interval");

var intervalMenu = Titanium.UI.createMenu();
for( var i=5; i < 40; i+=5 ){
	(function(){
		var minutes = i;
		intervalMenu.addItem(minutes+' minutes', function(){
			setNewTimer( minutes );
		});
	})();
}
mainMenu.getItemAt(0).setSubmenu(intervalMenu);

// Create sound menu with audio toggle
mainMenu.addItem("Sound");

var audioMenu = Titanium.UI.createMenu();
mainMenu.getItemAt(1).setSubmenu( audioMenu );
var checkItem = Titanium.UI.createCheckMenuItem("On", function() {
	_soundOn = !checkItem.getState();
	localStorage.setItem('sound_enabled', _soundOn);
});
// checkItem.setState(_soundOn);
audioMenu.appendItem(checkItem);

// Add main menu items 
Titanium.UI.setMenu(mainMenu);


// Retrieve settings
// ------------------------------------------------------------------------
if( localStorage.getItem('interval') == null ) {
	localStorage.setItem('interval', 5); 
} else {
	
}


// Kick off initial timer
// ------------------------------------------------------------------------
setNewTimer( 15 );
