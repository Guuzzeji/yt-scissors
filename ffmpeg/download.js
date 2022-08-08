const { downloadRelease } = require('@terascope/fetch-github-release');
const path = require('path');
const os = require('os');
const fs = require('fs');

require("./checkFiles").checkFiles();


//filter releases to not download prerelease
function filterRelease(release) {
    return release.prerelease === false;
}

//Find which type of ffmpeg to download
function typeInstall() {
    let system = os.type();
    let ffmpeg_version = null;

    //! No MacOS option for ffmpeg have to download and add it yourself
    if (system == 'Windows_NT') {
        ffmpeg_version = "ffmpeg-master-latest-win64-gpl";
    } else if (system == 'Linux') {
        ffmpeg_version = "ffmpeg-master-latest-linux64-gpl";
    }

    return ffmpeg_version;
}

//filter releases to find right for OS.
function filterAsset(asset) {
    if (asset.name.search(typeInstall()) != -1 && asset.name.search("-share") == -1) {
        return true;
    } else {
        return false;
    }
}

//* Downloads ffmpeg and return path to ffmpeg executable 
module.exports.ffmpegDownload = async function (logging) {
    //* Get ffmpeg from https://github.com/BtbN/FFmpeg-Builds
    const user = 'BtbN';
    const dir = "./ffmpeg/tmp";
    const repo = 'FFmpeg-Builds';
    const leaveZipped = false;
    const disableLogging = logging || false;

    if (!fs.existsSync(path.resolve("ffmpeg", "tmp", typeInstall(), "bin"))) {
        let ffmpeg_folder = await downloadRelease(user, repo, dir, filterRelease, filterAsset, leaveZipped, disableLogging)
            .then(function (save) {
                return save[0];
            })
            .catch(function (err) {
                throw new Error(err);
            });

        return path.resolve(path.join(ffmpeg_folder.replace(".zip", ""), "bin", "ffmpeg"));

    } else {
        return path.resolve("ffmpeg", "tmp", typeInstall(), "bin", "ffmpeg");
    }
};


