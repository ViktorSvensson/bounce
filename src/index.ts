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
 * Bounce Action
 * @template I Input type
 * @template O Output type
 */
export interface BounceAction<I extends any = any, O extends any | I = any> {
  apply(input: I): O;
  restore(output: O): I;
}

/**
 * Bounce.
 *
 * @template I Input type
 * @template O Output type
 */
export class Bounce<I = any, O extends any = I> implements BounceAction<I, O> {
  /**
   * Creates an instance of bounce.
   *
   * @param actions
   */
  constructor(protected readonly actions: BounceAction[]) {}

  /**
   * Invokes each bounce module sequentially, and returns
   * the final output. The output can then be restored using
   * the `restore()` method.
   *
   * @param input
   * @returns apply
   */
  public apply(input: I): O {
    let x: I | O = input;
    for (let i = 0; i < this.actions.length; i++) {
      x = this.actions[i].apply(x as I) as O;
    }
    return (x as unknown) as O;
  }

  /**
   * Restores output previously transformed using `apply()`, by
   * calling each module that was used to transform the input in
   * reversed order.
   *
   * @param output
   * @returns restore
   */
  public restore(output: O): I {
    let x: O | I = output;
    for (let i = this.actions.length - 1; i >= 0; i--) {
      x = this.actions[i].restore(x as O) as I;
    }
    return (x as unknown) as I;
  }

  /**
   * Creates a Bounce instance from the provided modules.
   *
   * @template I
   * @template O
   * @param modules
   * @returns
   */
  public static create<I, O>(
    modules: BounceAction<I | unknown, O | unknown>[]
  ): Bounce<I, O> {
    for (const mod of modules) {
      if (
        typeof mod.apply !== "function" ||
        typeof mod.restore !== "function"
      ) {
        throw new Error(
          `A bounce module must implement an apply() and a restore() method.`
        );
      }
    }
    return new Bounce(modules);
  }
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
export function bounce<I, O>(
  modules: BounceAction<I | unknown, O | unknown>[]
) {
  return Bounce.create<I, O>(modules);
}

export default bounce;
