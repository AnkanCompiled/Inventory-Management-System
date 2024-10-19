const { getService, addService } = require("../services/customerService");

async function getCustomer(req, res, next) {
  try {
    const customer = await getService();
    res.status(201).json({
      customer: customer,
    });
  } catch (err) {
    next(err);
  }
}

async function addCustomer(req, res, next) {
  try {
    const customerId = await addService(
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
  } catch (err) {
    next(err);
  }
}

module.exports = { getCustomer, addCustomer };
