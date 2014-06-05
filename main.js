var router      = require("./core/Router").Router,
	Application = require("./core/Application").Application,
	PostsApplication,
	PostModel,
	app;

router.connect("/", {
	"controller": "posts",
	"action": "index"
});

/*
var View = function(target, dispatcher) {
	dispatcher.addEventListener('show-view', function(event) {
		var isCurrentView = target.className.indexOf(event.params) !== -1;
		target.style.display = isCurrentView ? 'block' : 'none';
	});
}

var Application = soma.Application.extend({
	init: function() {
		// create the Director router and make it available through the framework
		this.injector.mapValue('router', new Router());
		// create mediators for the views (DOM Element)
		this.mediators.create(View, document.querySelectorAll('.view'))
	},
	start: function() {
		// instantiate Navigation to start the app
		this.injector.createInstance(Navigation);
	}
});

// function model containing data (text to display)
var Model = function () {
	this.data = "Hello world!"
};

// function template that will update the DOM
var Template = function(template, scope, element, model) {
	scope.content = model.data;
	template.render();
};
*/

PostsApplication = {
	start: function () {
		var controller,
			model,
			viewcontroller,
			view;

		model = {
			_data: {'foo': 'bar'},
			getData: function () {
				return this._data;
			}
		};

		controller = {
			view: null,
			model: null,
			initialize: function () {
				this._setModel(model);
				this._setView(view);
			},
			_setView: function (view) {
				this.view = view;
			},
			_setModel: function (model) {
				this.model = model;
			},
			_set: function (data) {
				this.view.set("data", data);
			},
			set: function (data) {
				this._set(data);
			},
			action: function () {
				this.initialize();
				this.set(this.model.getData());
			}
		};

		viewcontroller = {
			views: [],
			control: {
				span: {
					click: 'info'
				}
			},
			addView: function (view) {
				this.views.push(view);
			},
			registerEvents: function () {
				var control = this.control;
				// get views
				this.views.forEach(function (view) {
					Object.keys(control).forEach(function (selector) {
						Object.keys(control[selector]).forEach( function (eventType) {
							var handler = control[selector][eventType];
							view.getNode()[0].querySelectorAll(selector)[0].addEventListener(eventType, this[handler].bind(this));
						}, this);
					}, this);
				}, this);
			},
			info: function (event) {
				console.info('info dispatched');
			}
		};

		view = {
			data: {},
			domNode: null,
			set: function (key, value) {
				this[key] = value;
			},
			getNode: function () {
				return this.domNode;
			},
			_render: function () {
				var docfrag = document.createDocumentFragment(),
					div = document.createElement('div'),
					span = document.createElement('span');
				div.className = 'coventView';
				span.innerHTML = 'foo => ' + this.data.foo;
				div.appendChild(span);
				docfrag.appendChild(div);
				document.body.appendChild(docfrag);
				this.domNode = document.querySelectorAll('.coventView');
			},
			render: function () {
				console.info('view render');
				this._render();
			}
		};

		controller.action();
		view.render();
		viewcontroller.addView(view);
		viewcontroller.registerEvents();
	}
}

PostsApplication.start();
