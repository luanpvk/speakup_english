import Image from "next/image";

interface ErrorScreenProps {
  code?: string;
  title: string;
  text: string;
  children?: React.ReactNode;
}

/** Tela de erro com o mascote (404, falhas inesperadas). */
export function ErrorScreen({ code, title, text, children }: ErrorScreenProps) {
  return (
    <main id="main-content" className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-14 text-center">
      <Image src="/mascot.png" alt="" width={140} height={140} loading="eager" className="animate-float-gentle" />
      {code && (
        <p className="mt-4 font-display text-6xl font-bold text-primary md:text-7xl" aria-hidden>
          {code}
        </p>
      )}
      <h1 className="mt-2 font-display text-2xl font-bold md:text-3xl">{title}</h1>
      <p className="mt-2 max-w-md text-muted-foreground">{text}</p>
      {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
    </main>
  );
}
