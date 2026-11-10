# JSON Traversal Core

> A reusable engine for walking through a JSON tree and calling your function as nodes are visited.

**JSON Traversal Core is about traversal, not JSONPath and not file generation.**

The idea is simple: provide a JSON value and a callback. The traversal engine walks through nested objects and arrays, while your callback decides what to do with each visited node.

The repository currently contains two evolving implementations:

- **V1** — the initial object/array traversal experiment.
- **V2** — an iteration exploring improved path construction and using traversal callbacks to create a matching folder tree.

V2 is still under development. Its current array handling and callback propagation need correction before it can be treated as a reliable general-purpose traversal engine.

---

## Why this project exists

A JSON document is already a tree:

```json
{
    "api": {
        "v1": {
            "clinics": {
                "all": "show"
            }
        }
    }
}
```

When the structure is known, a developer can access a value directly:

```js
const value = data.api.v1.clinics.all;
```

But sometimes we do not want to access only one known property. We want to walk the entire structure and perform an operation at every node.

Examples:

- Print every key, value, and path.
- Inspect or validate every node.
- Build a folder hierarchy from JSON keys.
- Later, generate files or connect implementation instructions to selected paths.

Instead of writing a new recursive loop for every task, this project explores one reusable traversal mechanism.

## The central idea

```text
JSON input
   |
   v
Traversal engine
   |
   +--> visits a node
   |       |
   |       +--> calls the supplied callback
   |
   +--> enters nested objects
   |
   +--> enters arrays
```

The traversal engine should know how to walk the JSON tree. It should not know whether the callback prints information, creates folders, validates data, or performs another task.

That separation is the foundation of this project.

## Intended usage

```js
import startFunc from "./src/v2/index.js";

const data = {
    api: {
        v1: {
            clinics: {
                all: "show"
            }
        }
    }
};

const visitNode = (key, value, path) => {
    console.log({ key, value, path });
};

startFunc(data, visitNode);
```

The callback receives information about each property visited. The exact path convention is being refined between versions; see [Version history](docs/versions.md).

## Folder-tree experiment

One concrete use case is turning every JSON key into a directory.

For the JSON above, the desired output is:

```text
generated/
└── api/
    └── v1/
        └── clinics/
            └── all/
```

The value `"show"` is not used to create a file. In this experiment, **keys become folders**.

The folder-generation callback is a consumer of the traversal engine. It is deliberately separate from the traversal core.

A complete implementation should:
1. Read a JSON input.
2. Traverse every object and array consistently.
3. Pass each node's key and complete path to the callback.
4. Create corresponding directories under a predictable `generated/` directory.
5. Be safe to run repeatedly by using recursive directory creation.

## JSONPath and traversal are different

JSONPath is a query language for selecting values from JSON. It is useful when you want to ask questions such as “find every node whose method is `GET`.”

This project has a different primary goal: **visit the tree and invoke a callback as traversal proceeds**.

| Need | Suitable approach |
|---|---|
| Read a known property such as `data.api.v1` | Direct JavaScript property access |
| Select nodes using query expressions | JSONPath |
| Visit every node and run custom logic | JSON traversal |
| Create folders from every key | Traversal plus a folder-generation callback |

JSONPath may be useful alongside this project in the future, but it is not required for recursive traversal.

## Current project layout

```text
json-traversal-core/
├── src/
│   ├── index.js
│   ├── v1/
│   │   ├── index.js
│   │   ├── ifObject.js
│   │   └── ifArray.js
│   └── v2/
│       ├── index.js
│       ├── ifObject.js
│       └── ifArray.js
├── test/
│   ├── v1/
│   │   └── data.json
│   └── v2/
│       ├── data.json
│       └── index.js
├── docs/
└── README.md
```

## Status

This repository is an active experiment, not yet a finished traversal package.

- V1 records the original approach.
- V2 explores improved path handling and a folder-generation use case.
- V2 still needs reliable callback propagation through arrays and nested arrays.
- Automated coverage for objects, arrays, mixed nesting, empty values, and repeatable folder creation is still needed.

See [Architecture](docs/architecture.md), [Version history](docs/versions.md), and [Roadmap](docs/roadmap.md).

## Design principles

1. **Generic core:** traversal must not depend on a specific application.
2. **Callback-driven:** the caller decides what to do with visited nodes.
3. **Complete paths:** each callback should receive an unambiguous path from the root.
4. **Objects and arrays:** both must be traversed, including mixed and deeply nested structures.
5. **No hidden side effects:** the core should not create files or folders itself.
6. **Incremental versions:** keep earlier experiments available while improving the next version.

## Longer-term direction

The motivating application is JSON-driven API generation. An API definition could become the single source of truth for a generated folder and file structure. A later instruction-processing stage could then populate selected files with implementation code.

That is a future consumer of this library—not a responsibility of the traversal core itself.

The immediate goal is smaller: make traversal predictable, testable, and reusable.
