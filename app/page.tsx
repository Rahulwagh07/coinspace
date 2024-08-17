import Hero from '@/components/Hero';
import Redirect from "@/components/Redirect";

export default function Home() {
  return (
    <main>
      <Redirect />
      <Hero />
    </main>
  );
}