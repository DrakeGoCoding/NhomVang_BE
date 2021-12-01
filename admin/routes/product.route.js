const router = require('express').Router();
const productController = require('@admin/controllers/product.controller');

router.post('/', productController.createProduct);
router
	.route("/:slug")
	.put(productController.updateProduct)
	.delete(productController.deleteProduct);

module.exports = router;
