<p align="center">
    <img src="./assets/1280px-Scissors_icon_black.svg.png" height="150">
</p>

<h1 align="center">yt-scissors</h1>


A simple api that allows you to divide a YouTube video into multiple separate videos base on a video's time stamps.


## Features

> **Important** : You must either have the video already downloaded or have a Buffer of the video for this api to work.

- Can generate time codes from a YouTube video's chapters, comment, or description
- Built on top of ffmpeg
- Will automatically download ffmpeg for your current operating system
- Can generate either a whole folder of videos or extracte a single video from a YouTube video 


## Install

```console 
npm install yt-scissors
```

## Example / Usage

```js
const { getTimeStampList, cutVideo } = require('yt-scissors');
const fs = require('fs');

async function main() {

    // == Different Videos == 
    // Chapters: "https://www.youtube.com/watch?v=iPtPo8Sa3NE"
    // Comment: "https://www.youtube.com/watch?v=89UEYbkHKvg&lc=UgzcUK560Nm4FAxF8-d4AaABAg"
    // Description: "https://www.youtube.com/watch?v=GdzrrWA8e7A"

    let list = await getTimeStampList({ url: "https://www.youtube.com/watch?v=iPtPo8Sa3NE", type: "chapters" });
    
    //Will output a array of time codes and video titles
    console.log(list);

    //Will generate a video from the 5th video in the array
    let chapter_videos = await cutVideo({
        video: Buffer.from(fs.readFileSync("./Death Grips - Exmilitary [Full Mixtape].mp4")),
        // ffmpegPath: "", (Give it a path to your ffmpeg executable)
        DisableDownloadLogs: false,
        chapters: [list[4]],
        ffmpegOptions: {
            crf: "3"
        },
    });

    fs.writeFileSync("./test.mp4", chapter_videos[0].videoData);
}

main();
```


# API

"getTimeStampList" 
------------------

```js
getTimeStampList({url: String, type: "chapters" | "comment" | "description" })
```

`@param {String} url` - Url of YouTube video

`@param {"chapters" | "comment" | "description"} type` - The data you want to parse to get video time codes. **(default is "chapters")**

`@return {Promise<Array<ListVideo_Object>>}` - Returns array of start and end time for each chapter video. **Will return empty array if time code couldn't be generated.**


**What a object from the array will look like** 

```json
ListVideo_Object: {
    "title" -  {String} Title of the chapter,
    "start_time" - {String|Number} Start time code of the chapter,
    "end_time" - {String|Number} End time code of the chapter
}
```

**What Does it do?**

> **(Important)** Generated time codes from description and comment works about 90% of the time. Make sure video time codes are spaced out and have nothing that would make it hard to find the time codes. There is also a bug with any video that is +10 hours longs, so video length should be below 10 hours.

* Pick where to get video time codes and generate array from that.
* Can generate time codes from a video's chapters, comment, or description.


"cutVideo"
----------

```js
cutVideo ({
    video,
    ffmpegPath = undefined,
    chapters,
    DisableDownloadLogs = false,
    ffmpegOptions = {
        crf: "25",
        preset: "ultrafast",
        ffmpegCmds: undefined,
        ffmpegHide: false
    } })
```

`@param {String | Buffer} video` - Video path as a string or a buffer of the video

`@param {String} ffmpegPath` - Path to ffmpeg executable. If none is given then will automatically download ffmpeg. FFmpeg will be downloaded if variable is set to "undefined", "null", or  "". **(default is undefined)**

`@param {Boolean}  DisableDownloadLogs` - True = disable download logs, false = show download logs. **(default is false)**

`@param {Object} ffmpegOptions` - FFmpeg commands and options.

`@param {String}  ffmpegOptions.crf` - Quality of the video. Lower numbers the better looking the video. **(default is 25)**

`@param {String}  ffmpegOptions.preset` - Speed of encoding video. **(default is ultrafast)**

`@param {Array}  ffmpegOptions.ffmpegCmds` - Add any other ffmpeg commands as a array. Make sure they are String values.

`@param {Boolean}  ffmpegOptions.ffmpegHide` - Hide ffmpeg process from being shown in the terminal. **(default is false)**

`@returns {Promise<Array<SaveVideos_Object>>}` - Returns array object of videos. Videos are store as buffers.


**What a object from the array will look like** 

```json
SaveVideos_Object: {
    "title" -  {String} Title of the chapter,
    "videoData" - {Buffer} A buffer of the chapter video
}
```


**What does it do?**

> **(Important)** Cannot automatically download ffmpeg for MacOS. You have to download and add it yourself.

* Using FFmpeg, trims videos into different chapters and encodes theme base on the time codes given.
* Can automatically download ffmpeg for current operating system or you can manually install ffmpeg, and give the path to it.
* **Return** a array of videos with title and a buffer of the trim down video


# Helpful Infomation

How to find / get a YouTube comment url from a video : https://www.youtube.com/watch?v=PnmfkLiMLHs


# License
MIT
