// src/controllers/orderController.js
const Order = require('../models/Order');

// GET all orders with optional filtering and sorting
exports.getAllOrders = async (req, res, next) => {
  try {
    // Extract query parameters (e.g., orderStatus, userId, sort)
    const { orderStatus, userId, sort } = req.query;
    const filter = {};
    if (orderStatus) {
      filter.orderStatus = orderStatus;
    }
    if (userId) {
      filter.userId = userId;
    }

    // Default sort by orderDate (newest first). You can use "asc" or "desc".
    let sortOption = { orderDate: -1 };
    if (sort) {
      sortOption = { orderDate: sort.toLowerCase() === 'asc' ? 1 : -1 };
    }

    const orders = await Order.find(filter).sort(sortOption);
    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "No orders found" });
    }
    res.status(200).json(orders);
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

// Update a specific order by ID with orderStatus validation
exports.updateOrder = async (req, res, next) => {
    try {
      // Allowed status values
      const allowedStatuses = ['Pending', 'Paid', 'Shipped', 'Cancelled'];
  
      // If orderStatus is provided in the update, validate it
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

// Soft delete an order by ID with a required reason in the request body
exports.deleteOrder = async (req, res, next) => {
    try {
      const { reason } = req.body;
      if (!reason) {
        return res.status(400).json({ error: "Order deletion reason required" });
      }
      
      // Find the order first
      const order = await Order.findById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      // Mark as deleted and record the deletion reason and timestamp
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
  
  //  Get all soft-deleted orders
  exports.getDeletedOrders = async (req, res, next) => {
    try {
      const deletedOrders = await Order.find({ deleted: true });
      res.status(200).json(deletedOrders);
    } catch (error) {
      next(error);
    }
  };