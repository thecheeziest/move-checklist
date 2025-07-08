import '../index.css';

export const metadata = {
  title: '∴∵∴ ୨୧ 𝘾𝙝𝙚𝙘𝙠𝙡𝙞𝙨𝙩 ୨୧ ∴∵∴',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gradient-to-t from-blue-50 via-indigo-100 to-white">
        {children}
      </body>
    </html>
  )
}
