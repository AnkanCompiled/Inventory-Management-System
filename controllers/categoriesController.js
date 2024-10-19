const {
  getService,
  addService,
  deleteService,
} = require("../services/categoriesServies");

async function getCategory(req, res, next) {
  try {
    const category = await getService(req.params.id);
    res.status(201).json({
      category: category,
    });
  } catch (err) {
    next(err);
  }
}

async function addCategory(req, res, next) {
  try {
    const categoryId = await addService(
      req.body.categoryName,
      req.body.description
    );
    res.status(201).json({
      message: "Category added successfully",
      categoryId: categoryId,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteCategory(req, res, next) {
  try {
    await deleteService(req.params.id);
    res.status(204).json({
      message: "Category Delted Successfully",
      categoryId: req.params.id,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCategory, addCategory, deleteCategory };
