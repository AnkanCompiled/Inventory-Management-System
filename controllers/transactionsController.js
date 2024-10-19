const { getService, addService } = require("../services/transactionsServices");

async function getTransaction(req, res, next) {
  try {
    const transaction = await getService();
    res.status(201).json({
      transaction: transaction,
    });
  } catch (err) {
    next(err);
  }
}

async function addTransaction(req, res, next) {
  try {
    const transactionId = await addService(
      req.body.customerId,
      req.body.transactionDate,
      req.body.totalAmount,
      req.body.items
    );
    res.status(201).json({
      message: "Transaction added successfully",
      customerId: transactionId,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getTransaction, addTransaction };
