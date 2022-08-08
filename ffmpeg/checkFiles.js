const fs = require('fs');
const path = require('path');

//! Remove work files and checks/creates work folder if needed
module.exports.checkFiles = function () {
    if (fs.existsSync(path.resolve("./ffmpeg/tmp/output.mp4"))) {
        fs.unlinkSync(path.resolve("./ffmpeg/tmp/output.mp4"));
    }

    if (fs.existsSync(path.resolve("./ffmpeg/tmp/input.mp4"))) {
        fs.unlinkSync(path.resolve("./ffmpeg/tmp/input.mp4"));
    }

    if (!fs.existsSync(path.resolve("./ffmpeg/tmp"))) {
        fs.mkdirSync(path.resolve("./ffmpeg/tmp"));
    }
};