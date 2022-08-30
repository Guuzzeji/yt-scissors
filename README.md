<p align="center">
    <img src="./assets/logo-upscale.jpeg" height="100%">
</p>

<h1 align="center">YouTube-Scissors</h1>

A simple npm library that allows you to divide a YouTube video into multiple separate videos base on a video's time stamps. Built on top of FFmpeg and JavaScript.

If you are looking for a CLI version of this library look [here](https://github.com/Guuzzeji/youtube-scissors-cli).

## 💡 Features

- Can generate multiple videos or extract a single video, based on a YouTube video's time stamps (time stamps from a comment, video description, or chapters)
  - **Important:** For this library to work, you must either have the YouTube video already downloaded or have a Buffer of the YouTube video
  
  - **Note:** For comments, follow this [tutorial](https://www.youtube.com/watch?v=PnmfkLiMLHs) to figure out how to get a YouTube comment's URL.

- Will automatically download ffmpeg for your current operating system
  - **Note:** Cannot automatically download ffmpeg for MacOS. You have to download and add it yourself. [FFmpeg Downloads]( https://ffmpeg.org/download.html)

- Can generate time stamps from a YouTube video's chapters, comment, or description.

- You can use this libary on top of any YouTube download libary / API.

- 100% Open Source (MIT license)

## 🚀 Install

```console 
npm install yt-scissors
```

## Example & Usage

```js
const { getTimeStampList, cutVideo } = require('yt-scissors');
const fs = require('fs');

async function main() {

    // == Different Videos == 
    // Chapters: "https://www.youtube.com/watch?v=iPtPo8Sa3NE"
    // Comment: "https://www.youtube.com/watch?v=89UEYbkHKvg&lc=UgzcUK560Nm4FAxF8-d4AaABAg"
    // Description: "https://www.youtube.com/watch?v=GdzrrWA8e7A"

    let list = await getTimeStampList({ 
        url: "https://www.youtube.com/watch?v=iPtPo8Sa3NE", 
        type: "chapters" });
    
    //Will output a array of time stamps and video titles
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
<br>

# 📖 API Documentation

<br>

## getTimeStampList(...)

**Description:**
>**Important:** Generated time stamps from the description and comments works about 85% of the time. Make sure the video's time stamps are spaced out and have nothing that would make it hard to find them. There is also a bug with any video that is +10 hours long, so video length should be below 10 hours.

* Picks where to get video time stamps and generate array of time stamps from that.
  
* Can generate time stamps from a video's chapters, comment, or description.

* **Returns** an array of start and end time for each chapter video. 

```js
// getTimeStampList(...) all default values
getTimeStampList({
    url: String,
    type: "chapters" | "comment" | "description" // default is "chapters"  
})
```

| Required      | Name | Data Type | Description |
| ----------- | ----------- | ----------- | ----------- 
| Yes      | url       | String | URL of YouTube video
| Yes      | type        | "chapters" or "comment" or "description" | The data you want to parse to get video time stamps. **(default is "chapters")**

### Returns { Promise<Array<ListVideo_Object>> }

- Returns an array of start and end time for each chapter video. 

- **Note:** Will return a empty array if time stamps couldn't be generated

**ListVideo_Object Example:** 
```js
"ListVideo_Object": {
    title: "{String}", // Title of the chapter
    start_time: "{String or Number}", // Start time stamps of the chapter
    end_time: "{String or Number}" // End time stamps of the chapter
}
```
<br>

## cutVideo(...)

**Description:**
> **Important:** Cannot automatically download ffmpeg for MacOS. You have to download and add it yourself. [FFmpeg Downloads]( https://ffmpeg.org/download.html)

* Using FFmpeg, trims videos into different chapters and encodes theme base on the time stamps given.
  
* Can automatically download ffmpeg for current operating system, or you can manually install ffmpeg, and give the path to it.
  
* **Returns** an array of videos with title and a buffer of the trim down video

```js
// cutVideo(...) all default values
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

| Required      | Name        | Data Type   | Description
| ----------- | ----------- | ----------- | ----------- |
| Yes      | video       | String or Buffer | Video path as a string or a buffer of the video
| No      | ffmpegPath     | String | Path to ffmpeg executable. If none is given then will automatically download ffmpeg. FFmpeg will be downloaded if variable is set to undefined, null, or you don't pass in a string path. **(default is undefined)**
| Yes      | chapters       | Array<ListVideo_Object>| List of chapters you want to extract from original video get this from getVideoList(...) function
| No   | DisableDownloadLogs | Boolean | True = disable download logs, false = show download logs. **(default is false)**
| No    | ffmpegOptions | Object | FFmpeg commands and options.
| No    | ffmpegOptions.crf | String | Quality of the video. Lower numbers the better looking the video. **(default is 25)**
| No    | ffmpegOptions.preset | String | Speed of encoding video. **(default is ultrafast)**
| No    | ffmpegOptions.ffmpegCmds | Array | Add any other ffmpeg commands as a array. Make sure they are String values.
| No    | ffmpegOptions.ffmpegHide | Boolean | Hide ffmpeg process from being shown in the terminal. **(default is false)**

### Returns { Promise<Array<SaveVideos_Object>> }
- Returns an array object of videos. Videos are store as buffers.

**SaveVideos_Object Example:** 

```js
"SaveVideos_Object": {
    title: "{String}", // Title of the chapter
    videoData: "{Buffer}" // A buffer of the chapter video
}
```

<br>

# 🗿 Helpful Infomation & Example Code

### Example Code
```js
// ( Example 1 ) Using the ffmpegCmds in cutVideo(...) 
await cutVideo({
    video: "Some Buffer of YouTube Video",
    DisableDownloadLogs: false,
    chapters: [list[4]],
    ffmpegOptions: {
        crf: "3",
        //Note: What "-hide_banner -loglevel debug" commands will look like in the array
        ffmpegCmds: ["-hide_banner", "-loglevel", "debug"]
    },
});
```

### Helpful Infomation
- [How to find a YouTube comment URL from a video](https://www.youtube.com/watch?v=PnmfkLiMLHs)

### License
MIT
