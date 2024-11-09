import productService from "../services/productService.js";
import AppError from "../errors/AppError.js";
import path from "path";

async function getProduct(req, res, next) {
  try {
    const product = await productService.getService(req.params.id);
    res.status(201).json({
      products: product,
    });
  } catch (err) {
    next(err);
  }
}

async function addProduct(req, res, next) {
  try {
    if (
      req.files &&
      Object.keys(req.files).length > 0 &&
      path.extname(req.files.file.name) === ".xlsx"
    ) {
      const products = await productService.addExcelService(req.files.file);
      res.status(201).json({
        message: "Products added successfully",
        products: products,
      });
    } else if (req.body) {
      const productId = await productService.addService(
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
    } else {
      throw new AppError("Not Valid Data", 400);
    }
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await productService.updateService(
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
    const productId = await productService.deleteService(req.params.id);
    res.status(201).json({
      message: "Product deleted successfully",
      products: productId,
    });
  } catch (err) {
    next(err);
  }
}

export default { getProduct, addProduct, updateProduct, deleteProduct };
