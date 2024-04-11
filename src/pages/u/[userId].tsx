/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import useUserFromUserId from "src/hooks/useUserFromUserId";
import Main from "src/layout/Main";
import {
  CheckmarkIcon,
  EditIcon,
  KernelIcon,
  LinkIcon,
  XIcon,
} from "src/components/icons";
import { Pill } from "src/components/Pill";
import Image from "next/image";
import GridPlantBg from "public/images/plants-and-boxes-bg.png";
import { useUser } from "src/context/UserContext";
import { useState } from "react";

const Profile = () => {
  const { query } = useRouter();
  const { userId } = query;
  const { user } = useUserFromUserId({ userId: userId?.toString() });
  const { fetchedUser } = useUser();
  const isEditable = fetchedUser.id === user?.id;
  const [isEditing, setIsEditing] = useState<boolean>(false);
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
      <div className="p-5 md:w-[70rem] mx-auto overflow-auto h-full z-10 font-libre">
        <div className="grid md:grid-cols-2 grid-cols-1">
          <div className="md:m-0 hidden md:flex md:flex-col md:gap-6">
            <img
              src={user.profile?.photo ?? ""}
              alt="pfp"
              width={300}
              height={300}
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
                {isEditable && !isEditing && (
                  <div
                    className="btn btn-sm self-end"
                    onClick={() => setIsEditing((c) => !c)}
                  >
                    <EditIcon />
                    Edit
                  </div>
                )}
                {isEditable && isEditing && (
                  <div
                    className="btn btn-sm self-end"
                    onClick={() => setIsEditing((c) => !c)}
                  >
                    <CheckmarkIcon />
                    Save
                  </div>
                )}
                {!isEditing ? (
                  <div className="font-poly text-5xl text-right">
                    {user.name}
                  </div>
                ) : (
                  <div>
                    <input
                      className="font-poly text-5xl text-right bg-base-100 border-b-2 border-b-primary"
                      value={user.name ?? ""}
                    ></input>
                  </div>
                )}
                {user.profile?.affiliation && (
                  <div className="font-poly text-3xl italic text-right">
                    <span className="text-2xl">crafting</span>{" "}
                    {!isEditing ? (
                      <span>{user.profile?.affiliation}</span>
                    ) : (
                      <input
                        className="bg-base-100 border-b-2 border-b-primary"
                        value={user.profile?.affiliation}
                      />
                    )}
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
                <div className="">
                  <div className="font-poly text-xl">Affiliation</div>
                  {!isEditing ? (
                    <div>{user.profile.affliationDescription}</div>
                  ) : (
                    <input
                      type="textarea"
                      value={user.profile.affliationDescription}
                      className="bg-base-100 border-b-2 border-b-primary"
                    />
                  )}
                </div>
              )}

              {user.profile?.bio && (
                <div>
                  <div className="font-poly text-xl">Bio</div>
                  {!isEditing ? (
                    <div>{user.profile.bio}</div>
                  ) : (
                    <textarea
                      value={user.profile.bio}
                      className="bg-base-100 border-b-2 border-b-primary w-full h-96"
                      wrap="soft"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Profile;
