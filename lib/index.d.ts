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
/**
 * Bounce Module
 * @template I Input type
 * @template O Output type
 */
export interface BounceModule<I extends any = any, O extends any | I = any> {
    apply(input: I): O;
    restore(output: O): I;
}
/**
 * Bounce.
 *
 * @template I Input type
 * @template O Output type
 */
export declare class Bounce<I = any, O extends any = I> implements BounceModule<I, O> {
    protected readonly modules: BounceModule[];
    /**
     * Creates an instance of bounce.
     *
     * @param modules
     */
    protected constructor(modules: BounceModule[]);
    /**
     * Invokes each bounce module sequentially, and returns
     * the final output. The output can then be restored using
     * the `restore()` method.
     *
     * @param input
     * @returns apply
     */
    apply(input: I): O;
    /**
     * Restores output previously transformed using `apply()`, by
     * calling each module that was used to transform the input in
     * reversed order.
     *
     * @param output
     * @returns restore
     */
    restore(output: O): I;
    /**
     * Creates a Bounce instance from the provided modules.
     *
     * @template I
     * @template O
     * @param modules
     * @returns create
     */
    static create<I, O>(modules: BounceModule<I | unknown, O | unknown>[]): Bounce<I, O>;
}
/**
 * Creates a Bounce instance from the provided modules.
 *
 * @export
 * @template I
 * @template O
 * @param modules
 * @returns
 */
export declare function bounce<I, O>(modules: BounceModule<I | unknown, O | unknown>[]): Bounce<I, O>;
export default bounce;
