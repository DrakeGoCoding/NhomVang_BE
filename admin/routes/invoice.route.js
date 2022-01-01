const router = require("express").Router();
const invoiceController = require("@admin/controllers/invoice.controller");
const { authenticate, restrictTo } = require("@middlewares/auth.middleware");

router.use(authenticate);
router.use(restrictTo("admin"));

router.get("/", invoiceController.getAllInvoices);
router.route("/:invoiceId").get(invoiceController.getInvoice).put(invoiceController.updateInvoice);

module.exports = router;
