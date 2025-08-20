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