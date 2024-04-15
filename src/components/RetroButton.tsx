/* eslint-disable @next/next/no-img-element */
import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { useUser } from "src/context/UserContext";
import SmallButton from "./SmallButton";
import Link from "next/link";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> & {
  children?: ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
};

const RetroButton = (props: ButtonProps) => {
  const { children, isLoading, ...restProps } = props;
  return (
    <button
      className="
      btn relative flex flex-row items-center gap-4 group cursor-pointer border-0"
      {...restProps}
    >
      <span className="absolute inset-0 w-full h-full transition duration-200 ease-out transform -translate-x-1 translate-y-1 bg-primary border-2 border-neutral-content group-hover:-translate-x-0 group-hover:-translate-y-0 rounded-md"></span>
      <span className="absolute inset-0 w-full h-full bg-neutral border-2 border-neutral-content group-hover:bg-primary rounded-md"></span>
      {children && (
        <span className="relative text-neutral-content group-hover:base-100">
          {children}
        </span>
      )}
      {isLoading && (
        <span className="loading loading-spinner loading-xs"></span>
      )}
    </button>
  );
};

export const ProfileImage = ({
  image,
}: {
  image: string | undefined | null;
}) => {
  return (
    <img
      src={image ?? ""}
      width={24}
      height={24}
      alt="profile image"
      className="rounded-md"
    />
  );
};

export const DynamicLoginButton = () => {
  const { fetchedUser: user, setShowAuthFlow } = useUser();
  const { name } = user;
  if (user.isSignedIn) {
    return (
      <Link href={`/u/${user.id}`} passHref>
        <SmallButton>
          <ProfileImage image={user.profile?.photo} />
          {name}
        </SmallButton>
      </Link>
    );
  }
  return (
    <RetroButton onClick={() => setShowAuthFlow(true)}>Sign in</RetroButton>
  );
};

export default RetroButton;
