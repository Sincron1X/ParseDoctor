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
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{bossName}</h3>
                      <p className="text-sm text-slate-400">
                        Pulls: {fights.length}
                      </p>
                    </div>
  
                    <div className="text-right">
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