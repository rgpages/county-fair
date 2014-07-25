$(document).ready(function() {
	
	// Setup button after load:
	var howler_instance_loaded = function(id) {
		
		//console.log('howler_instance_loaded', this, id);
		
		$('#' + id)
			.data('loaded', true) // Mark as loaded.
			.addClass('loaded')   // For toggle button.
			.children('.controller')
			.addClass('init paused')
			.click(function() {
				
				// Handle current button:
				$(this).toggleClass('paused playing');
				
				// Pause others:
				$('.controller.playing')
					.not($(this)) // ... Ignore the current button, as it's handled above.
					.removeClass('playing')
					.addClass('paused');
				
			});
		
	};
	
	// Singleton helper to build similar instances:
	var howler_instance_create = function(id, urls) {
		
		//console.log('howler_instance_create', id, urls);
		
		// Return new Howler insance:
		return new Howl({
			urls: urls,
			loop: true,
			volume: 0,
			onload: function() { howler_instance_loaded.call(this, id) } // Only show button after audio has loaded.
		});
		
	};
	
	// Add sounds to object for easy access later:
	var sounds = {
		'one'   : howler_instance_create('one',   ['media/audio/0001.mp3',     'media/audio/0001.ogg'     ]),
		'two'   : howler_instance_create('two',   ['media/audio/0002.mp3',     'media/audio/0002.ogg'     ]),
		'three' : howler_instance_create('three', ['media/audio/0003.mp3', 'media/audio/0003.ogg' ]),
		'four'  : howler_instance_create('four',  ['media/audio/0004.mp3',   'media/audio/0004.ogg'   ]),
		'five'   : howler_instance_create('five',   ['media/audio/0005.mp3',     'media/audio/0005.ogg'     ]),
		'six'   : howler_instance_create('six',   ['media/audio/0006.mp3',     'media/audio/0006.ogg'     ]),
		'seven' : howler_instance_create('seven', ['media/audio/0007.mp3', 'media/audio/0007.ogg' ]),
		'eight'  : howler_instance_create('eight',  ['media/audio/0008.mp3',   'media/audio/0008.ogg'   ]),
		'nine' : howler_instance_create('nine', ['media/audio/0009.mp3', 'media/audio/0009.ogg' ]),
		'ten'  : howler_instance_create('ten',  ['media/audio/0010.mp3',   'media/audio/0010.ogg'   ]),
		'eleven'  : howler_instance_create('eleven',  ['media/audio/0011.mp3',   'media/audio/0011.ogg'   ])//,
	};
	
	var stack = [];
	
	// Create button:
	$('<div>', {
		'class': 'controller' // The name "class" must be quoted in the object since it is a JavaScript reserved word.
	})
		// Append it to the container:
		.appendTo('.howler')
		// Setup click event:
		.on('click', function() {
			
			// Hoist and initialize:
			var $this = $(this);
			var current = $this.parent('div').attr('id');
			var last = (stack.length) ? stack[(stack.length - 1)] : '';
			var node;
			
			//console.log(current, last);
			
			// If it's the same clip, play/pause:
			if (current == last) {
				
				// https://github.com/goldfire/howler.js/issues/161
				node = sounds[last]._activeNode(); // Determine if playing or paused ...
				(node && ( ! node.paused)) ? sounds[last].pause() : sounds[last].play(); // No good reason to fade here.
				
			} else {
				
				// ... otherwise, stop the last audio clip:
				last.length && sounds[last].stop();
				
				sounds[current]
					.play(function() {
						stack.push(current); // Update history.
						//console.log(stack);
					})
					.fade(0, 1, 10000); // Fade works wll here.
				
			}
			
		});
	
});
