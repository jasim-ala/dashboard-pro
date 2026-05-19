import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignInPage() {
  return (
    <section className="auth-section" id="auth-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-core)' }}>
      {/* Background elements */}
      <canvas id="particle-canvas" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}></canvas>
      
      <div className="auth-brand" style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', zIndex: 10 }}>
        <div className="brand-hexagon">
          <div className="hexagon-inner">V</div>
        </div>
        <h1>VALOIS</h1>
        <p className="brand-tagline">B2B PARTNER LOG IN</p>
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>
        <SignIn 
          routing="hash"
          appearance={{
            baseTheme: dark,
            elements: {
              card: "glass-panel",
              formButtonPrimary: "cyber-btn",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            }
          }}
          fallbackRedirectUrl="/sales"
          signUpFallbackRedirectUrl="/sales"
        />
      </div>
    </section>
  );
}
