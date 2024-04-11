import Image from "next/image";
import LinkIconSrc from "public/icons/link.svg";
import XIconSrc from "public/icons/x.svg";
import KernelLogoSrc from "public/images/kernel-big.png";
import EditIconSrc from "public/icons/edit.svg";
import CheckIconSrc from "public/icons/check.svg";

export const LinkIcon = () => (
  <Image src={LinkIconSrc} width={16} height={16} alt="link icon" />
);

export const XIcon = () => (
  <Image src={XIconSrc} width={12} height={12} alt="x icon" />
);

export const KernelIcon = () => (
  <Image src={KernelLogoSrc} width={16} height={16} alt="kernel logo" />
);

export const EditIcon = () => (
  <Image src={EditIconSrc} width={16} height={16} alt="edit icon" />
);

export const CheckmarkIcon = () => (
  <Image src={CheckIconSrc} width={16} height={16} alt="edit icon" />
);
