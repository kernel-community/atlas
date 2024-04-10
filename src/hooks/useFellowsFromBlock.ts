import { type User } from "@prisma/client";
import { useState } from "react";
import { useQuery } from "react-query";
import { useUser } from "src/context/UserContext";

export const useFellowsFromBlock = (): {
  myBlock: User[];
  all: User[];
} => {
  const { fetchedUser: user } = useUser();
  const [allFellows, setAllFellows] = useState<User[]>([]);
  const [myBlockFellows, setMyBlockFellows] = useState<User[]>([]);

  useQuery([`users-${user.id}`], async () => {
    try {
      const r = await (
        await fetch("/api/query/users", {
          body: JSON.stringify({ block: user.block }),
          method: "POST",
          headers: { "Content-type": "application/json" },
        })
      ).json();
      if (r.ok === true) {
        setMyBlockFellows(r.data.myBlock as User[]);
        setAllFellows(r.data.all as User[]);
      }
    } catch (err) {
      /**
       * if user not found, disconnect
       */
      console.log(err);
      throw err;
    }
  });

  return {
    myBlock: myBlockFellows,
    all: allFellows,
  };
};
