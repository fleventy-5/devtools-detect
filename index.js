/*!
devtools-detect
Detect if DevTools is open
https://github.com/sindresorhus/devtools-detect
By Sindre Sorhus
MIT License
*/
(function () {
	'use strict';

	const devtools = {
		isOpen: false,
		orientation: undefined
	};

	const threshold = 160;

	const emitEvent = (isOpen, orientation) => {
		window.dispatchEvent(new CustomEvent('devtoolschange', {
			detail: {
				isOpen,
				orientation
			}
		}));
	};

	// Function to check if the given device is a phone or ipad
	function isPhone() {
		return /android|ipad/i.test(navigator.userAgent);
	}

	// Check how long its takes for the given code to execute
	// It return a value after execution
	// If value is greater than 60 then dev tool is open
	// If value is less than 60 then dev tool is not open
	// Since the time to execute cosole.log takes longer when dev tool is open
	function checkPerformance() {
		const start = performance.now();
		for (let i = 0; i < 100; i++) {
			console.log();
			console.clear();
		}

		const end = performance.now();
		return (end - start);
	}

	const main = ({emitEvents = true} = {}) => {
		const widthThreshold = window.outerWidth - window.innerWidth > threshold;
		const heightThreshold = window.outerHeight - window.innerHeight > threshold;
		const orientation = widthThreshold ? 'vertical' : 'horizontal';

		if (!(heightThreshold && widthThreshold) && ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)) {
			if ((!devtools.isOpen || devtools.orientation !== orientation) && emitEvents) {
				emitEvent(true, orientation);
			}

			devtools.isOpen = true;
			devtools.orientation = orientation;
		} else if (isPhone()) {
			if (parseInt(checkPerformance(), 0) > 60) {
				if ((!devtools.isOpen || devtools.orientation !== orientation) && emitEvents) {
					emitEvent(true, '');
				}

				devtools.isOpen = true;
				devtools.orientation = '';
			} else {
				if (devtools.isOpen && emitEvents) {
					emitEvent(false, undefined);
				}

				devtools.isOpen = false;
				devtools.orientation = undefined;
			}
		} else {
			if (devtools.isOpen && emitEvents) {
				emitEvent(false, undefined);
			}

			devtools.isOpen = false;
			devtools.orientation = undefined;
		}
	};

	main({emitEvents: false});
	setInterval(main, 500);

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = devtools;
	} else {
		window.devtools = devtools;
	}
})();
