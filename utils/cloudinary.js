const { cloudinary } = require('@configs');

const CLOUDINARY_FOLDER = process.env.CLOUDINARY_FOLDER;

/**
 * Upload an image to a folder
 * @param {String} file] file name or base64 string
 * @param {String} folder folder path
 * @returns {String} public image url
 * @DrakeGoCoding 11/13/2021
 */
const uploadImage = async (file, folder) => {
	const result = await cloudinary.uploader.upload(
		file,
		{ folder: `/${CLOUDINARY_FOLDER}/${folder}` }
	);
	return result.url;
}

/**
 * Delete an image by public_id
 * @param {String} publicId
 * @DrakeGoCoding 11/13/2021
 */
const deleteImage = async (publicId) => {
	await cloudinary.uploader.destroy(publicId);
}

/**
 * Create a new folder
 * @param {String} folder folder path
 * @DrakeGoCoding 11/13/2021
 */
const createFolder = async (folder) => {
	await cloudinary.api.create_folder(`${CLOUDINARY_FOLDER}/${folder}`);
}

/**
 * Delete a folder and its content
 * @param {String} folder folder path
 * @DrakeGoCoding 11/13/2021
 */
const deleteFolder = async (folder) => {
	const path = `${CLOUDINARY_FOLDER}/${folder}/`;
	await cloudinary.api.delete_resources_by_prefix(path);
	await cloudinary.api.delete_folder(path);
}

module.exports = {
	uploadImage,
	deleteImage,
	createFolder,
	deleteFolder
};