var StretchTimer = (function(){
	// Config
	// ------------------------------------------------------------------------
	// timer vars
	var _minuteMillies = 60 * 1000,
		_timerInterval = null,
		_numStretchesIgnored = 0,
		_numIntervalOptions = 0,
		_intervalMenu = null,
	
	// App objects and vars
		_stretches = null,
		_numStretches = 0,
		_curStretchIndex = 0,
		_stretchImg = $('img#stretch_img'),
		_imgPath = 'images/stretch/',
		
	// audio vars
		_pingSound = Titanium.Media.createSound('app://sounds/ping.wav'),
	
	// constants
		TIMER_MINUTES = 'interval',
		AUDIO_ENABLED = 'audio_enabled';
		
	// Kick it off
	// ------------------------------------------------------------------------
	var init = function(){
		retrieveSettings();
		buildStretches();
		setCurStretch();
		buildMenu();
		disableImageDragging();
		bindKeys();
		bindAppEvents();
		
		// Kick off initial timer
		setNewTimer( parseInt( localStorage.getItem( TIMER_MINUTES ) ) );
	};
	
	// Retrieve stored settings or set defaults
	// ------------------------------------------------------------------------
	var retrieveSettings = function(){
		if( localStorage.getItem( TIMER_MINUTES ) == null ) localStorage.setItem( TIMER_MINUTES , 15); 
		if( localStorage.getItem( AUDIO_ENABLED ) == null ) localStorage.setItem( AUDIO_ENABLED , false); 
	};
	
	// Build stretches array
	// ------------------------------------------------------------------------
	var buildStretches = function(){
		_stretches = [
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
		_numStretches = _stretches.length;
		_curStretchIndex = Math.round( Math.random() * _numStretches );
	};
	
	
	// Update stretch image
	// ------------------------------------------------------------------------
	var setCurStretch = function(){
		_stretchImg.attr( 'src', _imgPath + _stretches[_curStretchIndex].image );
	};
	
	// Set up keyboard commands
	// ------------------------------------------------------------------------
	var bindKeys = function(){
		$(document).keyup(function(e) {
			// quit app on ESC
			if (e.keyCode == 27) { Titanium.App.exit(); }
		});
	};
	
	// Listen for Titanium app events
	// ------------------------------------------------------------------------
	var bindAppEvents = function(){
		// Listen for window focus event to clear the badge
		Titanium.API.addEventListener(Titanium.FOCUSED, function(event) {
			clearBadge();
		});
	};

	// Disable clicking and dragging image
	// ------------------------------------------------------------------------
	var disableImageDragging = function(){
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
						recurseDisableImages( elem.childNodes[i] );
					}
				}
			}
		};
		recurseDisableImages( $("div#outer")[0] );
	};
	
	// Clear the app badge in the dock
	// ------------------------------------------------------------------------	
	var clearBadge = function() {
		_numStretchesIgnored = 0;
		Titanium.UI.setBadge('');
	};
	
	// Set the checkbox state on the selected Interval menu item
	// ------------------------------------------------------------------------	
	var updateIntervalMenu = function( minutes ){
		setTimeout(function(){
			for (var i=0; i < _numIntervalOptions; i++) {
				var label = _intervalMenu.getItemAt(i).getLabel();
				if( parseInt( label.split(' ')[0] ) == minutes ) {
					_intervalMenu.getItemAt(i).setState( true );
				} else {
					_intervalMenu.getItemAt(i).setState( false );
				}
			};
		},10);	// has to happen just after the 'native' response of the checkbox or it gets cleared out
	};
		
	// Clear the timer and reset based on the new timer interval
	// ------------------------------------------------------------------------	
	var setNewTimer = function( minutes ){
		// store selection and update menu 
		updateIntervalMenu( minutes );
		// clear & kick off new timer
		if( _timerInterval ) clearInterval( _timerInterval );
		_timerInterval = setInterval(function(){
			incrementStretch();
		}, _minuteMillies * minutes );
	};

	// Increment the stretch
	// ------------------------------------------------------------------------
	var incrementStretch = function(){
		// increment stretch
		_curStretchIndex++;
		if( _curStretchIndex >= _numStretches ) _curStretchIndex = 0;
		
		// update image
		setCurStretch();
		
		// increment ignored stretches and set badge
		_numStretchesIgnored++;
		Titanium.UI.setBadge( ''+_numStretchesIgnored );
		// Titanium.Media.beep();
		if( localStorage.getItem( AUDIO_ENABLED ) == 'true' ) _pingSound.play();
		
		// clear the badge when clicked
		var notification = Titanium.Notification.createNotification({
			'title': "Stretch Time!",
			'message': "Perhaps you'd like to try a " + _stretches[_curStretchIndex].desc + '?',
			'timeout': 10,
			'callback': clearBadge,
			'icon': 'app://' + _imgPath + _stretches[_curStretchIndex].image
		});
		notification.show();
	};
	
	// Build app menu
	// ------------------------------------------------------------------------
	var buildMenu = function(){
		// Create main menu
		var mainMenu = Titanium.UI.createMenu();
		
		// create interval setting
		mainMenu.addItem("Interval");
		
		_intervalMenu = Titanium.UI.createMenu();
		for( var i=5; i < 40; i+=5 ){
			(function(){
				var minutes = i;
				_intervalMenu.appendItem( Titanium.UI.createCheckMenuItem(minutes+' minutes', function(){
					localStorage.setItem( TIMER_MINUTES, minutes );
					setNewTimer( minutes );
				}) );
			})();
			_numIntervalOptions++;
		}
		mainMenu.getItemAt(0).setSubmenu( _intervalMenu );
		
		// Create sound menu with audio toggle
		mainMenu.addItem("Sound");
		
		var audioMenu = Titanium.UI.createMenu();
		var checkItem = Titanium.UI.createCheckMenuItem("On", function() {
			var isSelected = !checkItem.getState();
			localStorage.setItem( AUDIO_ENABLED, isSelected );
		});
		mainMenu.getItemAt(1).setSubmenu( audioMenu );
		
		audioMenu.appendItem(checkItem);
		// Add main menu items 
		Titanium.UI.setMenu(mainMenu);
		
		// set checked state based on stored prefs
		( localStorage.getItem( AUDIO_ENABLED ) == 'true' ) ? checkItem.setState( true ) : checkItem.setState( false );
		updateIntervalMenu( parseInt( localStorage.getItem( TIMER_MINUTES ) ) );
	};
	
	init();
})();
