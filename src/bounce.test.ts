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

import B from ".";
import {Bounce, BounceModule} from "./bounce";
class Base64Module implements BounceModule {
  apply(input: string) {
    return Buffer.from(input, "ascii").toString("base64");
  }
  restore(output: string) {
    return Buffer.from(output, "base64").toString("ascii");
  }
}
const Base64ModuleObject: BounceModule = {
  apply: (input) => Buffer.from(input, "ascii").toString("base64"),
  restore: (output) => Buffer.from(output, "base64").toString("ascii"),
};
class JsonModule implements BounceModule {
  apply(input: any) {
    return JSON.stringify(input);
  }
  restore(output: string) {
    return JSON.parse(output);
  }
}
const JsonModuleObject: BounceModule = {
  apply: (input) => JSON.stringify(input),
  restore: (output) => JSON.parse(output),
};
describe("bounce", () => {
  test("should convert a string to/from base64", () => {
    const bounce = Bounce.create<string, string>(new Base64Module());
    const encoded = bounce.apply("hello");
    const restored = bounce.restore(encoded);
    expect(encoded).toEqual("aGVsbG8=");
    expect(restored).toEqual("hello");
  });
  test("should convert an object => json => b64", () => {
    const bounce = Bounce.create<{hello: number}, string>(
      new JsonModule(),
      new Base64Module()
    );
    const encoded = bounce.apply({hello: 10});
    const restored = bounce.restore(encoded);
    expect(encoded).toEqual("eyJoZWxsbyI6MTB9");
    expect(restored).toStrictEqual({hello: 10});
    console.dir(bounce);
  });
  test("should work using objects instead of classes", () => {
    const bounce = Bounce.create<{hi: number}, string>(
      JsonModuleObject,
      Base64ModuleObject
    );
    const encoded = bounce.apply({hi: 15});
    const restored = bounce.restore(encoded);
    expect(encoded).toEqual("eyJoaSI6MTV9");
    expect(restored).toStrictEqual({hi: 15});
  });
  test("should work via default export", () => {
    const bounce = B<{hola: number}, string>(
      JsonModuleObject,
      Base64ModuleObject
    );
    const encoded = bounce.apply({hola: 19});
    const restored = bounce.restore(encoded);
    expect(encoded).toEqual("eyJob2xhIjoxOX0=");
    expect(restored).toStrictEqual({hola: 19});
  });
});
