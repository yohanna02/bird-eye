import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    userType: defineTable({
        userId: v.string(),
        type: v.union(v.literal("customer"), v.literal("driver")),
        phoneNumber: v.string(),
    }).index("by_userId", ["userId"]),
    orders: defineTable({
        trackingId: v.string(),
        userId: v.string(),
        driverId: v.optional(v.string()),
        pickupLocation: v.object({
            address: v.string(),
            coordinates: v.object({
                latitude: v.number(),
                longitude: v.number(),
            }),
        }),
        deliveryLocation: v.object({
            address: v.string(),
            coordinates: v.object({
                latitude: v.number(),
                longitude: v.number(),
            }),
        }),
        itemDescription: v.optional(v.string()),
        weight: v.optional(v.number()),
        deliveryTime: v.optional(v.string()),
        specialInstructions: v.optional(v.string()),
        deliveryFee: v.number(),
        distanceKm: v.number(),
        status: v.union(
            v.literal("pending"),
            v.literal("assigned"),
            v.literal("picked_up"),
            v.literal("delivered")
        ),
        deliveryPin: v.string(),
        pickupTime: v.optional(v.number()),
        deliveryTime_actual: v.optional(v.number()),
    }).index("by_userId", ["userId"]),
});