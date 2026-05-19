import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

export const metadata = {
  title: 'VALOIS // B2B Sales & Admin Dashboard',
  description: 'Valois B2B - Professional B2B Sales & Administration dashboard for modern apparel and lifestyle brands.',
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet" />
          
          <link rel="stylesheet" href="/css/main.css" />
          <link rel="stylesheet" href="/css/auth.css" />
          <link rel="stylesheet" href="/css/dashboard.css" />
          <link rel="stylesheet" href="/css/components.css" />
          <link rel="stylesheet" href="/css/admin-panel.css" />
        </head>
        <body className="space-theme light-theme">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
