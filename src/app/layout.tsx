import '../index.css';

export const metadata = {
  title: '∴∵∴ ୨୧ 체크리스트 ୨୧ ∴∵∴',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <title>{'∴∵∴ ୨୧ 체크리스트 ୨୧ ∴∵∴'}</title>
      </head>
      <body className="min-h-screen bg-gradient-to-t from-blue-50 via-indigo-100 to-white">
        {children}
      </body>
    </html>
  )
}
