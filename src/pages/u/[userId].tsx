/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/ban-ts-comment */
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
import { useEffect, useState } from "react";
import { type UserProfile } from "src/@types";
import { type Prisma } from "@prisma/client";
import { updateUser } from "src/utils/updateUser";
import user from "../api/query/user";
import { isEqual, pick } from "lodash";

const Profile = () => {
  const { query } = useRouter();
  const { userId } = query;
  const { user, refetch: refetchUser } = useUserFromUserId({
    userId: userId?.toString(),
  });
  const { fetchedUser } = useUser();
  const isEditable = fetchedUser.id === user?.id;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [attributes, setAttributes] = useState<UserProfile>();

  const onClickSave = async () => {
    if (isEqual(user, attributes)) return;
    const toUpdateProfile = pick(
      attributes?.profile,
      "affiliation",
      "affliationDescription",
      "website",
      "twitter",
      "photo",
      "bio",
    );
    const toUpdate: Prisma.UserUpdateInput = {
      name: attributes?.name,
      id: user?.id,
      profile: {
        update: {
          where: {
            userId: user?.id,
          },
          data: {
            ...toUpdateProfile,
          },
        },
      },
    };

    await updateUser(toUpdate);

    await refetchUser();

    setIsEditing(false);
    return;
  };

  // if attributes is undefined (on page load)
  // set attributes to fetched user details
  useEffect(() => {
    if (!attributes) {
      setAttributes(() => user);
    }
  }, [user]);

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
              src={attributes?.profile?.photo ?? ""}
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
                  src={attributes?.profile?.photo ?? ""}
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
                    onClick={() => onClickSave()}
                  >
                    <CheckmarkIcon />
                    Save
                  </div>
                )}
                {!isEditing ? (
                  <div className="font-poly text-5xl text-right">
                    {attributes?.name}
                  </div>
                ) : (
                  <div>
                    <input
                      className="font-poly text-5xl text-right bg-base-100 border-b-2 border-b-primary"
                      defaultValue={attributes?.name ?? ""}
                      onChange={(event) => {
                        setAttributes((attr) => {
                          return {
                            ...attr,
                            name: event.target.value,
                          };
                        });
                      }}
                    ></input>
                  </div>
                )}
                <div className="font-poly text-3xl italic text-right">
                  <span className="text-2xl">crafting</span>{" "}
                  {!isEditing && attributes?.profile?.affiliation ? (
                    <>
                      <span>{attributes?.profile?.affiliation}</span>
                    </>
                  ) : (
                    <>
                      <input
                        className="bg-base-100 border-b-2 border-b-primary"
                        defaultValue={attributes?.profile?.affiliation ?? ""}
                        onChange={(event) => {
                          // @ts-ignore
                          setAttributes((attr) => {
                            return {
                              ...attr,
                              profile: {
                                ...attr?.profile,
                                affiliation: event.target.value ?? "",
                              },
                            };
                          });
                        }}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-3 py-3">
              {!isEditing && (
                <>
                  {attributes?.profile?.website && (
                    <Pill
                      icon={<LinkIcon />}
                      label="website"
                      href={attributes?.profile?.website}
                      highlight
                    />
                  )}
                  {user.profile?.twitter && (
                    <Pill
                      icon={<XIcon />}
                      label={attributes?.profile?.twitter ?? ""}
                      href={`https://x.com/` + user.profile?.twitter}
                    />
                  )}
                  {user && user.block?.toString() !== "-1" && (
                    <Pill
                      icon={<KernelIcon />}
                      label={
                        user.block === 0
                          ? `Genesis Block`
                          : `Block ${user.block}`
                      }
                      gray
                    />
                  )}
                </>
              )}
              {isEditing && (
                <div className="flex flex-col gap-2 w-full">
                  <input
                    type="text"
                    className="grow bg-base-100 border-2 rounded-md p-2 w-full"
                    placeholder="website"
                    defaultValue={attributes?.profile?.website ?? ""}
                    onChange={(event) => {
                      // @ts-ignore
                      setAttributes((attr) => {
                        return {
                          ...attr,
                          profile: {
                            ...attr?.profile,
                            website: event.target.value ?? "",
                          },
                        };
                      });
                    }}
                  />
                  <input
                    type="text"
                    className="grow bg-base-100 border-2 rounded-md p-2 w-full"
                    placeholder="x.com username"
                    defaultValue={attributes?.profile?.twitter ?? ""}
                    onChange={(event) => {
                      // @ts-ignore
                      setAttributes((attr) => {
                        return {
                          ...attr,
                          profile: {
                            ...attr?.profile,
                            twitter: event.target.value ?? "",
                          },
                        };
                      });
                    }}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col gap-3 text-left">
              <div className="">
                <div className="font-poly text-xl">Affiliation</div>
                {!isEditing && attributes?.profile?.affliationDescription ? (
                  <div>{attributes.profile.affliationDescription}</div>
                ) : (
                  <textarea
                    defaultValue={
                      attributes?.profile?.affliationDescription ??
                      "What is your current focus?"
                    }
                    className="bg-base-100 border-b-2 border-b-primary w-full h-10"
                    wrap="soft"
                    onChange={(event) => {
                      // @ts-ignore
                      setAttributes((attr) => {
                        return {
                          ...attr,
                          profile: {
                            ...attr?.profile,
                            affliationDescription: event.target.value ?? "",
                          },
                        };
                      });
                    }}
                  />
                )}
              </div>

              <div>
                <div className="font-poly text-xl">Bio</div>
                {!isEditing && attributes?.profile?.bio ? (
                  <div>{attributes.profile.bio}</div>
                ) : (
                  <textarea
                    defaultValue={attributes?.profile?.bio ?? ""}
                    className="bg-base-100 border-b-2 border-b-primary w-full h-96"
                    wrap="soft"
                    onChange={(event) => {
                      // @ts-ignore
                      setAttributes((attr) => {
                        return {
                          ...attr,
                          profile: {
                            ...attr?.profile,
                            bio: event.target.value ?? "",
                          },
                        };
                      });
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default Profile;
