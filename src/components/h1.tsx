export default function H1({ children }: { children?: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
      {children}
    </h2>
  );
}
