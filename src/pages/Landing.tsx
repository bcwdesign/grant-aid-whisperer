import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, Search, Calendar, BarChart3, Zap, Shield, ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  {
    icon: Search,
    title: "AI-Powered Discovery",
    description: "Automatically scan hundreds of grant sources and surface opportunities matching your nonprofit's mission.",
  },
  {
    icon: Calendar,
    title: "Deadline Tracking",
    description: "Never miss a deadline. Calendar views, email reminders, and configurable alerts keep you on track.",
  },
  {
    icon: BarChart3,
    title: "Pipeline Management",
    description: "Track every grant from discovery to award with a visual pipeline. Assign tasks and collaborate.",
  },
  {
    icon: Zap,
    title: "Daily Auto-Refresh",
    description: "Grants are refreshed daily so you always have the latest opportunities and updated deadlines.",
  },
  {
    icon: Shield,
    title: "Multi-Tenant Secure",
    description: "Your data is isolated and protected. Row-level security ensures only your team sees your grants.",
  },
  {
    icon: Compass,
    title: "Smart Matching",
    description: "Focus areas, location, and budget filters ensure you only see grants you're eligible for.",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Compass className="h-7 w-7 text-brand" />
            <span className="text-xl font-bold text-foreground">GrantPilot</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button variant="brand">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src={heroBg} alt="" className="h-full w-full object-cover" />
        </div>
        <div className="container relative mx-auto px-6 pb-20 pt-24 text-center">
          <div className="animate-fade-in mb-8 inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-1.5 text-sm text-brand">
            <Zap className="h-4 w-4" />
            AI-Powered Grant Discovery
          </div>
          <h1 className="animate-fade-in mx-auto max-w-4xl text-5xl font-bold leading-[1.1] tracking-tight text-foreground md:text-7xl">
            Find grants.
            <br />
            <span className="text-brand">Win funding.</span>
          </h1>
          <p className="animate-fade-in-delay mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            GrantPilot automatically discovers, tracks, and organizes grant opportunities
            for your nonprofit. Never miss a deadline again.
          </p>
          <div className="animate-fade-in-delay mt-10 flex items-center justify-center gap-4">
            <Link to="/signup">
              <Button variant="brand" size="lg" className="gap-2">
                Start Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border/50 bg-muted/30 py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-foreground">Everything you need to win grants</h2>
            <p className="mt-3 text-muted-foreground">From discovery to submission, GrantPilot has you covered.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-8 transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10">
                  <f.icon className="h-6 w-6 text-brand" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground">Ready to find your next grant?</h2>
          <p className="mt-3 text-muted-foreground">Join hundreds of nonprofits using GrantPilot to secure funding.</p>
          <Link to="/signup">
            <Button variant="brand" size="lg" className="mt-8 gap-2">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto flex items-center justify-between px-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-brand" />
            <span>GrantPilot</span>
          </div>
          <span>© 2026 GrantPilot. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
