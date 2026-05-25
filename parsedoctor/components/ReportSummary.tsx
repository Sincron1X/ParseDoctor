"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    Tooltip,
  } from "recharts";

export function ReportSummary({
    reportData,
    groupFightsByBoss,
  }: {
    reportData: any;
    groupFightsByBoss: (fights: any[]) => Record<string, any[]>;
  }) {
    if (!reportData) return null;

    const [openBoss, setOpenBoss] = useState<string | null>(null);
    const toggleBoss = (bossName: string) => {
      setOpenBoss(openBoss === bossName ? null : bossName);
    };

    const groupedFights = Object.entries(groupFightsByBoss(reportData.fights));

    const chartData = groupedFights.map(([bossName, fights]: any) => {
    const kills = fights.filter((f: any) => f.kill).length;
    const wipes = fights.length - kills;

    const score = Math.min(
    100,
    Math.max(0, 100 - wipes * 5 + (kills > 0 ? 10 : 0))
  );
  
  

  return {
    name: bossName.length > 14 ? bossName.slice(0, 14) + "..." : bossName,
    score,
  };
    }).sort((a: any, b: any) => a.score - b.score);
    const raidScore =
    chartData.length > 0
    ? Math.round(
        chartData.reduce(
          (total: number, boss: any) => total + boss.score,
          0
        ) / chartData.length
      )
    : 0;

    const raidSummary =
    raidScore >= 90
      ? "Strong raid performance. Most bosses look stable, with only minor execution gaps."
      : raidScore >= 70
      ? "Solid progression, but several fights still show consistency issues."
      : raidScore >= 50
      ? "Raid is unstable. Focus on repeated wipes, deaths, and mechanic execution."
      : "Critical raid performance. Major execution problems detected across multiple bosses.";
    

    return (
      <section className="mx-auto max-w-4xl px-6 py-10 text-white">
        <h2 className="text-3xl font-bold">{reportData.title}</h2>
  
        <p className="mt-2 text-slate-400">
          Owner: {reportData.owner.name}
        </p>

        <div
          className={`mt-4 inline-flex rounded-full border px-4 py-2 text-sm font-bold ${
            raidScore < 50
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : raidScore < 80
              ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
              : "border-green-500/30 bg-green-500/10 text-green-300"
          }`}
        >
          Raid Score: {raidScore}/100
        </div>
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            <div className="mb-1 text-xs font-bold uppercase tracking-widest text-violet-300">
              AI Raid Summary
            </div>
            {raidSummary}
          </div>
        
        
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-4 text-lg font-semibold text-sm leading-relaxed text-white">
        Boss Score Overview
        </div>

        <div className="max-h-56 space-y-3 overflow-y-auto pr-2">
            {chartData.map((boss: any) => (
            <div key={boss.name}>
            <div className="mb-1 flex justify-between text-xs text-slate-400">
                <span>{boss.name}</span>
                <span>{boss.score}/100</span>
            </div>

            <div className="h-2 rounded-full bg-white/10">
                <div
                className={`h-2 rounded-full ${
                  boss.score < 50
                    ? "bg-red-500"
                    : boss.score < 80
                    ? "bg-yellow-400"
                    : "bg-green-500"
                }`}
                style={{ width: `${boss.score}%` }}
                />
            </div>
            </div>
        ))}
        </div>

        </div>

        <div className="mt-6 space-y-3">
          {Object.entries(groupFightsByBoss(reportData.fights)).map(
            ([bossName, fights]: any, index: number) => {
              const kills = fights.filter((f: any) => f.kill).length;
              const wipes = fights.length - kills;
              const status = kills > 0 ? "Killed" : "Wiped";
              const score = Math.min(100, Math.max(0, 100 - wipes * 5 + (kills > 0 ? 10 : 0)));
              const progress =
                fights.length > 0 ? Math.round((kills / fights.length) * 100) : 0;

                const progressWidth = `${progress}%`;

                const killRate = Math.round((kills / fights.length) * 100);

                const diagnosis =
                    kills > 0
                    ? "Boss killed. Good execution."
                    : wipes >= 20
                    ? "High wipe count detected. Execution issue."
                    : wipes >= 5
                    ? "Progression wall detected."
                    : "Early progression data.";

                    const severity =
                    
                        kills > 0
                        ? "stable"
                        : wipes >= 20
                        ? "critical"
                        : wipes >= 5
                        ? "warning"
                        : "info";

                        const chartData = [
                            {
                              name:
                                bossName.length > 12
                                  ? bossName.slice(0, 12) + "..."
                                  : bossName,
                              score,
                            },
                          ];

                        const severityLabel =
                            severity === "critical"
                            ? "CRITICAL"
                            : severity === "warning"
                            ? "WARNING"
                            : severity === "stable"
                            ? "STABLE"
                            : "INFO";

                        

                const averageDurationMs =
                    fights.reduce((total: number, fight: any) => {
                    return total + (fight.endTime - fight.startTime);
                    }, 0) / fights.length;

                    const averageTotalSeconds = Math.floor(averageDurationMs / 1000);
                    const averageMinutes = Math.floor(averageTotalSeconds / 60);
                    const averageSeconds = averageTotalSeconds % 60;

                    const recommendation =
                            kills > 0
                                ? "Boss is killable. Focus on consistency and clean reclears."
                                : wipes >= 20 && averageMinutes < 2
                                ? "Raid is dying too early. Review opening positioning, defensives and first mechanic execution."
                                : wipes >= 20
                                ? "High wipe wall. Review deaths, phase transitions and cooldown planning."
                                : wipes >= 5
                                ? "Progression is building. Keep collecting pulls and identify repeated mistakes."
                                : "Not enough data yet. Upload more pulls for stronger analysis.";
  
              const bestFight = fights.reduce((best: any, current: any) => {
                const bestDuration = best.endTime - best.startTime;
                const currentDuration = current.endTime - current.startTime;
  
                return currentDuration > bestDuration ? current : best;
              });
  
              const durationMs = bestFight.endTime - bestFight.startTime;
              const totalSeconds = Math.floor(durationMs / 1000);
              const minutes = Math.floor(totalSeconds / 60);
              const seconds = totalSeconds % 60;
  
              return (
                <div
                    key={index}
                    onClick={() => toggleBoss(bossName)}
                    className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-violet-500/40 hover:bg-white/10"
                    >
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-bold">{bossName}</h3>
  
                      <div className="text-sm text-slate-400 space-y-1">
                        <div>
                            Pulls: {fights.length} · Wipes: {wipes} · Kills: {kills}
                                </div>

                                 <div>
                                     Avg Pull: {averageMinutes}m {averageSeconds}s
                                     </div>

                                    <div>
                                        Kill Rate: {killRate}%
                                        </div>
                                            </div>
                      <div className="mt-3 h-2 w-56 rounded-full bg-white/10">
                      <div
                            className={`h-2 rounded-full ${
                            progress === 0
                            ? "bg-red-500"
                            : progress >= 100
                            ? "bg-green-500"
                            : "bg-yellow-400"
                            }`}
                            style={{ width: progressWidth }}
                            />
                        </div>
                        {openBoss === bossName && (
                        <div
                             className={`mt-3 rounded-xl border px-3 py-2 text-sm ${
                                severity === "critical"
                                ? "border-red-500/30 bg-red-500/10 text-red-200"
                                : severity === "warning"
                                ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-200"
                                : severity === "stable"
                                ? "border-green-500/30 bg-green-500/10 text-green-200"
                                : "border-white/10 bg-black/20 text-slate-300"
                                }`}
                                >
                                <div className="mb-1 text-[10px] font-bold tracking-widest opacity-70">
                                    {severityLabel}
                                    </div>

                                    <div>{diagnosis}</div>
                                    </div>
                                    )}

                                    <AnimatePresence>
                                    {openBoss === bossName && (
                                    <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-4 overflow-hidden rounded-xl border border-violet-500/20 bg-violet-500/10 p-5 text-sm text-slate-300 shadow-lg shadow-violet-950/30"
                                    >
                                    <div className="font-bold text-violet-300">Boss Details</div>

                                    <div className="mt-3 grid gap-3 md:grid-cols-3">
                                        <div>
                                        <div className="text-[10px] uppercase tracking-widest text-slate-500">Top Issue</div>
                                        <div className="font-semibold text-white">
                                            {wipes >= 20 ? "Execution consistency" : "Limited data"}
                                        </div>
                                        </div>

                                        <div>
                                        <div className="text-[10px] uppercase tracking-widest text-slate-500">Recommendation</div>
                                        <div className="font-semibold text-white">
                                            {wipes >= 20 ? "Review deaths and phase transitions" : "Collect more pulls"}
                                        </div>
                                        </div>

                                        <div>
                                        <div className="text-[10px] uppercase tracking-widest text-slate-500">Confidence</div>
                                        <div className="font-semibold text-white">
                                            {fights.length >= 10 ? "High" : "Low"}
                                        </div>
                                        </div>
                                    </div>
                                    
                                    </motion.div>
                                )}
                                </AnimatePresence>
                    </div>
  
                    <div className="text-right">
                      <div
                        className={
                          kills > 0
                            ? "text-sm font-bold text-green-400"
                            : "text-sm font-bold text-red-400"
                        }
                      >
                        {status}
                        <div
                         className={`text-sm font-bold ${
                         score >= 80
                        ? "text-green-400"
                        : score >= 50
                        ? "text-yellow-400"
                         : "text-red-400"
                        }`}
                        >
                        Score {score}/100
                        </div>
                      </div>
  
                      <div className="text-sm text-slate-400">Best Pull</div>
  
                      <div className="font-semibold text-violet-300">
                        {minutes}m {seconds}s
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </section>
    );
  }