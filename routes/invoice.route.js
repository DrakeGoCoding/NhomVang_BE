const router = require("express").Router();
const invoiceController = require("@controllers/invoice.controller");
const { authenticate, restrictTo } = require("@middlewares/auth.middleware");

router.use(authenticate);
router.use(restrictTo("user"));

router.get("/", invoiceController.getAllInvoices);
router.get("/:invoiceId", invoiceController.getInvoice);
router.get("/paypal/success/:invoiceId", invoiceController.payWithPaypalSuccess);
router.get("/paypal/cancel/:invoiceId", invoiceController.payWithPaypalCancel);
router.post("/", invoiceController.createInvoice);
router.post("/cancel/:invoiceId", invoiceController.cancelInvoice);
router.post("/paypal/:invoiceId", invoiceController.payWithPaypal);
router.post("/stripe/:invoiceId", invoiceController.payWithStripe);

module.exports = router;
