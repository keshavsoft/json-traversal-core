# Version history and current status

## V1 — initial traversal experiment

V1 introduced the split between:
- `index.js` — entry point.
- `ifObject.js` — object processing.
- `ifArray.js` — array processing.

The test input describes a small API hierarchy:

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

V1 is retained as the first experiment. Its array traversal and callback propagation are incomplete.

## V2 — path refinement and folder-generation experiment

V2 was introduced to refine path handling and demonstrate that traversal callbacks can drive another task: creating a directory tree from JSON keys.

The V2 test callback in `test/v2/index.js` uses Node's filesystem module to create directories. This keeps the side effect in the test/consumer rather than in the traversal core.

### Current V2 observations

The current V2 source is still a work in progress:

- The object traversal invokes the callback for object properties.
- Nested object paths are assembled relative to the root.
- The callback is not forwarded correctly when entering arrays.
- `ifArray.js` contains incorrect logic: it treats a boolean result as a function and refers to an undefined `key`.
- The folder test uses non-recursive `mkdirSync`, so repeated runs may fail when a directory already exists.
- The root package entry point and test import paths should be checked before publishing a working package.

Therefore, V2 should be described as an experiment, not as a fully tested general-purpose traversal engine.

## What must be true before V2 is considered stable

- Callback propagation works through every object and array branch.
- Array indexes are included in paths consistently.
- Nested arrays and objects inside arrays are covered.
- Re-running the folder-builder test does not fail because folders already exist.
- Tests assert the expected directory tree rather than relying only on console output.
