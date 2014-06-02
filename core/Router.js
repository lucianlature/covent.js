var dloc = document.location;

function dlocHashEmpty () {
	// Non-IE browsers return '' when the address bar shows '#'; Director's logic
	// assumes both mean empty.
	return dloc.hash === '' || dloc.hash === '#';
};

exports.Router = {
	connect: function (path, mapResources, options) {
		// do nothing yet
	}
};
