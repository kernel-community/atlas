import { type User } from "@prisma/client";

const isInStewards = async ({email, userId}:{email?: string, userId?: string}): Promise<{
  isSteward: boolean,
  searcher?: User
}> => {
  let user: User | undefined | null;
  if (email) {
    user = await prisma?.user.findUnique({ where: { email } })
  } else if (userId) {
    user = await prisma?.user.findUnique({ where: { id: userId } })
  }
  if (!user) {
    return {
      isSteward: false,
      searcher: undefined
    };
  }

  const found = await prisma?.features.findUnique({
    where: {
      userId: user.id,
      stewarding: true
    }
  })

  return {
    isSteward: !!found,
    searcher: found ? user : undefined
  };
}
export default isInStewards;