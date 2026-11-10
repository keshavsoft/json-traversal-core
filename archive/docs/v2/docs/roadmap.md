# Roadmap

The project should grow in small, testable steps.

## Step 1 — finalize the traversal contract

Decide and document:
- Whether the root node is reported.
- Callback argument order.
- How object keys and array indexes appear in paths.
- Whether primitive root values are supported.
- Whether callbacks run before or after descending into children.

## Step 2 — make traversal reliable

Add tests for:
- Nested objects.
- Arrays of primitives.
- Arrays of objects.
- Objects containing arrays.
- Nested arrays.
- Empty objects and arrays.
- Mixed structures several levels deep.

The traversal core should not depend on Node filesystem APIs.

## Step 3 — make folder generation a separate consumer

Read a JSON file, invoke the traversal engine, and create one directory for each key/index according to the agreed rules.

Use a predictable output directory such as `test/v3/generated/`. Use recursive directory creation so repeated runs are safe.

## Step 4 — explore API structure generation

Use an API-definition JSON document as the source of truth for the desired project structure.

For example:

```text
api
└── v1
    └── clinics
        └── all
```

The traversal engine can supply the visited paths. A separate generator can decide which paths become directories and which terminal nodes become files.

## Step 5 — add instruction-driven implementation

Only after structure generation is stable, explore a second stage that reads implementation instructions and places content into selected generated files.

Keep these responsibilities separate:

1. API definition — declares the structure.
2. Traversal core — visits the JSON tree.
3. Structure generator — creates folders and files.
4. Instruction processor — inserts or updates implementation content.

This is the longer-term direction, not part of the current traversal core.
