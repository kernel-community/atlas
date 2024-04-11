import { useDynamicContext } from "@dynamic-labs/sdk-react";
import type { City, Profile, User } from "@prisma/client";
import { createContext, useContext, useMemo, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useQuery } from "react-query";

export type UserStatus = Partial<User> & {
  isSignedIn: boolean;
  profile?: Profile & { city: City };
  isFellow: boolean;
  isSearcher: boolean;
  isSteward: boolean;
};

export type FullUser = {
  fetchedUser: UserStatus;
  setFetchedUser: ({
    id,
    name,
    profile,
    isSignedIn,
    isFellow,
    isSearcher,
    isSteward,
  }: UserStatus) => void;
  setShowAuthFlow: Dispatch<SetStateAction<boolean>>;
};

const defaultFullUser: FullUser = {
  fetchedUser: {
    id: undefined,
    name: undefined,
    profile: undefined,
    isSignedIn: false,
    isFellow: false,
    isSearcher: false,
    isSteward: false,
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setFetchedUser: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setShowAuthFlow: () => {},
};

const UserContext = createContext<FullUser>(defaultFullUser);

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(`useUser must be used within UseUserProvider`);
  }
  return context;
};

const UserProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, user, setShowAuthFlow } = useDynamicContext();
  const [fetchedUser, setFetchedUser] = useState<UserStatus>(
    defaultFullUser.fetchedUser,
  );
  const email = user?.email;

  useQuery(
    [`user-${email}`],
    async () => {
      try {
        const r = (
          await (
            await fetch("/api/query/user", {
              body: JSON.stringify({ email }),
              method: "POST",
              headers: { "Content-type": "application/json" },
            })
          ).json()
        ).data;
        setFetchedUser(() => {
          return {
            ...r,
            // the user was successfully found
            // in the database + the user is
            // connected via web3
            isSignedIn: isAuthenticated,
          };
        });
        return r;
      } catch (err) {
        /**
         * if user not found, disconnect
         */
        // handleLogOut();
        // throw err;
        console.log(err);
      }
    },
    {
      enabled: !!email,
    },
  );

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     setFetchedUser(defaultFullUser.fetchedUser);
  //   }
  // }, [isAuthenticated]);

  const value = useMemo(
    () => ({
      fetchedUser,
      setFetchedUser,
      setShowAuthFlow,
    }),
    [fetchedUser, setShowAuthFlow],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export { UserProvider, useUser };
