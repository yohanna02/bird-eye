import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    userType: defineTable({
        userId: v.string(),
        type: v.union(v.literal("customer"), v.literal("driver")),
        phoneNumber: v.string(),
    }).index("by_userId", ["userId"]),
    orders: defineTable({
        name: v.string(),
        userId: v.string(),
    }).index("by_userId", ["userId"]),
});