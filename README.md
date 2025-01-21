# node-record-lpcm-16

Records a 16-bit signed-integer linear pulse modulation code WAV audio file.

This module uses Node.js streams to minimize memory usage and optimize speed, perfect for embedded devices and "the internet of things".

These audio files are fully compatible with both the [Google Speech to Text API (v2)](https://github.com/gillesdemey/google-speech-v2) and the [Wit.ai Speech API](https://wit.ai/docs/api#span-classtitle-verb-postspeech).

## Installation

`npm install node-record-lpcm16`

## Dependencies

Generally, running `npm install` should suffice.

This module requires you to install [SoX](http://sox.sourceforge.net) and it must be available in your `$PATH`.

### For Mac OS
`brew install sox`

### For most linux disto's
`sudo apt-get install sox libsox-fmt-all`

### For Windows
Working version for Windows is 14.4.1. You can [download the binaries](https://sourceforge.net/projects/sox/files/sox/14.4.1/) or use [chocolately](https://chocolatey.org/install) to install the package

`choco install sox.portable`

## Options

```
sampleRate            : 16000  // audio sample rate
channels              : 1      // number of channels
threshold             : 0.5    // silence threshold (rec only)
endOnSilence          : false  // automatically end on silence (if supported)
thresholdStart        : null   // silence threshold to start recording, overrides threshold (rec only)
thresholdEnd          : null   // silence threshold to end recording, overrides threshold (rec only)
silence               : '1.0'  // seconds of silence before ending
recorder              : 'sox'  // Defaults to 'sox'
device                : null   // recording device (e.g.: 'plughw:1')
audioType             : 'wav'  // audio type to record
```

> Please note that `arecord` might not work on all operating systems. If you can't capture any sound with `arecord`, try to change device (`arecord -l`).

## Usage

```typescript
import recorder from 'node-record-lpcm16-v2'
import fs from 'fs'

const file = fs.createWriteStream('test.wav', { encoding: 'binary' })

new Recorder({
  sampleRate: 44100
})
.stream()
.pipe(file)
```

You can pause, resume and stop the recording manually.

```javascript
import recorder from 'node-record-lpcm16-v2'
import fs from 'fs'

const file = fs.createWriteStream('test.wav', { encoding: 'binary' })

const recording = new Recorder({
  //... options
})
recording.stream().pipe(file)

// Pause recording after one second
setTimeout(() => {
  recording.pause()
}, 1000)

// Resume another second later
setTimeout(() => {
  recording.resume()
}, 2000)

// Stop recording after three seconds
setTimeout(() => {
  recording.stop()
}, 3000)
```

## Recorders

The following recorders are included:

* rec
* sox
* arecord

**Note:** not all recorders support all features!

## Error handling

Some recorders might be logging errors to `stderr` and throw an exit code.
You can catch early termination by adding an error event listener to the stream.

To debug the recorder see [debugging](#debugging) below.

```javascript
recording.stream()
  .on('error', err => {
    console.error('recorder threw an error:', err)
  })
  .pipe(file)
```

## Debugging

Debug logging is implemented with [visionmedia/debug](https://github.com/visionmedia/debug)

`DEBUG=record node examples/file.js`

## Using with Electron (Avaible in v2)

You can use `extraResources` with Electron to store sox or other recording libraries. Then add options cmd as the path of the installed recorder in Electron.

### Example

```typescript
const appPath = app.getAppPath();
const resourcesPath = process.resourcesPath;

const soxPaths = {
  win: path.join(resourcesPath, "extraResources", "sox/win32/sox.exe"),
};

let cmd = "sox";
if (process.platform === "win32") {
  cmd = soxPaths.win;
}

const recording = new Recorder({
  cmd: cmd
})

// you can add other platforms as well

```