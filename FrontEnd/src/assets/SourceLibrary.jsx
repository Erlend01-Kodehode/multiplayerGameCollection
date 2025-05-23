import { base_url as base } from "../../config.js";

const filePaths = {
    background: "/images/background",
    icons: "/images/icons",
    thumbnail: "/images/thumbnail",
    // Add other categories as needed
};

const path = (folderKey, fileName) => {
    const folderPath = filePaths[folderKey];
    if (!folderPath) {
        console.error(`Invalid folder key: ${folderKey}`);
        return "";
    }
    const encodedFileName = encodeURI(fileName);
    return `${base}${folderPath}/${encodedFileName}`;
}

export const backgroundImages = {
    bg: path("background", "bg.svg"),
    bg2: path("background", "bg2.svg"),
};

export const iconImages = {
    pixel_pandemonium: path("icons", "logo-PIXEL_PANDEMONIUM.png"),
    navProfile: path("icons", "pfp-default.png"),
};

export const thumbnailImages = {
    thumbnail_tictactoe: path("thumbnail", "thumbnail-tictactoe.png"),
    thumbnail_checkers: path("thumbnail", "checkersThumbnail.svg"),
}