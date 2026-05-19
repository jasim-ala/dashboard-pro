import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function RootLandingPage() {
  // If the user is already authenticated, route them to their respective dashboard
  const { userId, sessionClaims } = auth();
  if (userId) {
    if (sessionClaims?.metadata?.role === 'Admin') {
      redirect("/admin");
    } else {
      redirect("/sales");
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-core)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-main)',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div className="brand-hexagon" style={{ marginBottom: '2rem', transform: 'scale(1.5)' }}>
        <div className="hexagon-inner">V</div>
      </div>
      
      <h1 style={{ 
        fontSize: '3rem', 
        fontWeight: '800', 
        letterSpacing: '4px', 
        fontFamily: 'var(--font-display)',
        marginBottom: '1rem',
        textShadow: '0 0 20px rgba(0,240,255,0.3)'
      }}>VALOIS B2B</h1>
      
      <p style={{
        fontSize: '1.2rem',
        color: 'var(--text-muted)',
        maxWidth: '600px',
        marginBottom: '3rem',
        lineHeight: '1.6'
      }}>
        Next-generation telemetry and sales operations portal for global apparel merchandising. Secure, fast, and insightful.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/sign-in" className="cyber-btn" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
          PARTNER LOGIN
        </Link>
        <Link href="/sign-up" className="cyber-btn cyber-sec-btn" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
          REQUEST ACCESS
        </Link>
      </div>
    </main>
  );
}
