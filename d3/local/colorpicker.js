(function() {
    var Event = YAHOO.util.Event, picker;

    Event.onDOMReady(function() {			
        picker = new YAHOO.widget.ColorPicker("colorPane", {
                showhsvcontrols: true,
                showhexcontrols: true,
				images: {
					PICKER_THUMB: "images/picker_thumb.png",
					HUE_THUMB: "images/hue_thumb.png"
				}
            });			
    });
})();







