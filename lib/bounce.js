"use strict";
/**
 * @author     Carl Viktor Svensson
 * @license    Apache License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.bounce = exports.Bounce = void 0;
/**
 * Bounce.
 *
 * @template I Input type
 * @template O Output type
 */
class Bounce {
    /**
     * Creates an instance of bounce.
     *
     * @param modules
     */
    constructor(modules) {
        this.modules = modules;
    }
    /**
     * Invokes each bounce module sequentially, and returns
     * the final output. The output can then be restored using
     * the `restore()` method.
     *
     * @param input
     * @returns apply
     */
    apply(input) {
        let x = input;
        for (let i = 0; i < this.modules.length; i++) {
            x = this.modules[i].apply(x);
        }
        return x;
    }
    /**
     * Restores output previously transformed using `apply()`, by
     * calling each module that was used to transform the input in
     * reversed order.
     *
     * @param output
     * @returns restore
     */
    restore(output) {
        let x = output;
        for (let i = this.modules.length - 1; i >= 0; i--) {
            x = this.modules[i].restore(x);
        }
        return x;
    }
    /**
     * Creates a Bounce instance from the provided modules.
     *
     * @template I
     * @template O
     * @param modules
     * @returns create
     */
    static create(...modules) {
        for (const mod of modules) {
            if (typeof mod.apply !== "function" ||
                typeof mod.restore !== "function") {
                throw new Error(`A bounce module must implement an apply() and a restore() method.`);
            }
        }
        return new Bounce(modules);
    }
}
exports.Bounce = Bounce;
/**
 * Creates a Bounce instance from the provided modules.
 *
 * @export
 * @template I
 * @template O
 * @param modules
 * @returns
 */
function bounce(...modules) {
    return Bounce.create(...modules);
}
exports.bounce = bounce;
exports.default = bounce;
//# sourceMappingURL=bounce.js.map