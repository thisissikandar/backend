import Order from "../models/order.model.js";

const createOrder = async (req, res) => {
  if (req.user.role !== "customer")
    return res.status(403).json({ message: "Access denied" });
  const { product, quantity, location } = req.body;
  try {
    const order = new Order({
      customerId: req.user.id,
      product,
      quantity,
      location,
    });
    await order.save();
    if (req.io) {
      req.io.emit("orderUpdate", order);
      console.log("Emitted orderUpdate for new order:", order._id);
    } else {
      console.warn("WebSocket io not available");
    }
    res.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getcustomerorders = async (req, res) => {
  if (req.user.id !== req.params.id || req.user.role !== "customer") {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const orders = await Order.find({ customerId: req.params.id }).populate(
      "deliveryPartnerId",
      "name"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
const pendingOrders =async (req, res) => {
  if (req.user.role !== "delivery") {
    console.log("Access denied for user:", req.user);
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    console.log("Fetching active orders for user:", req.user.id);
    const orders = await Order.find({
      $or: [
        { status: "Pending", deliveryPartnerId: null }, // Unassigned Pending orders
        {
          deliveryPartnerId: req.user.id,
          status: { $in: ["Accepted", "Out for Delivery"] }, // Assigned Accepted or Out for Delivery
        },
      ],
    }).populate("customerId", "name");
    console.log("Active orders found:", orders);
    res.json(orders || []);
  } catch (error) {
    console.error("Error fetching active orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
const orderStatus =  async (req, res) => {
  if (req.user.role !== "delivery") {
    console.log("Access denied for user:", req.user);
    return res.status(403).json({ message: "Access denied" });
  }
  const { status } = req.body;
  const validStatuses = [
    "Pending",
    "Accepted",
    "Out for Delivery",
    "Delivered",
  ];
  if (!validStatuses.includes(status)) {
    console.log("Invalid status:", status);
    return res.status(400).json({ message: "Invalid status value" });
  }
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      console.log("Order not found:", req.params.id);
      return res.status(404).json({ message: "Order not found" });
    }
    order.status = status;
    if (
      !order.deliveryPartnerId &&
      ["Accepted", "Out for Delivery", "Delivered"].includes(status)
    ) {
      order.deliveryPartnerId = req.user.id;
    }
    await order.save();
    console.log("Updated order:", order);
    if (req.io) {
      console.log("Emitting orderUpdate for order:", order._id);
      req.io.emit("orderUpdate", order);
    } else {
      console.warn("WebSocket io not available");
    }
    res.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
const orderHistory = async (req, res) => {
  if (req.user.id !== req.params.userId) {
    console.log("Access denied for user:", req.user);
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    console.log(
      "Fetching history for user:",
      req.params.userId,
      "role:",
      req.user.role
    );
    const query =
      req.user.role === "customer"
        ? { customerId: req.params.userId }
        : { deliveryPartnerId: req.params.userId, status: "Delivered" };
    console.log("History query:", query);
    const orders = await Order.find(query)
      .populate("customerId", "name")
      .populate("deliveryPartnerId", "name");
    console.log("History orders found:", orders);
    res.json(orders || []);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
export { createOrder, getcustomerorders ,pendingOrders,orderStatus,orderHistory};
