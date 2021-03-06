var router      = require('./core/Router').Router,
    Application = require('./core/Application').Application,
    utils       = require('./core/utils'),
    fluent      = require('allong.es').allong.es.fluent,
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

        baseModel = utils.encapsulate({
            initialize: function () {
                console.log('baseModel initialize');
                this._data = null;
                return this.self;
            },
            getData: function () {
                return this._data;
            },
            // setters return the object usually
            set: fluent(function (data) {
                this._data = data.Todo;
            })
        });

        var isSaveable = utils.encapsulate({
            initialize: function () {
                console.log('isSaveable initialize');
                return this.self;
            },
            save: function (data, callback) {
                this.setData(data);
                callback();
                return this.self;
            }
        });

        var composedModel = utils.composeMetaobjects(
            Object.create(baseModel),
            isSaveable,
            utils.encapsulate({
                notify: undefined,
                addSong: function () {
                    this.notify();
                }
            })
        );

        var model = Object.create(composedModel).initialize();

        controller = {
            view: null,
            model: null,
            layout: 'master',
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
                this.set({
                    Todo: {
                        id: null
                    }
                });
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
                    change: 'add'
                }
            },
            addView: function (view) {
                this.views.push(view);
            },
            registerModelBindings: function () {
                // do nothing yet
            },
            registerEvents: function () {
                var control = this.control,
                    _this = this;
                // get views
                this.views.forEach(function (view) {
                    Object.keys(control).forEach(function (selector) {
                        Object.keys(control[selector]).forEach( function (eventType) {
                            var handler = control[selector][eventType],
                                el = view.getNode()[0].querySelectorAll(selector)[0],
                                lookup = el.getAttribute("data-model-id"),
                                value = utils.deepFind(view, lookup);
                            el.addEventListener(eventType, _this[handler].bind(_this, value));
                        });
                    });
                });
            },
            add: function (id, event) {
                console.info('info dispatched');
                var value = event.target.value,
                    data = {
                        Todo: {
                            id: id,
                            title: value,
                            completed: false
                        }
                    };

                var todo = model.set(data);
                model.save(data, function () {
                    console.info('model saved!');
                    // view.update();
                });
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
