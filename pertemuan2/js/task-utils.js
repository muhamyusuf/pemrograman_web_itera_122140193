const getSessionLabel = (schedule) => {
  if (!schedule) return "Tanpa Jadwal";
  const [hourString] = schedule.split(":");
  const hour = Number.parseInt(hourString, 10);
  if (Number.isNaN(hour)) return "Tanpa Jadwal";
  if (hour < 12) return "Pagi";
  if (hour < 17) return "Siang";
  return "Malam";
};

const buildTasksBySession = (tasks = []) => {
  const base = {
    Pagi: 0,
    Siang: 0,
    Malam: 0,
  };
  tasks.forEach((task) => {
    const label = getSessionLabel(task.schedule);
    if (base[label] !== undefined) {
      base[label] += 1;
    }
  });
  return Object.entries(base).map(([label, value]) => ({ label, value }));
};

export { getSessionLabel, buildTasksBySession };
