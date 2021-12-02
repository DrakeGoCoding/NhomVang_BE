const validator = require('validator').default;
const AppError = require('@utils/appError');
const { INVALID_IMAGE, MISSING_IMAGE_INPUT } = require('@constants/error');
const cloudinary = require('@utils/cloudinary');

const upload = async (req, res, next) => {
	try {
		const image = req.body.image;
		if (!image) {
			throw new AppError(400, "fail", MISSING_IMAGE_INPUT);
		}

		const isDataURI = validator.isDataURI(image);
		const isImage = isDataURI && typeof image === 'string' && image.startsWith('data:image/');
		if (!isImage) {
			throw new AppError(400, "fail", INVALID_IMAGE);
		}

		const { statusCode, data } = await cloudinary.uploadImage(image);
		res.status(statusCode).json(data);
	} catch (error) {
		next(error);
	}
}

const deleteImage = async (req, res, next) => {
	try {
		const id = req.params.id;
		if (!id) {
			throw new AppError(400, "fail", MISSING_IMAGE_INPUT);
		}

		const { statusCode, data } = await cloudinary.deleteImage(id);
		res.status(statusCode).json(data);
	} catch (error) {
		next(error);
	}
}

module.exports = {
	upload,
	deleteImage
}
