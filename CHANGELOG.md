# 1.4.1

- Fixed invalid moon `PATH`.

# 1.4.0

- Re-enabled the v1.3 release.
- Will now also install `proto` globally.
- Includes `.prototools` when hashing the cache key.

# 1.3.1

- Reverted previous release as it broke CI.

# 1.3.0

- Will now append `~/.proto/bin` to `PATH`, to make the moon toolchain available.
- Will now cache the `~/.proto/plugins` directory.

# 1.2.0

- Will only cache the `~/.proto/tools` toolchain. `~/.moon/tools` is no longer supported.
- Changed log warnings to info messages.

# 1.1.0

- Support moon v1.

# 1.0.0

- Initial release.
