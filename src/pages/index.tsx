/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
/* eslint-disable @typescript-eslint/no-misused-promises */
import Main from "src/layout/Main";
import RetroButton from "src/components/RetroButton";
import { useUser } from "src/context/UserContext";
// @note make checking for fellow server side
// would involve using passportjs-dynamic on the server for auth


export const Footer = ({
  prev, next
}: {prev: () => void, next:() => void}) => {
  return (
    <div className="flex flex-row gap-3 my-6 justify-between px-6">
      <RetroButton type="button" onClick={() => prev()}>PREV</RetroButton>
      <div className="hidden md:block">
      </div>
      <RetroButton type="button" onClick={() => next()}>NEXT</RetroButton>
    </div>
  )
}


export default function Home() {
  const {fetchedUser: user} = useUser();
  const {isFellow} = user;
  // non-fellow view
  if (!isFellow) {
    return (
      <Main>
        <div className="p-5">
          Hello! The Kernel Atlas is currently only accessible to the Kernel Fellows.
        </div>
      </Main>
    )
  }

  // fellow's view
  return (
    <Main>
      <div className="p-5">
        Explore Block 8 Fellows
      </div>
    </Main>
  );
}
