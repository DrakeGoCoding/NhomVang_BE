const validator = require('validator').default;
const AppError = require('@utils/appError');
const { INVALID_IMAGE, MISSING_IMAGE_INPUT } = require('@constants/error');
const { uploadImage } = require('@utils/cloudinary');

const upload = async (req, res, next) => {
	try {
		const image = req.body.image;

		// check if data is provided
		if (!image) {
			throw new AppError(400, "fail", MISSING_IMAGE_INPUT);
		}

		// check if data is base64 image encoded
		const isDataURI = validator.isDataURI(image);
		const isImage = isDataURI && typeof image === 'string' && image.startsWith('data:image/');
		if (!isImage) {
			throw new AppError(400, "fail", INVALID_IMAGE);
		}

		const { statusCode, data } = await uploadImage(image);
		res.status(statusCode).json(data);
	} catch (error) {
		next(error);
	}
}

const deleteImage = async (req, res, next) => {
	try {
		const { id } = req.body;

		console.log(id);

		// check if data is provided
		if (!id) {
			throw new AppError(400, "fail", MISSING_IMAGE_INPUT);
		}

		const { statusCode, data } = await deleteImage(id);
		res.status(statusCode).json(data);
	} catch (error) {
		next(error);
	}
}

module.exports = {
	upload,
	deleteImage
}
