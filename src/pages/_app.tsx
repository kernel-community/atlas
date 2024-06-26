/* eslint-disable @typescript-eslint/no-misused-promises */
import { type AppType } from "next/dist/shared/lib/utils";
import { QueryClient, QueryClientProvider } from "react-query";
import "src/styles/globals.css";
import { NextSeo } from "next-seo";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react";
import { updateUser } from "src/utils/updateUser";
import { UserProvider } from "src/context/UserContext";
import { ThemeProvider } from "next-themes";
const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <NextSeo
        titleTemplate="Searchers | %s"
        defaultTitle="Kernel Searching Portal"
        description=""
        openGraph={{
          url: "https://searching.kernel.community",
          title: "Kernel Searching Portal",
          description: "",
          images: [
            {
              url: "",
              alt: "",
              type: "image/jpeg",
            },
          ],
          site_name: "Kernel Searching Portal",
        }}
        twitter={{
          handle: "@kernel0x",
          site: "https://kernel.community",
          cardType: "summary_large_image",
        }}
        additionalLinkTags={[
          {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap",
          },
          {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Poly:ital@0;1&display=swap",
          },
          {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap",
          },
          {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap",
          },
          {
            rel: "stylesheet",
            href: "https://fonts.googleapis.com/css2?family=Miriam+Libre:wght@400;700&display=swap",
          },
        ]}
      />
      <ThemeProvider defaultTheme="plant">
        <DynamicContextProvider
          settings={{
            environmentId: "15d3d3d6-52c6-4f80-aab5-f219e2f6991e",
            eventsCallbacks: {
              // create a new user
              onAuthSuccess: ({ user }) =>
                updateUser({
                  email: user.email,
                  id: user.userId, // @dev @note important
                }),
              // update existing user
              onUserProfileUpdate: (user) =>
                updateUser({
                  email: user.email,
                  id: user.userId, // @dev @note important
                }),
            },
          }}
        >
          <QueryClientProvider client={queryClient}>
            <UserProvider>
              <Component {...pageProps} />
            </UserProvider>
          </QueryClientProvider>
        </DynamicContextProvider>
      </ThemeProvider>
    </>
  );
};

export default MyApp;
