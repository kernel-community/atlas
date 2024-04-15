import type { Prisma } from "@prisma/client";

export const updateUser = async (user: Prisma.UserUpdateInput) => {
  let res;
  try {
    res = (
      await (
        await fetch("/api/update/user", {
          body: JSON.stringify({ user }),
          method: "POST",
          headers: { "Content-type": "application/json" },
        })
      ).json()
    ).data;
  } catch (err) {
    throw err;
  }
  return res;
};
