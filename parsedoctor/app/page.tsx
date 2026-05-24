"use client";

import { ReportSummary } from "@/components/ReportSummary";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Brain, Skull, ShieldAlert, Zap, Search, Stethoscope, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ParseDoctorLanding() {
  const [mode, setMode] = useState("coach");
  const [logUrl, setLogUrl] = useState("");
  const [reportData, setReportData] = useState<any>(null);
  function extractReportCode(url: string) {
    const match = url.match(/reports\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  }
  
  async function testConnection() {

    const reportCode = extractReportCode(logUrl);
  
    if (!reportCode) {
      alert("Please enter a valid Warcraft Logs URL.");
      return;
    }
  
    try {
      const response = await fetch(`/api/report?code=${reportCode}`);
      const data = await response.json();
  
      console.log("REPORT DATA:", data);
  
      setReportData(data.data.reportData.report);
    } catch (error) {
      console.error("Failed to fetch report:", error);
      alert("Failed to fetch Warcraft Logs report.");
    }
  }
  
  function groupFightsByBoss(fights: any[]) {
    const grouped: Record<string, any[]> = {};
  
    fights.forEach((fight) => {
      const bossName = fight.name || "Unknown";
  
      if (!grouped[bossName]) {
        grouped[bossName] = [];
      }
  
      grouped[bossName].push(fight);
    });
  
    return grouped;
  }

  return (
    <div className="min-h-screen bg-[#070812] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.25),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(14,165,233,0.16),_transparent_28%),radial-gradient(circle_at_50%_80%,_rgba(34,197,94,0.10),_transparent_30%)]" />
      <div className="relative z-10">
        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 shadow-lg shadow-violet-900/40">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight">ParseDoctor</div>
              <div className="text-xs uppercase tracking-[0.28em] text-violet-300">Raid Diagnosis AI</div>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#demo" className="hover:text-white">Demo</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
          </nav>
          <Button className="rounded-2xl bg-white px-5 text-black hover:bg-slate-200">Join Beta</Button>
        </header>

        <main>
        <ReportSummary
  reportData={reportData}
  groupFightsByBoss={groupFightsByBoss}
/>
          <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-20 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-200">
                <Sparkles className="h-4 w-4" />
                AI-powered Warcraft Logs analysis
              </div>
              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
                Upload your logs. <span className="text-violet-400">Fix your gameplay.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                ParseDoctor turns Warcraft Logs into clear, brutal, useful feedback. Find your mistakes, understand your deaths, and stop griefing your raid.
              </p>

              <div id="demo" className="mt-9 rounded-3xl border border-white/10 bg-white/[0.04] p-3 shadow-2xl shadow-violet-950/40 backdrop-blur">
                <div className="flex flex-col gap-3 md:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                    <input
                      value={logUrl}
                      onChange={(e) => setLogUrl(e.target.value)}
                      placeholder="Paste Warcraft Logs URL..."
                      className="h-14 w-full rounded-2xl border border-white/10 bg-black/40 pl-12 pr-4 text-sm outline-none ring-violet-500 transition focus:ring-2"
                    />
                  </div>
                  <Button
                    onClick={testConnection}
                     className="h-14 rounded-2xl bg-violet-600 px-8 text-base font-bold hover:bg-violet-500"
                  >
                    Analyze Logs
                  </Button>
                </div>
                <div className="mt-3 flex rounded-2xl bg-black/30 p-1 text-sm">
                  <button
                    onClick={() => setMode("coach")}
                    className={`flex-1 rounded-xl px-4 py-3 font-semibold transition ${mode === "coach" ? "bg-sky-500 text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    Coach Mode
                  </button>
                  <button
                    onClick={() => setMode("brutal")}
                    className={`flex-1 rounded-xl px-4 py-3 font-semibold transition ${mode === "brutal" ? "bg-red-500 text-white" : "text-slate-400 hover:text-white"}`}
                  >
                    Brutal Mode
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <Card className="rounded-[2rem] border-white/10 bg-slate-950/70 text-white shadow-2xl shadow-violet-950/50 backdrop-blur">
                <CardContent className="p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <div className="text-sm text-slate-400">Diagnosis Report</div>
                      <div className="text-2xl font-black">Unholy DK — Heroic Boss</div>
                    </div>
                    <div className="rounded-2xl bg-emerald-500/15 px-4 py-2 text-sm font-bold text-emerald-300">Score 72/100</div>
                  </div>

                  <div className="grid gap-4">
                    <ReportItem icon={<Zap />} title="Cooldown Drift" value="Major Issue" text="Your main cooldowns drifted out of burst windows after the first minute." tone="warning" />
                    <ReportItem icon={<Skull />} title="Death Analysis" value="Avoidable" text="You died to repeatable ground damage. Not unlucky. Just illegal movement." tone="danger" />
                    <ReportItem icon={<Activity />} title="Uptime" value="82%" text="You lost too much uptime during movement-heavy phases." tone="neutral" />
                    <ReportItem icon={<Brain />} title={mode === "coach" ? "Coach Verdict" : "Brutal Verdict"} value={mode === "coach" ? "Fixable" : "Raid Hazard"} text={mode === "coach" ? "Your damage profile is promising, but cooldown discipline and positioning need work." : "Your opener was good, then your rotation filed for unemployment."} tone={mode === "coach" ? "neutral" : "danger"} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </section>

          
          <section id="features" className="mx-auto max-w-7xl px-6 py-20">
            <div className="mb-12 max-w-3xl">
              <h2 className="text-4xl font-black tracking-tight md:text-5xl">Built for raiders who want the truth.</h2>
              <p className="mt-5 text-lg leading-8 text-slate-300">No endless dashboards. No confusing tabs. ParseDoctor gives you the mistakes that actually matter.</p>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <Feature icon={<Activity />} title="Performance Breakdown" text="DPS, uptime, casts, resource waste, and key mistakes explained in plain English." />
              <Feature icon={<ShieldAlert />} title="Death Diagnostics" text="Understand whether you died to bad positioning, poor cooldowns, or healer problems." />
              <Feature icon={<Skull />} title="Brutal Mode" text="Shareable, savage, raid-safe honesty for players who can handle the diagnosis." />
            </div>
          </section>

          <section id="pricing" className="mx-auto max-w-7xl px-6 pb-24">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 md:p-12">
              <div className="grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-center">
                <div>
                  <h2 className="text-4xl font-black">Start with a free diagnosis.</h2>
                  <p className="mt-4 max-w-2xl text-slate-300">Beta access will include limited free analyses. Premium will unlock advanced reports, history tracking, and guild tools.</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
                  <Button className="rounded-2xl bg-violet-600 px-7 py-6 text-base font-bold hover:bg-violet-500">Join Beta</Button>
                  <Button variant="outline" className="rounded-2xl border-white/15 bg-transparent px-7 py-6 text-base text-white hover:bg-white/10">View Roadmap</Button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function ReportItem({
  icon,
  title,
  value,
  text,
  tone,
}: {
  icon: React.ReactElement<{ className?: string }>;
  title: string;
  value: string;
  text: string;
  tone: "danger" | "warning" | "neutral";
}) {
  const toneClass = {
    danger: "bg-red-500/15 text-red-300 border-red-500/20",
    warning: "bg-amber-500/15 text-amber-300 border-amber-500/20",
    neutral: "bg-sky-500/15 text-sky-300 border-sky-500/20",
  }[tone];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-start gap-4">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${toneClass}`}>{React.cloneElement(icon, { className: "h-5 w-5" })}</div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-bold">{title}</h3>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-200">{value}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactElement<{ className?: string }>;
  title: string;
  text: string;
}) {
  return (
    <Card className="rounded-[2rem] border-white/10 bg-slate-950/60 text-white">
      <CardContent className="p-7">
        <div className="mb-6 flex h-13 w-13 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
          {React.cloneElement(icon, { className: "h-6 w-6" })}
        </div>
        <h3 className="text-xl font-black">{title}</h3>
        <p className="mt-3 leading-7 text-slate-400">{text}</p>
      </CardContent>
    </Card>
  );
}
