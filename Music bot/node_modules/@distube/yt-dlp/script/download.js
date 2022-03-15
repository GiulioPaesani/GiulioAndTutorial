const { YTDLP_DISABLE_DOWNLOAD, download } = require("../dist/wrapper");

if (!YTDLP_DISABLE_DOWNLOAD) download().then(v => console.log(`[yt-dlp] Downloaded ${v} version!`));
