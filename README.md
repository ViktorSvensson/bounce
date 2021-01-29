# @floss/bounce

An implementation of the _command design pattern_. Takes an arbitrary list of undoable actions and combines them into one undoable action.

## Installation

```bash
yarn add @floss/bounce
```

```bash
npm install @floss/bounce
```

## Usage

```javascript
import bounce from "@floss/bounce";
const action = bounce([
  {
    apply: (x) => x + 1,
    restore: (y) => y - 1,
  },
  {
    apply: (x) => x * 2,
    restore: (y) => y / 2,
  },
]);
console.log(action.apply(1)); // => 4
console.log(action.restore(4)); // => 1
```

## Example

We're going to construct a module that converts any input to to base64.

**# 1:** Define two objects, each implementing an `apply()` and a `restore()` method. Anything that `apply()` does must be undone by `restore()`.

```javascript
const ToJson = {
  apply: (value) => JSON.stringify(value),
  restore: (value) => JSON.parse(value),
};
const ToBase64 = {
  apply: (value) => Buffer.from(value, "utf8").toString("base64"),
  restore: (value) => Buffer.from(value, "base64").toString("utf8"),
};
```

**# 2:** Create a Bounce instance and try it out!

```javascript
const encoder = bounce([ToJson, ToBase64]);

const encoded = bounce.apply({hello: 10});
// => eyJoZWxsbyI6MTB9
const restored = bounce.restore(encoded);
// => {hello: 10}
```
