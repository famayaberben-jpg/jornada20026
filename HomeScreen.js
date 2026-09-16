import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useJornada } from './JornadaContext';
import { Card, StatCard, JornadaItem } from './CommonComponents';
import {
  calculateHoursByMonth,
  getCurrentMonthYear,
  getJornadasByMonth,
  formatDate,
} from './calculators';

export default function HomeScreen({ navigation }) {
  const { jornadas, loading, deleteJornada } = useJornada();
  const { year, month } = getCurrentMonthYear();
  const [monthJornadas, setMonthJornadas] = useState([]);
  const [monthHours, setMonthHours] = useState(0);

  useEffect(() => {
    const filtered = getJornadasByMonth(jornadas, year, month);
    setMonthJornadas(filtered);
    const hours = calculateHoursByMonth(jornadas, year, month);
    setMonthHours(hours);
  }, [jornadas]);

  const handleDelete = (id) => {
    Alert.alert('Eliminar', '¿Estás seguro de que deseas eliminar esta jornada?', [
      { text: 'Cancelar', onPress: () => {} },
      {
        text: 'Eliminar',
        onPress: () => deleteJornada(id),
        style: 'destructive',
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Registro de Jornada</Text>
        <Text style={styles.subtitle}>
          {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <StatCard
          label="Horas trabajadas este mes"
          value={monthHours.toFixed(1)}
          unit="horas"
        />

        <Card>
          <Text style={styles.sectionTitle}>Últimas Jornadas</Text>
          {monthJornadas.length > 0 ? (
            monthJornadas.slice(0, 5).map((jornada) => (
              <JornadaItem
                key={jornada.id}
                fecha={formatDate(jornada.fecha)}
                horasTrabajadas={jornada.horasTrabajadas}
                onEdit={() =>
                  navigation.navigate('EditarJornada', { jornada })
                }
                onDelete={() => handleDelete(jornada.id)}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No hay jornadas registradas este mes</Text>
          )}
        </Card>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AgregarJornada')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    textTransform: 'capitalize',
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
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    paddingVertical: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
