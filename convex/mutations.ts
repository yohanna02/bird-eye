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
            specialInstructions
        });
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
            driverId: user.subject
        });

        return { success: true, message: "Order accepted successfully" };
    }
});