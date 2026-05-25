import './globals.css';

export const metadata = {
  title: 'CineRate - Movie Review Website',
  description: 'A clean movie review website built with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
