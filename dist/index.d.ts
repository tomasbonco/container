import 'reflect-metadata';
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
export declare class Container {
    static instance: Container;
    private instances;
    private parent;
    constructor();
    /**
     * Returns existing or a new instance of provided class and saves it into list of singletons.
     *
     * @param {any} key - class-like object (constructor) to make instance of
     * @returns {any} - instance of class provided
     */
    get(key: any): Promise<any>;
    /**
     * Adds instance into list of singletons.
     *
     * @param {any} key - constructor
     * @param {any} value - instance
     */
    set(key: any, value: any): any;
    /**
     * Returns true if for given constructor there is singleton defined under this container.
     *
     * @param {any} key - constructor
     * @returns {boolean} - true if singleton is set
     */
    has(key: any): boolean;
    /**
     * Removes singleton of given constructor from container.
     *
     * @param {any} key - constructor
     */
    drop(key: any): boolean;
    /**
     * Returns instance of given constructor defined under this container, if there is any.
     *
     * @param {any} key - constructor
     */
    getInstance(key: any): any;
    /**
     * Set this container as root. It will be available via static `Container.instance`.
     */
    setRoot(): void;
    /**
     * Returns true, if current container is root.
     *
     * @returns {boolean} - true, if current container is root.
     */
    isRoot(): boolean;
    /**
     * Set parent to this container.
     * Right now it is not used in resolving. But it is still useful, if you are creating smaller containers from master container.
     *
     * @param {Container} parentContainer - parent
     */
    setParent(parentContainer: Container): void;
    /**
     * Returns parent of current container.
     *
     * @returns {Container} - parent
     */
    getParent(): Container;
    /**
     * Returns instance of target, with dependecies resolved, but won't add it into list of singletons.
     *
     * @param {any} target - Class-like object (constructor) to make instance of
     * @returns {any} - instance
     */
    createInstance(target: any, args?: any[]): Promise<any>;
    destruct(): void;
}
export declare function inject(...dependecies: any[]): (target: any) => void;
export declare function autoinject(potentialTarget?: any): any;
export declare class Resolver {
    constructor();
    resolve(container: Container): any;
}
export declare class Instance extends Resolver {
    key: any;
    constructor(key: any);
    static of(key: any): Instance;
    resolve(container: Container): any;
}
export declare class Singleton extends Resolver {
    key: any;
    constructor(key: any);
    static of(key: any): Singleton;
    resolve(container: Container): any;
}
export declare class Parent extends Resolver {
    key: any;
    constructor(key: any);
    static of(key: any): Parent;
    resolve(container: Container): any;
}
