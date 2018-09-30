"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
/**
 * This is container manager inspirated by Aurelia's one. It works like a context, where all instances are
 * registred as singletons. Then it resolves dependecies and passes singletons to constructor.
 *
 * If you want to use it, just use @autoinject decorator on the class and inside constructor specify what
 * dependencies you want to use. Or in case you use Javascript set dependencies as static `__inject` field:
 *
 * ```
 * class MyClass
 * {
 * 		static __inject = [ MyOtherClass, SecondDependency ];
 * }
 * ```
 */
var Container = /** @class */ (function () {
    function Container() {
        this.instances = new Map();
        this.set(Container, this);
    }
    /**
     * Returns existing or a new instance of provided class and saves it into list of singletons.
     *
     * @param {any} key - class-like object (constructor) to make instance of
     * @returns {any} - instance of class provided
     */
    Container.prototype.get = function (key) {
        // Find instance in instance-map
        var resolver = (key instanceof Resolver) ? key : Singleton.of(key);
        var instance = resolver.resolve(this);
        // Create a new instance, if we haven't found one
        if (!instance) {
            instance = this.createInstance(key);
            this.instances.set(key, instance);
        }
        return instance;
    };
    /**
     * Adds instance into list of singletons.
     *
     * @param {any} key - constructor
     * @param {any} value - instance
     */
    Container.prototype.set = function (key, value) {
        this.instances.set(key, value);
        return value;
    };
    /**
     * Returns true if for given constructor there is singleton defined under this container.
     *
     * @param {any} key - constructor
     * @returns {boolean} - true if singleton is set
     */
    Container.prototype.has = function (key) {
        return this.instances.has(key);
    };
    /**
     * Removes singleton of given constructor from container.
     *
     * @param {any} key - constructor
     */
    Container.prototype.drop = function (key) {
        return this.instances.delete(key);
    };
    /**
     * Returns instance of given constructor defined under this container, if there is any.
     *
     * @param {any} key - constructor
     */
    Container.prototype.getInstance = function (key) {
        return this.instances.get(key);
    };
    /**
     * Set this container as root. It will be available via static `Container.instance`.
     */
    Container.prototype.setRoot = function () {
        Container.instance = this;
    };
    /**
     * Returns true, if current container is root.
     *
     * @returns {boolean} - true, if current container is root.
     */
    Container.prototype.isRoot = function () {
        return this === Container.instance;
    };
    /**
     * Set parent to this container.
     * Right now it is not used in resolving. But it is still useful, if you are creating smaller containers from master container.
     *
     * @param {Container} parentContainer - parent
     */
    Container.prototype.setParent = function (parentContainer) {
        this.parent = parentContainer;
    };
    /**
     * Returns parent of current container.
     *
     * @returns {Container} - parent
     */
    Container.prototype.getParent = function () {
        return this.parent;
    };
    /**
     * Returns instance of target, with dependecies resolved, but won't add it into list of singletons.
     *
     * @param {any} target - Class-like object (constructor) to make instance of
     * @returns {any} - instance
     */
    Container.prototype.createInstance = function (target) {
        var _this = this;
        var instance;
        if (typeof target !== 'function') {
            console.log(target);
            throw new Error('Container cannot make instance of non-function!');
        }
        try {
            var dependencies = [];
            if (target.__inject && Array.isArray(target.__inject)) {
                dependencies = target.__inject.map(function (x) { return _this.get(x); });
            }
            instance = new (target.bind.apply(target, [void 0].concat(dependencies)))();
        }
        catch (e) {
            if (e instanceof TypeError) {
                throw e;
            }
            console.log(e);
        }
        return instance;
    };
    Container.prototype.destruct = function () {
        this.instances.forEach(function (instance) { return instance.teardown ? instance.teardown() : undefined; });
    };
    Container.instance = undefined;
    return Container;
}());
exports.Container = Container;
function inject() {
    var dependecies = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        dependecies[_i] = arguments[_i];
    }
    return function (target) {
        target.__inject = dependecies;
    };
}
exports.inject = inject;
function autoinject(potentialTarget) {
    var deco = function (target) {
        var deps = Reflect['getOwnMetadata']('design:paramtypes', target) || {}; // generated by TypeScript
        target.__inject = deps;
    };
    return potentialTarget ? deco(potentialTarget) : deco;
}
exports.autoinject = autoinject;
var Resolver = /** @class */ (function () {
    function Resolver() {
    }
    Resolver.prototype.resolve = function (container) { };
    return Resolver;
}());
var Instance = /** @class */ (function (_super) {
    __extends(Instance, _super);
    function Instance(key) {
        var _this = _super.call(this) || this;
        _this.key = key;
        return _this;
    }
    Instance.of = function (key) {
        return new Instance(key);
    };
    Instance.prototype.resolve = function (container) {
        return container.createInstance(this.key);
    };
    return Instance;
}(Resolver));
exports.Instance = Instance;
var Singleton = /** @class */ (function (_super) {
    __extends(Singleton, _super);
    function Singleton(key) {
        var _this = _super.call(this) || this;
        _this.key = key;
        return _this;
    }
    Singleton.of = function (key) {
        return new Singleton(key);
    };
    Singleton.prototype.resolve = function (container) {
        return container.getInstance(this.key);
    };
    return Singleton;
}(Resolver));
exports.Singleton = Singleton;
var Parent = /** @class */ (function (_super) {
    __extends(Parent, _super);
    function Parent(key) {
        var _this = _super.call(this) || this;
        _this.key = key;
        return _this;
    }
    Parent.of = function (key) {
        return new Parent(key);
    };
    Parent.prototype.resolve = function (container) {
        var parent = container.getParent();
        if (!parent) {
            throw new Error("Parent container not specified!");
        }
        return parent.get(this.key);
    };
    return Parent;
}(Resolver));
exports.Parent = Parent;
