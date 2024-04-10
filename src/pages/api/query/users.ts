import _ from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "src/server/db";

export default async function users(req: NextApiRequest, res: NextApiResponse) {
  console.log(`[api/query/users] fetching users`);
  const { block } = _.pick(req.body, ["block"]);
  const all = await prisma.user.findMany({
    where: {
      NOT: {
        block: {
          equals: -1,
        },
      },
    },
    include: {
      profile: {
        include: {
          city: true,
        },
      },
      Features: true,
    },
  });
  const myBlock = all.filter((f) => f.block === block);
  return res.status(200).json({
    ok: true,
    data: { myBlock, all },
  });
}
