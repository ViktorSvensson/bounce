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
import {Bounce, BounceAction} from "./index";
class Base64Action {
  apply(value: string) {
    return Buffer.from(value, "utf8").toString("base64");
  }
  restore(value: string) {
    return Buffer.from(value, "base64").toString("utf8");
  }
}

class JsonAction {
  apply(value: any) {
    return JSON.stringify(value);
  }
  restore(value: string) {
    return JSON.parse(value);
  }
}
const Base64ActionObject: BounceAction = {
  apply: (value) => Buffer.from(value, "utf8").toString("base64"),
  restore: (value) => Buffer.from(value, "base64").toString("utf8"),
};
const JsonActionObject: BounceAction = {
  apply: (value) => JSON.stringify(value),
  restore: (value) => JSON.parse(value),
};
describe("bounce", () => {
  test("converts a string to/from base64", () => {
    const bounce = Bounce.create<string, string>([new Base64Action()]);
    const encoded = bounce.apply("hello");
    const restored = bounce.restore(encoded);
    expect(encoded).toEqual("aGVsbG8=");
    expect(restored).toEqual("hello");
  });
  test("converts an object => json => b64", () => {
    const bounce = Bounce.create([new JsonAction(), new Base64Action()]);
    const encoded = bounce.apply({hello: 10});
    const restored = bounce.restore(encoded);
    expect(encoded).toEqual("eyJoZWxsbyI6MTB9");
    expect(restored).toStrictEqual({hello: 10});
  });
  test("works using objects instead of classes", () => {
    const bounce = Bounce.create<{hi: number}, string>([
      JsonActionObject,
      Base64ActionObject,
    ]);
    const encoded = bounce.apply({hi: 15});
    const restored = bounce.restore(encoded);
    expect(encoded).toEqual("eyJoaSI6MTV9");
    expect(restored).toStrictEqual({hi: 15});
  });
  test("works via default export", () => {
    const bounce = B<{hola: number}, string>([
      JsonActionObject,
      Base64ActionObject,
    ]);
    const encoded = bounce.apply({hola: 19});
    const restored = bounce.restore(encoded);
    expect(encoded).toEqual("eyJob2xhIjoxOX0=");
    expect(restored).toStrictEqual({hola: 19});
  });
  test("can be used as map predicate", () => {
    const bounce = B<{hola: number}, string>([
      JsonActionObject,
      Base64ActionObject,
    ]);
    const encoded = [{hola: 19}].map(bounce.apply);
    const restored = encoded.map(bounce.restore);
    expect(encoded).toStrictEqual(["eyJob2xhIjoxOX0="]);
    expect(restored).toStrictEqual([{hola: 19}]);
  });
});
