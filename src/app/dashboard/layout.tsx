import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — My Circuit Projects',
  description:
    'Manage, export, and simulate your saved digital logic circuit designs and templates in GateLab.',
  alternates: {
    canonical: '/dashboard',
  },
  openGraph: {
    title: 'Dashboard — My Circuit Projects | GateLab',
    description:
      'Manage, export, and simulate your saved digital logic circuit designs and templates in GateLab.',
    url: '/dashboard',
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
