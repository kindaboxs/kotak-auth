import { GetStartedButton } from "@/components/global/get-started-button";

export default function HomePage() {
  return (
    <section className="flex min-h-svh items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-8">
        <h1 className="text-6xl font-bold">Kotak Auth</h1>

        <GetStartedButton />
      </div>
    </section>
  );
}
