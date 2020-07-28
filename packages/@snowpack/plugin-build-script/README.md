# @snowpack/plugin-build-script

Plugin that replaces the old `build:*` scripts. Useful when loading a language Snowpack doesn’t support as a first-class citizen.

Usage:

```bash
npm install @snowpack/plugin-build-script
```

Then add the plugin to your Snowpack config:

```js
// snowpack.config.js

module.exports = {
  plugins: [
    [
      '@snowpack/plugin-build-script',
      {
        input: ['.tsx'], // files to watch
        output: ['.tsx'], // files to export
        cmd: 'babel --filename $FILE', // cmd to run
      }
    ]
  ]
}
```

## Plugin Options

| Name     |     Type    | Description                                                                 |
|:---------|:-----------:|:----------------------------------------------------------------------------|
| `input`  |  `string[]` | Array of extensions to watch for.                                           |
| `output` |  `string[]` | Array of extensions this plugin will output.                                |
| `cmd`    |  `string`   | Command to run on every file matching `input`. Accepts the `$FILE` env var. |
