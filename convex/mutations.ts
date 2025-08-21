import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const userCreatedMutation = mutation({
    args: {
        userId: v.string(),
        type: v.union(v.literal("customer"), v.literal("driver")),
        phoneNumber: v.string()
    },
    handler: async (ctx, args) => {
        const { userId, type, phoneNumber } = args;
        // Handle the mutation logic here

        const userExist = await ctx.db.query("userType").filter(q => q.eq(q.field("userId"), userId)).first();

        if (!userExist) {
            await ctx.db.insert("userType", {
                userId,
                type,
                phoneNumber
            });
        }
    }
});

export const placeOrderMutation = mutation({
    args: {
        pickupLocation: v.object({
            address: v.string(),
            coordinates: v.object({
                latitude: v.number(),
                longitude: v.number()
            })
        }),
        deliveryLocation: v.object({
            address: v.string(),
            coordinates: v.object({
                latitude: v.number(),
                longitude: v.number()
            })
        }),
        itemDescription: v.string(),
        weight: v.optional(v.number()),
        deliveryTime: v.optional(v.string()),
        specialInstructions: v.optional(v.string()),
        deliveryFee: v.number(),
        distanceKm: v.number(),
        trackingId: v.string()
    },
    handler: async (ctx, args) => {
        const { pickupLocation, deliveryLocation, itemDescription, weight, deliveryTime, specialInstructions, deliveryFee, distanceKm, trackingId } = args;

        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new Error("Unauthorized");
        }

        const userExist = await ctx.db.query("userType").filter(q => q.eq(q.field("userId"), user.subject)).first();

        if (!userExist) {
            throw new Error("User type not found");
        }

        if (userExist.type === "driver") {
            throw new Error("Drivers cannot place orders");
        }

        // Generate a 4-digit PIN for delivery confirmation
        const deliveryPin = Math.floor(1000 + Math.random() * 9000).toString();

        await ctx.db.insert("orders", {
            userId: user.subject,
            deliveryLocation,
            pickupLocation,
            deliveryFee,
            distanceKm,
            itemDescription,
            weight,
            trackingId,
            deliveryTime,
            specialInstructions,
            status: "pending",
            deliveryPin
        });

        return { deliveryPin };
    }
});

export const acceptOrderMutation = mutation({
    args: {
        trackingId: v.string()
    },
    handler: async (ctx, args) => {
        const { trackingId } = args;

        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new Error("Unauthorized");
        }

        const userType = await ctx.db.query("userType").filter(q => q.eq(q.field("userId"), user.subject)).first();

        if (!userType) {
            throw new Error("User type not found");
        }

        if (userType.type !== "driver") {
            throw new Error("Only drivers can accept orders");
        }

        const order = await ctx.db.query("orders").filter(q => q.eq(q.field("trackingId"), trackingId)).first();

        if (!order) {
            throw new Error("Order not found");
        }

        if (order.driverId) {
            throw new Error("Order already assigned to another driver");
        }

        await ctx.db.patch(order._id, {
            driverId: user.subject,
            status: "assigned"
        });

        return { success: true, message: "Order accepted successfully" };
    }
});

export const markOrderPickedUpMutation = mutation({
    args: {
        trackingId: v.string()
    },
    handler: async (ctx, args) => {
        const { trackingId } = args;

        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new Error("Unauthorized");
        }

        const userType = await ctx.db.query("userType").filter(q => q.eq(q.field("userId"), user.subject)).first();

        if (!userType) {
            throw new Error("User type not found");
        }

        if (userType.type !== "driver") {
            throw new Error("Only drivers can mark orders as picked up");
        }

        const order = await ctx.db.query("orders").filter(q => q.eq(q.field("trackingId"), trackingId)).first();

        if (!order) {
            throw new Error("Order not found");
        }

        if (order.driverId !== user.subject) {
            throw new Error("You can only mark your assigned orders as picked up");
        }

        if (order.status !== "assigned") {
            throw new Error("Order must be in assigned status to mark as picked up");
        }

        await ctx.db.patch(order._id, {
            status: "picked_up",
            pickupTime: Date.now()
        });

        return { success: true, message: "Order marked as picked up" };
    }
});

export const confirmDeliveryMutation = mutation({
    args: {
        trackingId: v.string(),
        pin: v.string()
    },
    handler: async (ctx, args) => {
        const { trackingId, pin } = args;

        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new Error("Unauthorized");
        }

        const userType = await ctx.db.query("userType").filter(q => q.eq(q.field("userId"), user.subject)).first();

        if (!userType) {
            throw new Error("User type not found");
        }

        if (userType.type !== "driver") {
            throw new Error("Only drivers can confirm delivery");
        }

        const order = await ctx.db.query("orders").filter(q => q.eq(q.field("trackingId"), trackingId)).first();

        if (!order) {
            throw new Error("Order not found");
        }

        if (order.driverId !== user.subject) {
            throw new Error("You can only confirm delivery for your assigned orders");
        }

        if (order.status !== "picked_up") {
            throw new Error("Order must be picked up before confirming delivery");
        }

        if (order.deliveryPin !== pin) {
            throw new Error("Invalid delivery PIN");
        }

        await ctx.db.patch(order._id, {
            status: "delivered",
            deliveryTime_actual: Date.now()
        });

        return { success: true, message: "Delivery confirmed successfully" };
    }
});

export const deleteOrderMutation = mutation({
    args: {
        trackingId: v.string()
    },
    handler: async (ctx, args) => {
        const { trackingId } = args;

        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new Error("Unauthorized");
        }

        const userType = await ctx.db.query("userType").filter(q => q.eq(q.field("userId"), user.subject)).first();

        if (!userType) {
            throw new Error("User type not found");
        }

        if (userType.type !== "customer") {
            throw new Error("Only customers can delete their orders");
        }

        const order = await ctx.db.query("orders").filter(q => q.eq(q.field("trackingId"), trackingId)).first();

        if (!order) {
            throw new Error("Order not found");
        }

        if (order.userId !== user.subject) {
            throw new Error("You can only delete your own orders");
        }

        if (order.status === "picked_up" || order.status === "delivered") {
            throw new Error("Cannot delete orders that have been picked up or delivered");
        }

        await ctx.db.delete(order._id);

        return { success: true, message: "Order deleted successfully" };
    }
});