import { type ReactElement } from "react";

export const Pill = ({
  icon,
  label,
  href,
  highlight,
  gray,
}: {
  icon: ReactElement;
  label: string;
  href?: string | null;
  highlight?: boolean;
  gray?: boolean;
}) => {
  const style = `rounded-full text-xs border-2 p-2 flex flex-row gap-3 items-center ${highlight ? "bg-primary text-neutral" : ""} ${gray ? "bg-base-200" : ""}`;
  if (href) {
    return (
      <a href={href} className={style} target="_blank">
        {icon} {label}
      </a>
    );
  }
  return (
    <div className={style}>
      {icon} {label}
    </div>
  );
};
