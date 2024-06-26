import _ from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "src/server/db";

import isInFellowList from "src/server/utils/isInFellowList";
import isInSearcherList from "src/server/utils/isInSearcherList";
import isInStewards from "src/server/utils/isInStewards";
export default async function user(req: NextApiRequest, res: NextApiResponse) {
  console.log(`[api/query/user] fetching user`);
  const { email, userId } = _.pick(req.body, ["email", "userId"]);
  let user;
  if (userId) {
    user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
      },
    });
  }
  if (email) {
    user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });
  }
  if (!user) {
    return res.status(200).json({
      ok: false,
      data: undefined,
    });
  }
  const { isFellow } = await isInFellowList({ userId: user.id });
  const { isSearcher } = await isInSearcherList({ userId: user.id });
  const { isSteward } = await isInStewards({ userId: user.id });

  if (!user.profile?.photo) {
    Object.assign(user, {
      ...user,
      profile: {
        ...user.profile,
        photo:
          "https://maroon-unsightly-clam-495.mypinata.cloud/ipfs/QmSDn7ne5bwaSDq7JJaPHFH8E4ZxbfDVHWFqQZSC35Tsuo",
      },
    });
  }

  return res.status(200).json({
    ok: true,
    data: {
      ...user,
      isFellow,
      isSearcher,
      isSteward,
    },
  });
}
