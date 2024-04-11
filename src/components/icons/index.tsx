import Image from "next/image";
import LinkIconSrc from "public/icons/link.svg";
import XIconSrc from "public/icons/x.svg";
import KernelLogo from "public/images/kernel-big.png";

export const LinkIcon = () => (
  <Image src={LinkIconSrc} width={16} height={16} alt="link icon" />
);

export const XIcon = () => (
  <Image src={XIconSrc} width={12} height={12} alt="x icon" />
);

export const KernelIcon = () => (
  <Image src={KernelLogo} width={16} height={16} alt="kernel logo" />
);
