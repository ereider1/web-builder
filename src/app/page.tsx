import { BuilderProvider } from "@/store/BuilderContext";
import { BuilderLayout } from "@/components/BuilderLayout";

export default function Home() {
  return (
    <BuilderProvider>
      <BuilderLayout />
    </BuilderProvider>
  );
}
