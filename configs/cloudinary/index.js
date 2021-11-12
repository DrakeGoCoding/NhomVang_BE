const cloudinary = require('cloudinary').v2;

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: CLOUDINARY_API_KEY,
	api_secret: CLOUDINARY_API_SECRET
});

/**
 * Upload an image to a folder
 * @param {String} fileStr64 file string base64
 * @param {String} folder folder name
 * @returns {String} public image url
 * @DrakeGoCoding 11/13/2021
 */
const uploadImage = async (fileStr64, folder) => {
	try {
		const result = await cloudinary.uploader.upload(fileStr64, { folder });
		return result.url;
	} catch (error) {
		next(error);
	}
}

/**
 * Delete an image from a folder
 * @param {String} file file name
 * @param {String} folder folder name
 * @DrakeGoCoding 11/13/2021
 */
const deleteImage = async (file, folder) => {
	try {
		await cloudinary.uploader.destroy(`${folder}/${file}`);
	} catch (error) {
		next(error);
	}
}

/**
 * Delete a folder and its content
 * @param {String} folder folder name 
 * @DrakeGoCoding 11/13/2021
 */
const deleteFolder = async (folder) => {
	try {

	} catch (error) {
		next(error);
	}
}

module.exports = {
	uploadImage,
	deleteImage,
	deleteFolder
};