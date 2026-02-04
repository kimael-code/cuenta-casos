import { eq, and, sql } from "drizzle-orm";
import { db } from "#server/utils/db";
import { counters } from "#server/database/schema";
import { auth } from "#server/utils/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: getRequestHeaders(event) as HeadersInit,
  });

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Counter ID is required",
    });
  }
  const body = await readBody(event);

  // Expect body to have 'increment' number (e.g. 1 or -1)
  if (typeof body.increment !== "number") {
    throw createError({
      statusCode: 400,
      statusMessage: "Increment value is required",
    });
  }

  // Verify ownership and update
  const updatedCounter = await db
    .update(counters)
    .set({
      count: sql`${counters.count} + ${body.increment}`,
      updatedAt: new Date(),
    })
    .where(and(eq(counters.id, id), eq(counters.userId, session.user.id)))
    .returning()
    .get();

  if (!updatedCounter) {
    throw createError({
      statusCode: 404,
      statusMessage: "Counter not found",
    });
  }

  return updatedCounter;
});
