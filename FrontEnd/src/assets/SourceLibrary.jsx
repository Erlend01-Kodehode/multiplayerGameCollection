import { base_url as base } from "../../config.js";

const filePaths = {
    background: "/images/background",
    icons: "/images/icons",
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
    // usage:
    bg: path("background", "bg.png"),
};

export const iconImages = {
    // usage:
    pixel_pandemonium: path("icons", "logo-PIXEL_PANDEMONIUM.png"),
};