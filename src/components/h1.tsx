import clsx, { ClassValue } from "clsx";

export default function H1({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: ClassValue;
}) {
  return (
    <h2
      className={clsx(
        "text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100",
        className
      )}
    >
      {children}
    </h2>
  );
}
