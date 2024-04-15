import { useState } from "react";
import { useQuery } from "react-query";
import { type UserStatus } from "src/@types";

/**
 * either provide a userId to query the database for the a specific user's info
 * or fetch currently logged in user's data through email
 */
const useUserFromUserId = ({ userId }: { userId?: string | null }) => {
  const [fetchedUser, setFetchedUser] = useState<UserStatus>();
  const { refetch } = useQuery(
    [`user-${userId}`],
    async () => {
      try {
        const r = await (
          await fetch("/api/query/user", {
            body: JSON.stringify({ userId }),
            method: "POST",
            headers: { "Content-type": "application/json" },
          })
        ).json();
        if (r.ok === true) {
          setFetchedUser(() => {
            return {
              ...r.data,
            };
          });
        }
      } catch (err) {
        /**
         * if user not found, disconnect
         */
        console.log(err);
        throw err;
      }
    },
    {
      enabled: !!userId,
      refetchInterval: 800,
    },
  );
  return { user: fetchedUser, refetch };
};

export default useUserFromUserId;
