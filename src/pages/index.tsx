/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
/* eslint-disable @typescript-eslint/no-misused-promises */
import Main from "src/layout/Main";
import { useUser } from "src/context/UserContext";
import Link from "next/link";

export default function Home() {
  const { fetchedUser: user } = useUser();
  const { isFellow } = user;
  // non-fellow view
  if (!isFellow) {
    return (
      <Main>
        <div className="p-5">
          Hello! The Kernel Atlas is currently only accessible to the Kernel
          Fellows.
        </div>
      </Main>
    );
  }

  // fellow's view
  return (
    <Main>
      <div className="p-5">Welcome to Kernel Atlas</div>
      <div className="p-5">
        <ul>
          {/* <li className="underline">
            <Link href={'/explore'}>
              /explore
            </Link>
          </li> */}
          <li className="underline">
            <Link href={"/search"}>/search</Link>
          </li>
        </ul>
      </div>
    </Main>
  );
}
