import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Circuit Simulator & Visual Schematic Editor',
  description:
    'Interactive visual logic gate schematic editor with real-time 4-valued netlist simulation, propagation delay, and automated truth table generation.',
  alternates: {
    canonical: '/dashboard/editor',
  },
  openGraph: {
    title: 'Circuit Simulator & Visual Schematic Editor | GateLab',
    description:
      'Interactive visual logic gate schematic editor with real-time 4-valued netlist simulation and automated truth table generation.',
    url: '/dashboard/editor',
  },
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
