// src/controllers/orderController.js

const Order = require('../models/Order');

// GET all orders with filtering, sorting, and pagination
exports.getAllOrders = async (req, res, next) => {
  try {
    const { orderStatus, userId, sort, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (orderStatus) filter.orderStatus = orderStatus;
    if (userId) filter.userId = userId;
    
    // Default sort by orderDate descending (newest first)
    let sortOption = { orderDate: -1 };
    if (sort) {
      sortOption = { orderDate: sort.toLowerCase() === 'asc' ? 1 : -1 };
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    const orders = await Order.find(filter)
                              .sort(sortOption)
                              .skip(skip)
                              .limit(Number(limit));
    
    const totalOrders = await Order.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / Number(limit));
    
    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found" });
    }
    
    res.status(200).json({
      data: orders,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// GET a specific order by ID
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

// POST a new order
exports.createOrder = async (req, res, next) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    next(error);
  }
};

// PUT update an existing order by ID with orderStatus validation
exports.updateOrder = async (req, res, next) => {
  try {
    const allowedStatuses = ['Pending', 'Paid', 'Shipped', 'Cancelled'];
    if (req.body.orderStatus && !allowedStatuses.includes(req.body.orderStatus)) {
      return res.status(400).json({ 
        error: "Invalid order status. Allowed values: 'Pending', 'Paid', 'Shipped', 'Cancelled'" 
      });
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// Soft delete an order by ID with a required deletion reason
exports.deleteOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ error: "Order deletion reason required" });
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    order.deleted = true;
    order.deletionReason = reason;
    order.deletedAt = new Date();
    const updatedOrder = await order.save();
    res.status(200).json({
      message: "Order soft-deleted successfully",
      order: updatedOrder,
      deletionReason: reason
    });
  } catch (error) {
    next(error);
  }
};

// GET all soft-deleted orders
exports.getDeletedOrders = async (req, res, next) => {
  try {
    const deletedOrders = await Order.find({ deleted: true });
    res.status(200).json(deletedOrders);
  } catch (error) {
    next(error);
  }
};

/**
 * GET summary of orders grouped by user.
 * Groups non-deleted orders by userId and calculates the total number of orders and total revenue per user.
 * URL: GET /orders/groupedByUser
 */
exports.getOrdersGroupedByUser = async (req, res, next) => {
  try {
    const summary = await Order.aggregate([
      { $match: { deleted: { $ne: true } } },
      { 
        $group: {
          _id: "$userId",
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { totalRevenue: -1 } }
    ]);
    if (!summary || summary.length === 0) {
      return res.status(404).json({ error: "No orders found for grouping by user" });
    }
    res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
};

/**
 * GET orders filtered by a date range.
 * Filters non-deleted orders where orderDate is between startDate and endDate (inclusive).
 * Expects query parameters: startDate and endDate (ISO date strings).
 * URL: GET /orders/byDateRange?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
 */
exports.getOrdersByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ error: "Both startDate and endDate are required" });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const orders = await Order.find({
      orderDate: { $gte: start, $lte: end },
      deleted: { $ne: true }
    });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found in the specified date range" });
    }
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};
