import supplierController from "../services/supplierService.js";

async function getSupplier(req, res, next) {
  try {
    const supplier = await supplierController.getService();
    res.status(201).json({
      supplier: supplier,
    });
  } catch (err) {
    next(err);
  }
}

async function addSupplier(req, res, next) {
  try {
    const supplierId = await supplierController.addService(
      req.body.supplierName,
      req.body.contactName,
      req.body.email,
      req.body.phone,
      req.body.address,
      req.body.city,
      req.body.state,
      req.body.zipCode,
      req.body.country
    );
    res.status(201).json({
      message: "Supplier added successfully",
      supplierId: supplierId,
    });
  } catch (err) {
    next(err);
  }
}

export default { getSupplier, addSupplier };
