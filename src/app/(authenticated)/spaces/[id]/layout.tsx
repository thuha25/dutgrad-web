import SpaceProvider from "@/context/space.context";

export default function SpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SpaceProvider>{children}</SpaceProvider>;
}
