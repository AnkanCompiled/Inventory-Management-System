import categoriesServies from "../services/categoriesServies.js";

async function getCategory(req, res, next) {
  try {
    const category = await categoriesServies.getService(req.params.id);
    res.status(201).json({
      category: category,
    });
  } catch (err) {
    next(err);
  }
}

async function addCategory(req, res, next) {
  try {
    const categoryId = await categoriesServies.addService(
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
    await categoriesServies.deleteService(req.params.id);
    res.status(204).json({
      message: "Category Delted Successfully",
      categoryId: req.params.id,
    });
  } catch (err) {
    next(err);
  }
}

export default { getCategory, addCategory, deleteCategory };
