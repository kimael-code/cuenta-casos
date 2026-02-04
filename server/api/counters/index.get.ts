import { eq, desc } from "drizzle-orm";
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

  const userCounters = await db
    .select()
    .from(counters)
    .where(eq(counters.userId, session.user.id))
    .orderBy(desc(counters.createdAt));

  return userCounters;
});
