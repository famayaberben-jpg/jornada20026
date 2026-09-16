import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useJornada } from './JornadaContext';
import { Card, JornadaItem } from './CommonComponents';
import {
  getJornadasByMonth,
  formatDate,
  getCurrentMonthYear,
} from './calculators';

export default function HistorialScreen({ navigation }) {
  const { jornadas, deleteJornada } = useJornada();
  const { year, month } = getCurrentMonthYear();
  const [selectedMonth, setSelectedMonth] = useState(month);
  const [selectedYear, setSelectedYear] = useState(year);
  const [filteredJornadas, setFilteredJornadas] = useState([]);

  useEffect(() => {
    const filtered = getJornadasByMonth(jornadas, selectedYear, selectedMonth);
    setFilteredJornadas(filtered);
  }, [jornadas, selectedYear, selectedMonth]);

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

  const handlePreviousMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleDateString(
    'es-ES',
    { month: 'long', year: 'numeric' }
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePreviousMonth}>
          <Text style={styles.navButton}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthText}>{monthName}</Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Text style={styles.navButton}>›</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredJornadas.length > 0 ? (
          <Card>
            <Text style={styles.title}>Jornadas del Mes</Text>
            {filteredJornadas.map((jornada) => (
              <JornadaItem
                key={jornada.id}
                fecha={formatDate(jornada.fecha)}
                horasTrabajadas={jornada.horasTrabajadas}
                onEdit={() =>
                  navigation.navigate('EditarJornada', { jornada })
                }
                onDelete={() => handleDelete(jornada.id)}
              />
            ))}
          </Card>
        ) : (
          <Card>
            <Text style={styles.emptyText}>
              No hay jornadas registradas en {monthName}
            </Text>
          </Card>
        )}
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
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    paddingVertical: 24,
  },
});
