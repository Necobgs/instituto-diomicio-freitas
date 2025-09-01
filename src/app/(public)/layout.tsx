export default function RootPublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    return (
        <section className="flex-1 flex items-center justify-center w-full h-full bg-red-400">
            {children}
        </section>
    )
}