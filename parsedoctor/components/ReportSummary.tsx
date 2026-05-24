export function ReportSummary({
    reportData,
    groupFightsByBoss,
  }: {
    reportData: any;
    groupFightsByBoss: (fights: any[]) => Record<string, any[]>;
  }) {
    if (!reportData) return null;
  
    return (
      <section className="mx-auto max-w-4xl px-6 py-10 text-white">
        <h2 className="text-3xl font-bold">{reportData.title}</h2>
  
        <p className="mt-2 text-slate-400">
          Owner: {reportData.owner.name}
        </p>
  
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

                const averageDurationMs =
                    fights.reduce((total: number, fight: any) => {
                    return total + (fight.endTime - fight.startTime);
                    }, 0) / fights.length;

                    const averageTotalSeconds = Math.floor(averageDurationMs / 1000);
                    const averageMinutes = Math.floor(averageTotalSeconds / 60);
                    const averageSeconds = averageTotalSeconds % 60;
  
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
                  className="rounded-2xl border border-white/10 bg-white/5 p-5"
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
                                {diagnosis}
                            </div>
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