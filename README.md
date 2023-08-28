<h1 align="center">Welcome to sgdk-video-player 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/haroldo-ok/sgdk-video-player#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/haroldo-ok/sgdk-video-player/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/haroldo-ok/sgdk-video-player/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/haroldo-ok/sgdk-video-player" />
  </a>
  <a href="https://twitter.com/Haroldo0k" target="_blank">
    <img alt="Twitter: Haroldo0k" src="https://img.shields.io/twitter/follow/Haroldo0k.svg?style=social" />
  </a>
</p>

> A video converter/video player for SGDK 

*(Work-In-Progress: the converter is done, but it is still missing a C library to make it easier to play on SGDK)*

### 🏠 [Homepage](https://github.com/haroldo-ok/sgdk-video-player#readme)

## Install

```sh
npm install -g sgdk-video-player
```

## Using the converter

```sh
sgdk-video-player convert <src> <resDir>

Converts a video file and outputs the result in the resource directory

Positionals:
  src     The source video, the one that will be converted   [string] [required]
  resDir  The resource directory, where the generated sources will be placed.
                                                             [string] [required]

Options:
  --version                Show version number                         [boolean]
  --imagemagick-dir, --kd  Directory where ImageMagick is located       [string]
  --help                   Show help                                   [boolean]
  --cpu-cores              Number of CPU cores to use. If ommited, will use all
                           of them.
  --alias                  Alias to use when generating the C constants. If
                           ommited, it will be generated from <src>.    [string]
```

## Using the video player

The video player is on the `lib/` folder. You can copy it to your SGDK project.

## Author

👤 **Haroldo O. Pinheiro**

* Website: https://haroldo-ok.itch.io/
* Twitter: [@Haroldo0k](https://twitter.com/Haroldo0k)
* Github: [@haroldo-ok](https://github.com/haroldo-ok)
* LinkedIn: [@haroldo-ok](https://linkedin.com/in/haroldo-ok)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/haroldo-ok/sgdk-video-player/issues). You can also take a look at the [contributing guide](https://github.com/haroldo-ok/sgdk-video-player/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2023 [Haroldo O. Pinheiro](https://github.com/haroldo-ok).<br />
This project is [MIT](https://github.com/haroldo-ok/sgdk-video-player/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_