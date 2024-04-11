/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import useUserFromUserId from "src/hooks/useUserFromUserId";
import Main from "src/layout/Main";
import { KernelIcon, LinkIcon, XIcon } from "src/components/icons";
import { Pill } from "src/components/Pill";
import Image from "next/image";
import GridPlantBg from "public/images/plants-and-boxes-bg.png";

const Profile = () => {
  const { query } = useRouter();
  const { userId } = query;
  const { user } = useUserFromUserId({ userId: userId?.toString() });

  if (!user) {
    return <Main> User not found </Main>;
  }
  return (
    <Main>
      <Image
        src={GridPlantBg}
        width={960}
        height={960}
        className="absolute -z-10 left-0 bottom-0"
        alt="background image"
      />
      <div className="p-5 md:w-[70rem] mx-auto overflow-auto h-full z-10">
        <div className="grid md:grid-cols-2 grid-cols-1">
          <div className="md:m-0 hidden md:block">
            <img
              src={user.profile?.photo ?? ""}
              alt="pfp"
              width={300}
              height={256}
              className="rounded-full shadow-lg"
            />
          </div>
          <div>
            <div className="flex flex-row justify-between items-center">
              <div className="md:hidden block">
                <img
                  src={user.profile?.photo ?? ""}
                  alt="pfp"
                  width={150}
                  height={150}
                  className="rounded-full shadow-lg"
                />
              </div>
              <div className="flex flex-col w-full text-right">
                <div className="font-poly text-5xl text-right">{user.name}</div>
                {user.profile?.affiliation && (
                  <div className="font-poly text-3xl italic text-right">
                    <span className="text-2xl">crafting</span>{" "}
                    <span>{user.profile?.affiliation}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-row gap-3 py-3">
              <Pill
                icon={<LinkIcon />}
                label="website"
                href={user.profile?.website}
                highlight
              />
              <Pill
                icon={<XIcon />}
                label={user.profile?.twitter ?? ""}
                href={`https://x.com/` + user.profile?.twitter}
              />
              <Pill icon={<KernelIcon />} label={`Block ${user.block}`} />
            </div>
            <div className="flex flex-col gap-3 text-left">
              {user.profile?.affliationDescription && (
                <div className="">{user.profile.affliationDescription}</div>
              )}
              {user.profile?.bio && <div>{user.profile.bio}</div>}
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Profile;
