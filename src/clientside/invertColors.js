javascript: (
    function() {
		var css = 
			`body {
				-webkit-filter: invert(100%);' 
            	'-moz-filter: invert(100%);' 
            	'-o-filter: invert(100%);' 
				'-ms-filter: invert(100%);' 
			}`,

            head = document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        if (!window.__invertCounter) {
            window.__invertCounter = 1;
        } else {
            window.__invertCounter++;
            if (window.__invertCounter % 2 == 0) {
                var css = `body {
							-webkit-filter: invert(0%);
							-moz-filter: invert(0%);
							-o-filter: invert(0%); 
							-ms-filter: invert(0%); 
						}`;
            }
        };

        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);
	}()
);