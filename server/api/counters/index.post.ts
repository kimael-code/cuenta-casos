import { db } from "#server/utils/db";
import { counters } from "#server/database/schema";
import { auth } from "#server/utils/auth";
import { v4 as uuidv4 } from "uuid";

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

  const body = await readBody(event);

  if (!body.title) {
    throw createError({
      statusCode: 400,
      statusMessage: "Title is required",
    });
  }

  const newCounter = await db
    .insert(counters)
    .values({
      id: uuidv4(),
      name: body.title, // 'title' in API, 'name' in DB schema
      userId: session.user.id,
      count: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()
    .get();

  return newCounter;
});
