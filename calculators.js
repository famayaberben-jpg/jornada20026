// Todas las jornadas usan fecha en formato 'YYYY-MM-DD'

export function getCurrentMonthYear() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 }; // month: 1-12
}

function parseYearMonth(fecha) {
  const [year, month] = fecha.split('-').map(Number);
  return { year, month };
}

export function getJornadasByMonth(jornadas, year, month) {
  return jornadas
    .filter((j) => {
      const { year: y, month: m } = parseYearMonth(j.fecha);
      return y === year && m === month;
    })
    .sort((a, b) => (a.fecha < b.fecha ? 1 : -1)); // más reciente primero
}

export function calculateHoursByMonth(jornadas, year, month) {
  return getJornadasByMonth(jornadas, year, month).reduce(
    (total, j) => total + Number(j.horasTrabajadas || 0),
    0
  );
}

export function getJornadasByYear(jornadas, year) {
  return jornadas.filter((j) => parseYearMonth(j.fecha).year === year);
}

export function calculateAnnualHours(jornadas, year) {
  return getJornadasByYear(jornadas, year).reduce(
    (total, j) => total + Number(j.horasTrabajadas || 0),
    0
  );
}

export function calculateAverageHoursPerJornada(jornadas, year) {
  const anuales = getJornadasByYear(jornadas, year);
  if (anuales.length === 0) return 0;
  const total = anuales.reduce((sum, j) => sum + Number(j.horasTrabajadas || 0), 0);
  return total / anuales.length;
}

export function getMonthlyBreakdown(jornadas, year) {
  const meses = Array.from({ length: 12 }, (_, i) => i + 1);
  return meses.map((month) => ({
    month,
    horas: calculateHoursByMonth(jornadas, year, month),
  }));
}

export function formatDate(fecha) {
  const [year, month, day] = fecha.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function isValidFecha(fecha) {
  return /^\d{4}-\d{2}-\d{2}$/.test(fecha) && !isNaN(new Date(fecha).getTime());
}

export function isValidHoras(horas) {
  const n = Number(horas);
  return !isNaN(n) && n > 0 && n <= 24;
}
