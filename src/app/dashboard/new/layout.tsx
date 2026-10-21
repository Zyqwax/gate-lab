import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create New Circuit & Templates',
  description:
    'Start a blank digital logic circuit canvas, import a JSON netlist, or choose from educational templates including Full Adder, Half Adder, SR Latch, and Clocked D Flip-Flop.',
  alternates: {
    canonical: '/dashboard/new',
  },
  openGraph: {
    title: 'Create New Circuit & Templates | GateLab',
    description:
      'Start a blank digital logic circuit canvas or explore pre-built logic gate templates in GateLab.',
    url: '/dashboard/new',
  },
};

export default function NewCircuitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
