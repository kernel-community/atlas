import { type User } from "@prisma/client";
import { prisma } from "src/server/db";

const isInSearcherList = async ({
  email,
  userId,
}: {
  email?: string;
  userId?: string;
}): Promise<{
  isSearcher: boolean;
  searcher?: User;
}> => {
  let user: User | undefined | null;
  if (email) {
    user = await prisma.user.findUnique({ where: { email } });
  } else if (userId) {
    user = await prisma.user.findUnique({ where: { id: userId } });
  }
  // user not found
  if (!user) {
    return {
      isSearcher: false,
      searcher: undefined,
    };
  }

  const found = await prisma.features.findUnique({
    where: {
      userId: user.id,
      searching: true,
    },
  });

  return {
    // isSearcher: !!found,
    isSearcher: true,
    searcher: found ? user : undefined,
  };
};
export default isInSearcherList;
