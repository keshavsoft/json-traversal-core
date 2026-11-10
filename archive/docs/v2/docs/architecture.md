# Architecture

## Responsibility of the core

The traversal core has one job: walk a JSON value and report visited nodes to a caller-supplied callback.

It should not know about:
- Hono or HTTP endpoints.
- API route conventions.
- File templates or source-code generation.
- Folder creation.
- JSONPath query syntax.

Those are separate consumers or tools.

## Callback contract

The callback should receive enough context to make a decision without performing another traversal:

```js
visitNode(key, value, path);
```

Recommended meanings:

| Argument | Meaning |
|---|---|
| `key` | Property name, or array index for an array element |
| `value` | Value associated with the property or array element |
| `path` | Full path from the traversal root to that node |

The exact callback contract should be finalized before adding more consumers. In particular, decide whether the root itself is reported and how array indexes appear in paths.

## Example tree

Input:

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

A traversal should visit the following property paths:

```text
api
api.v1
api.v1.clinics
api.v1.clinics.all
```

## Separation of concerns

```text
                  JSON value
                      |
                      v
              Traversal engine
                      |
               callback events
                      |
          +-----------+-----------+
          |           |           |
          v           v           v
       Logger     Validator   Folder builder
                                (consumer)
```

The traversal engine emits information. A consumer decides what action to take.

## Folder builder as a consumer

For the API tree above, a folder-builder callback can map the paths to:

```text
generated/api/v1/clinics/all/
```

This is an example application of traversal. It should remain outside the generic traversal modules.

## Objects and arrays

A correct implementation must handle all of these:

- Object containing an object.
- Object containing an array.
- Array containing primitive values.
- Array containing objects.
- Object containing an array of objects that contain further arrays.
- Empty objects and arrays.
- Primitive root values, if those are supported by the chosen contract.

Array indexes need a documented path representation, for example `items.0.name` or `items[0].name`. Choose one convention and use it consistently.
