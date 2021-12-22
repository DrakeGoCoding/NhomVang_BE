const router = require("express").Router();
const invoiceController = require("@controllers/invoice.controller");
const { authenticate, restrictTo } = require("@middlewares/auth.middleware");

router.get("/paypal/success", invoiceController.payWithPaypalSuccess);
router.get("/paypal/cancel", invoiceController.payWithPaypalCancel);

router.use(authenticate);
router.use(restrictTo("user"));

router.get("/", invoiceController.getAllInvoices);
router.get("/:invoiceId", invoiceController.getInvoice);
router.post("/", invoiceController.createInvoice);
router.post("/pay", invoiceController.payInvoice);
router.post("/cancel/:invoiceId", invoiceController.cancelInvoice);

module.exports = router;
