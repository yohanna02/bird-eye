import { api } from "./_generated/api";
import { httpAction } from "./_generated/server";

export const userCreated = httpAction(async (ctx, request) => {
    const body = await request.json();

    if (body.type === "user.created") {
        await ctx.runMutation(api.mutations.userCreatedMutation, {
            userId: body.data.id,
            type: body.data.unsafe_metadata.type,
            phoneNumber: body.data.unsafe_metadata.phoneNumber,
        });
    }

    return new Response(null, {
        status: 200,
    });
});