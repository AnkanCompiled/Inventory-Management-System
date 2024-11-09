import customerService from "../services/customerService.js";
import AppError from "../errors/AppError.js";
import path from "path";

async function getCustomer(req, res, next) {
  try {
    const customer = await customerService.getService();
    res.status(201).json({
      customer: customer,
    });
  } catch (err) {
    next(err);
  }
}

async function addCustomer(req, res, next) {
  try {
    if (
      req.files &&
      Object.keys(req.files).length > 0 &&
      path.extname(req.files.file.name) === ".xlsx"
    ) {
      const customers = await customerService.addExcelService(req.files.file);
      res.status(201).json({
        message: "Customers added successfully",
        customers: customers,
      });
    } else if (req.body) {
      const customerId = await customerService.addService(
        req.body.customerName,
        req.body.email,
        req.body.phone,
        req.body.address,
        req.body.city,
        req.body.state,
        req.body.zipCode,
        req.body.country
      );
      res.status(201).json({
        message: "Customer added successfully",
        customerId: customerId,
      });
    } else {
      throw new AppError("Not Valid Data", 400);
    }
  } catch (err) {
    next(err);
  }
}

export default { getCustomer, addCustomer };
