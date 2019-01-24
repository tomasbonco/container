"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
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
        return __awaiter(this, void 0, void 0, function () {
            var resolver, instance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resolver = (key instanceof Resolver) ? key : Singleton.of(key);
                        instance = resolver.resolve(this);
                        if (!!instance) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createInstance(key)];
                    case 1:
                        instance = _a.sent();
                        this.instances.set(key, instance);
                        _a.label = 2;
                    case 2: return [2 /*return*/, instance];
                }
            });
        });
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
    Container.prototype.createInstance = function (target, args) {
        if (args === void 0) { args = []; }
        return __awaiter(this, void 0, void 0, function () {
            var instance, dependencies, _i, _a, inject_1, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (typeof target !== 'function') {
                            console.log(target);
                            throw new Error('Container cannot make instance of non-function!');
                        }
                        dependencies = [];
                        if (!(target.__inject && Array.isArray(target.__inject))) return [3 /*break*/, 4];
                        _i = 0, _a = target.__inject;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        inject_1 = _a[_i];
                        _c = (_b = dependencies).push;
                        return [4 /*yield*/, this.get(inject_1)];
                    case 2:
                        _c.apply(_b, [_d.sent()]);
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        instance = new (target.bind.apply(target, [void 0].concat(dependencies, args)))();
                        if (!instance.onResolve) return [3 /*break*/, 6];
                        return [4 /*yield*/, instance.onResolve()];
                    case 5:
                        _d.sent();
                        _d.label = 6;
                    case 6: return [2 /*return*/, instance];
                }
            });
        });
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
exports.Resolver = Resolver;
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
