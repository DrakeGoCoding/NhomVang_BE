const { cloudinary } = require("@configs");
const AppError = require("@utils/appError");
const { SYSTEM_ERROR } = require("@constants/error");

const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER;

/**
 * Upload an image to a folder
 * @param {String} file] file name or base64 string
 * @param {String} folder folder path
 * @returns {String} public image url
 * @DrakeGoCoding 11/13/2021
 */
const uploadImage = async (file, folder = "") => {
    try {
        const result = await cloudinary.uploader.upload(file, { folder: `/${CLOUDINARY_FOLDER}/${folder}` });
        return {
            statusCode: 201,
            data: {
                url: result.url,
                id: result.public_id
            }
        };
    } catch (error) {
        console.error(error);
        throw new AppError(500, "fail", SYSTEM_ERROR);
    }
};

/**
 * Delete an image by public_id
 * @param {String} publicId
 * @DrakeGoCoding 11/13/2021
 */
const deleteImage = async publicId => {
    try {
        const { result } = await cloudinary.uploader.destroy(publicId);
        return {
            statusCode: 204,
            data: result
        };
    } catch (error) {
        console.error(error);
        throw new AppError(500, "fail", SYSTEM_ERROR);
    }
};

/**
 * Create a new folder
 * @param {String} folder folder path
 * @DrakeGoCoding 11/13/2021
 */
const createFolder = async folder => {
    try {
        const result = await cloudinary.api.create_folder(`${CLOUDINARY_FOLDER}/${folder}`);
        return {
            statusCode: 201,
            data: result
        };
    } catch (error) {
        console.error(error);
        throw new AppError(500, "fail", SYSTEM_ERROR);
    }
};

/**
 * Delete a folder and its content
 * @param {String} folder folder path
 * @DrakeGoCoding 11/13/2021
 */
const deleteFolder = async folder => {
    try {
        const path = `${CLOUDINARY_FOLDER}/${folder}/`;
        await cloudinary.api.delete_resources_by_prefix(path);
        await cloudinary.api.delete_folder(path);
        return {
            statusCode: 204,
            data: folder
        };
    } catch (error) {
        console.error(error);
        throw new AppError(500, "fail", SYSTEM_ERROR);
    }
};

module.exports = {
    uploadImage,
    deleteImage,
    createFolder,
    deleteFolder
};
