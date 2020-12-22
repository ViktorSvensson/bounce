# @floss/bounce

A simple module that lets you build chained encoder/decoder functions.

## Installation

```bash
npm install @floss/bounce
```

## Usage

As an example, we're going to construct a module that converts any input to JSON and then to base64.

**# 1:** Define two objects, each implementing an `apply()` and a `restore()` method. Basically, everything that `apply()` does is returned to its original state by `restore()`.

```javascript
const Base64Module = {
  // ascii -> base64
  apply: (input) => Buffer.from(input, "ascii").toString("base64"),
  // base64 -> ascii
  restore: (output) => Buffer.from(output, "base64").toString("ascii"),
}

const JsonModule = {
  // any -> json string
  apply: (input) => JSON.stringify(input),
  // json string -> any
  restore: (output) => JSON.parse(output),
}
```

**# 2:** Create a Bounce instance and try it out!

```javascript
const encoder = bounce(
  JsonModule, 
  Base64Module
);

const encoded = bounce.apply({hello: 10});
// => eyJoZWxsbyI6MTB9
const restored = bounce.restore(encoded);
// => {hello: 10}
```
