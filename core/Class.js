var MetaObjectPrototype = {
  create: function () {
    var instance = Object.create(this.prototype);
    Object.defineProperty(instance, 'constructor', {
      value: this
    });
    if (instance.initialize) {
      instance.initialize.apply(instance, arguments);
    }
    return instance;
  },
  defineMethod: function (name, body) {
    this.prototype[name] = body;
    return this;
  },
  initialize: function (superclass) {
    if (superclass != null && superclass.prototype != null) {
      this.prototype = Object.create(superclass.prototype);
    }
    else this.prototype = Object.create(null);
  }
};

var MetaClass = {
  create: function () {
    var klass = Object.create(this.prototype);
    Object.defineProperty(klass, 'constructor', {
      value: this
    });
    if (klass.initialize) {
      klass.initialize.apply(klass, arguments);
    }
    return klass;
  },
  prototype: MetaObjectPrototype
};

exports.Class = MetaClass.create(MetaClass);
