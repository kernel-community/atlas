import { type Prisma } from "@prisma/client";
import _ from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "src/server/db";

export default async function user(req: NextApiRequest, res: NextApiResponse) {
  const { user }: { user: Prisma.UserUpdateInput | Prisma.UserCreateInput } =
    _.pick(req.body, ["user"]);

  const fetchWithUserId = user.id
    ? await prisma.user.findUnique({
        where: { id: user.id as string },
      })
    : undefined;

  const fetchWithEmail = await prisma.user.findUnique({
    where: { email: (user.email as string) ?? "" },
  });

  const fetched = fetchWithUserId ?? fetchWithEmail;

  let updated;
  if (!fetched) {
    // create
    updated = await prisma.user.create({
      data: { ...user } as Prisma.UserCreateInput,
    });
  } else {
    // update
    updated = await prisma.user.update({
      where: { id: fetched.id },
      data: { ...user } as Prisma.UserUpdateInput,
    });
  }

  console.log(`
    Updated user ${JSON.stringify(updated)} for id: ${updated.id}
  `);

  res.status(200).json({ data: updated });
}
