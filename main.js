var router      = require("./core/Router").Router,
	Application = require("./core/Application").Application,
	viewPostsIndexTemplate = require('./app/Views/Posts/index.html'),
	PostsApplication,
	PostModel,
	app;

router.connect("/", {
	"controller": "posts",
	"action": "index"
});

PostsApplication = {
	start: function () {
		var controller,
			model,
			viewcontroller,
			view;

		model = {
			_data: {'foo': 'Click me!'},
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
			},
			showAll: function () {
				this.set(this.model.getData());
			},
			showActive: function () {
				var data = this.model.findByCompleted('false');
				this.set(data);
			}
		};

		viewcontroller = {
			views: [],
			control: {
				'#new-todo': {
					change: 'addNew'
				}
			},
			addView: function (view) {
				this.views.push(view);
			},
			registerEvents: function () {
				var control = this.control,
					_this = this;
				// get views
				this.views.forEach(function (view) {
					Object.keys(control).forEach(function (selector) {
						Object.keys(control[selector]).forEach( function (eventType) {
							var handler = control[selector][eventType];
							view.getNode()[0].querySelectorAll(selector)[0].addEventListener(eventType, _this[handler].bind(_this));
						});
					});
				});
			},
			addNew: function (event) {
				console.info('info dispatched');
				var newTodo = event.target.value;
			},
			newTodo: function (title) {
				that.addItem(title);
			},
			itemEdit: function (item) {
				that.editItem(item.id);
			},
			itemEditDone: function (item) {
				that.editItemSave(item.id, item.title);
			},
			itemEditCancel: function (item) {
				that.editItemCancel(item.id);
			},
			itemRemove: function (item) {
				that.removeItem(item.id);
			},
			itemToggle: function (item) {
				that.toggleComplete(item.id, item.completed);
			},
			removeCompleted: function () {
				that.removeCompletedItems();
			},
			toggleAll: function (status) {
				that.toggleAll(status.completed);
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
				// inject template
				div.innerHTML = viewPostsIndexTemplate;
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
