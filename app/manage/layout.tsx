export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="xs:px-16 md:px-20 py-24 flex justify-center items-center">
      {children}
    </div>
  );
}
