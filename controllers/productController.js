const {
  getService,
  addService,
  updateService,
  deleteService,
} = require("../services/productService");

async function getProduct(req, res, next) {
  try {
    const product = await getService(req.params.id);
    res.status(201).json({
      products: product,
    });
  } catch (err) {
    next(err);
  }
}

async function addProduct(req, res, next) {
  try {
    const productId = await addService(
      req.body.productName,
      req.body.categoryId,
      req.body.supplierId,
      req.body.quantityInStock,
      req.body.price,
      req.body.description
    );
    res.status(201).json({
      message: "Product added successfully",
      productId: productId,
    });
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await updateService(
      req.params.id,
      req.body.productName,
      req.body.categoryId,
      req.body.supplierId,
      req.body.quantityInStock,
      req.body.price,
      req.body.description
    );
    res.status(201).json({
      message: "Product updated successfully",
      products: product,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const productId = await deleteService(req.params.id);
    res.status(201).json({
      message: "Product deleted successfully",
      products: productId,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProduct, addProduct, updateProduct, deleteProduct };
