import { eq, and } from "drizzle-orm";
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

  const deletedCounter = await db
    .delete(counters)
    .where(and(eq(counters.id, id), eq(counters.userId, session.user.id)))
    .returning()
    .get();

  if (!deletedCounter) {
    throw createError({
      statusCode: 404,
      statusMessage: "Counter not found",
    });
  }

  return deletedCounter;
});
