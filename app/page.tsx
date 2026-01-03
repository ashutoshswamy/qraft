import Background from "./components/Background";
import QRGenerator from "./components/QRGenerator";

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <Background />
      <QRGenerator />
    </main>
  );
}
