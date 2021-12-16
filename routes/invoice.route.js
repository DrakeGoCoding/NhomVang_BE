const router = require("express").Router();
const invoiceController = require("@controllers/invoice.controller");
const { authenticate, restrictTo } = require("@middlewares/auth.middleware");

router.use(authenticate);
router.use(restrictTo("user"));

router.post("/", invoiceController.createInvoice);
router.post("/pay/paypal", invoiceController.payWithPaypal);
router.post("/pay/stripe", invoiceController.payWithStripe);

module.exports = router;
