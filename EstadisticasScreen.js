import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useJornada } from '../context/JornadaContext';
import { Card, StatCard } from '../components/CommonComponents';
import {
  calculateAnnualHours,
  calculateAverageHoursPerJornada,
  calculateHoursByMonth,
  getMonthlyBreakdown,
  getCurrentMonthYear,
} from '../utils/calculators';

const NOMBRES_MES = [
  'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
  'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic',
];

export default function EstadisticasScreen() {
  const { jornadas } = useJornada();
  const { year: currentYear, month: currentMonth } = getCurrentMonthYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const annualHours = useMemo(
    () => calculateAnnualHours(jornadas, selectedYear),
    [jornadas, selectedYear]
  );
  const monthHours = useMemo(
    () =>
      selectedYear === currentYear
        ? calculateHoursByMonth(jornadas, currentYear, currentMonth)
        : 0,
    [jornadas, selectedYear]
  );
  const average = useMemo(
    () => calculateAverageHoursPerJornada(jornadas, selectedYear),
    [jornadas, selectedYear]
  );
  const breakdown = useMemo(
    () => getMonthlyBreakdown(jornadas, selectedYear),
    [jornadas, selectedYear]
  );
  const maxHoras = Math.max(1, ...breakdown.map((b) => b.horas));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSelectedYear((y) => y - 1)}>
          <Text style={styles.navButton}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.yearText}>{selectedYear}</Text>
        <TouchableOpacity onPress={() => setSelectedYear((y) => y + 1)}>
          <Text style={styles.navButton}>›</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <StatCard label={`Horas totales en ${selectedYear}`} value={annualHours.toFixed(1)} unit="horas" />
        {selectedYear === currentYear && (
          <StatCard label="Horas este mes" value={monthHours.toFixed(1)} unit="horas" />
        )}
        <StatCard label="Promedio por jornada" value={average.toFixed(1)} unit="horas" />

        <Card>
          <Text style={styles.sectionTitle}>Desglose mensual</Text>
          {breakdown.map(({ month, horas }) => (
            <View key={month} style={styles.barRow}>
              <Text style={styles.barLabel}>{NOMBRES_MES[month - 1]}</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { width: `${Math.max(2, (horas / maxHoras) * 100)}%` },
                  ]}
                />
              </View>
              <Text style={styles.barValue}>{horas.toFixed(0)}h</Text>
            </View>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
  },
  navButton: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: '300',
  },
  yearText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  barLabel: {
    width: 32,
    fontSize: 12,
    color: '#666',
  },
  barTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EEF2F7',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 5,
  },
  barValue: {
    width: 36,
    fontSize: 12,
    color: '#333',
    textAlign: 'right',
  },
});
