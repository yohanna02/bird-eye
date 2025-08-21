import { v } from "convex/values";
import { query } from "./_generated/server";

export const getUserType = query({
    handler: async (ctx) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new Error("Unauthorized");
        }

        const userType = await ctx.db
            .query("userType")
            .filter((q) => q.eq(q.field("userId"), user.subject))
            .first();

        if (!userType) {
            throw new Error("User type not found");
        }

        return userType.type;
    },
});

export const getUserOrders = query({
    handler: async (ctx) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new Error("Unauthorized");
        }

        const userType = await ctx.db
            .query("userType")
            .filter((q) => q.eq(q.field("userId"), user.subject))
            .first();

        if (!userType) {
            throw new Error("User type not found");
        }

        if (userType.type === "driver") {
            // For drivers: return orders without a driver assigned or assigned to this driver
            return ctx.db
                .query("orders")
                .filter((q) => q.or(
                    q.eq(q.field("status"), "pending"), 
                    q.eq(q.field("driverId"), user.subject)
                ))
                .collect();
        } else {
            // For customers: return orders created by this user
            return ctx.db
                .query("orders")
                .filter((q) => q.eq(q.field("userId"), user.subject))
                .collect();
        }
    }
});

export const getUserProfile = query({
    handler: async (ctx) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new Error("Unauthorized");
        }

        const userType = await ctx.db
            .query("userType")
            .filter((q) => q.eq(q.field("userId"), user.subject))
            .first();

        return {
            name: user.name || "User",
            email: user.email || "",
            pictureUrl: user.pictureUrl || "",
            userType: userType?.type || "customer",
            userId: user.subject,
        };
    },
});

export const getSingleOrder = query({
    args: { trackingId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.auth.getUserIdentity();

        if (!user) {
            throw new Error("Unauthorized");
        }

        const userType = await ctx.db
            .query("userType")
            .filter((q) => q.eq(q.field("userId"), user.subject))
            .first();

        if (!userType) {
            throw new Error("User type not found");
        }

        if (userType.type === "driver") {
            return ctx.db.query("orders")
                .filter((q) => q.and(
                    q.or(
                        q.eq(q.field("status"), "pending"), 
                        q.eq(q.field("driverId"), user.subject)
                    ), 
                    q.eq(q.field("trackingId"), args.trackingId)
                )).first();
        } else {
            return ctx.db.query("orders")
                .filter((q) => q.and(q.eq(q.field("userId"), user.subject), q.eq(q.field("trackingId"), args.trackingId))).first();
        }
    }
});