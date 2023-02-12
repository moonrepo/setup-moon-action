# moon - Setup toolchain

???

## Installation

```yaml
# ...
jobs:
  ci:
    name: CI
    runs-on: ubuntu-latest
    steps:
      - uses: moonrepo/setup-moon-action@v1
      - run: moon ci
```

## Inputs

- `version` - Version of moon to explicitly install. Defaults to "latest".
