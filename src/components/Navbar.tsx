import Link from "next/link";
import { DynamicLoginButton } from "src/components/RetroButton";
import KernelLogo from "public/images/kernel-big.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
// import { ThemeChanger } from "./ThemeChanger";

const APPS = {
  SEARCH: {
    label: "search",
    name: "Search",
  },
  EXPLORE: {
    label: "explore",
    name: "Explore",
  },
};

const DEFAULT_APP_NAME = "Atlas";

const getAppName = (path: string) => {
  for (const app of Object.values(APPS)) {
    if (path.includes(app.label)) {
      return app.name;
    }
  }
  return DEFAULT_APP_NAME;
};

const Branding = () => {
  const pathname = usePathname();
  console.log({ pathname });
  console.log("app name:", getAppName(pathname));
  return (
    <div className="tracking-tight cursor-pointer font-futura flex flex-row gap-2">
      <Image src={KernelLogo} width={24} height={24} alt="kernel logo" />
      <div>/</div>
      <Link href={"/"}>Atlas</Link>
      {getAppName(pathname) !== DEFAULT_APP_NAME && (
        <>
          <div>/</div>
          <Link href={pathname}>{getAppName(pathname)}</Link>
        </>
      )}
    </div>
  );
};
export default function Navbar() {
  return (
    <div className="navbar flex flex-row justify-between border-2 border-primary-content">
      <Branding />
      <div className="md:flex-row md:gap-2 items-center hidden md:flex">
        <DynamicLoginButton />
      </div>
      <div className="md:hidden block drawer z-50 float-right w-fit">
        <input
          id="my-drawer"
          type="checkbox"
          className="drawer-toggle"
          readOnly
        />
        <div className="drawer-content">
          <label
            htmlFor="my-drawer"
            className="btn btn-primary btn-sm drawer-button"
          >
            Menu
          </label>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <div className="menu w-80 p-4 min-h-full bg-base-200 text-base-content">
            <div className="flex flex-col gap-6 [&>*]:bg-base-100 [&>*]:p-2 [&>*]:rounded-md">
              <div className="flex flex-col gap-2">
                <DynamicLoginButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
