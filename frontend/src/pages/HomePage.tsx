import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BloodGroupBadge } from "@/components/BloodGroupBadge";
import { BLOOD_GROUPS } from "@/lib/mockData";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, Search, Users, ShieldCheck, Activity, MapPin } from "lucide-react";
import heroImage from "@/assets/hero-donation.jpg";

const quotes = [
  { text: "The blood you donate gives someone another chance at life.", author: "WHO" },
  { text: "A single pint can save three lives, a single gesture can create a million smiles.", author: "Anonymous" },
  { text: "Donating blood is a small act with an extraordinary impact.", author: "Red Cross" },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container grid gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div className="flex flex-col justify-center animate-fade-up">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
              <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-primary" />
              Saving lives, one drop at a time
            </span>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
              Be a hero. <br />
              <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Donate blood.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Connect donors with patients in real-time. Find blood near you, manage requests,
              and join a community of life-savers — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/signup?role=donor">
                  <Heart className="h-5 w-5" fill="currentColor" /> Become a Donor
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/search">
                  <Search className="h-5 w-5" /> Request Blood
                </Link>
              </Button>
            </div>
            <div className="mt-10 flex items-center gap-8 text-sm text-muted-foreground">
              <Stat label="Active donors" value="12K+" />
              <Stat label="Lives saved" value="48K+" />
              <Stat label="Hospitals" value="320+" />
            </div>
          </div>

          <div className="relative animate-fade-up [animation-delay:120ms]">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-primary opacity-20 blur-3xl" />
            <img
              src={heroImage}
              alt="Hands holding a red heart symbolizing blood donation"
              width={1536}
              height={1024}
              className="rounded-[2rem] object-cover shadow-elegant"
            />
            <Card className="absolute -bottom-6 -left-6 hidden items-center gap-3 border-border/60 bg-card/95 p-4 shadow-elegant backdrop-blur-md md:flex">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10">
                <Activity className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Right now</p>
                <p className="text-sm font-semibold">3 lives being saved</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Blood Group Availability */}
      <section className="container py-20">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium text-primary">Live inventory</p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
              Blood availability across the network
            </h2>
          </div>
          <Button asChild variant="soft">
            <Link to="/search">View full inventory <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {BLOOD_GROUPS.map((g, i) => (
            <Card
              key={g}
              className="group relative flex flex-col items-center gap-3 overflow-hidden border-border/60 bg-gradient-card p-6 text-center shadow-soft transition-smooth hover:-translate-y-1 hover:shadow-elegant"
            >
              <BloodGroupBadge group={g} size="lg" className="animate-drop" />
              <p className="text-2xl font-bold">{[42, 18, 35, 9, 14, 6, 58, 22][i]}</p>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">units available</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/40 py-20">
        <div className="container">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              How LifeDrop works
            </h2>
            <p className="mt-4 text-muted-foreground">
              A simple, secure platform connecting donors, patients, and hospitals.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Users, title: "Register as donor", desc: "Sign up in seconds and join thousands of life-savers in your city." },
              { icon: Search, title: "Find blood instantly", desc: "Search live inventory and connect with available donors nearby." },
              { icon: ShieldCheck, title: "Verified & secure", desc: "All donors and hospitals are verified for your complete peace of mind." },
            ].map((f) => (
              <Card key={f.title} className="border-border/60 bg-card p-8 shadow-soft transition-smooth hover:shadow-elegant">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-soft">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quotes */}
      <section className="container py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {quotes.map((q) => (
            <Card key={q.text} className="border-border/60 bg-gradient-card p-8 shadow-soft">
              <Heart className="h-6 w-6 text-primary" fill="currentColor" />
              <p className="mt-4 text-lg leading-relaxed">"{q.text}"</p>
              <p className="mt-4 text-sm text-muted-foreground">— {q.author}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <Card className="relative overflow-hidden border-0 bg-gradient-primary p-10 text-center text-primary-foreground shadow-elegant md:p-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_60%)]" />
          <div className="relative">
            <h2 className="text-3xl font-bold md:text-4xl">Your blood. Their second chance.</h2>
            <p className="mx-auto mt-4 max-w-xl text-primary-foreground/85">
              Join LifeDrop today and become part of a community committed to saving lives every single day.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="secondary" size="xl">
                <Link to="/signup">Get started — it's free <ArrowRight className="h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>

      <footer className="border-t border-border/60 py-10">
        <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <p>© 2025 LifeDrop. Saving lives together.</p>
          <p className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Available across 320+ hospitals</p>
        </div>
      </footer>
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-2xl font-bold text-foreground">{value}</p>
    <p className="text-xs uppercase tracking-wider">{label}</p>
  </div>
);

export default HomePage;
