import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useJornada } from '../context/JornadaContext';
import { isValidFecha, isValidHoras } from '../utils/calculators';

export default function AgregarJornadaScreen({ navigation, route }) {
  const { addJornada, updateJornada } = useJornada();
  const jornadaExistente = route.params?.jornada;
  const esEdicion = !!jornadaExistente;

  const [fecha, setFecha] = useState(
    jornadaExistente?.fecha || new Date().toISOString().slice(0, 10)
  );
  const [horas, setHoras] = useState(
    jornadaExistente ? String(jornadaExistente.horasTrabajadas) : ''
  );
  const [saving, setSaving] = useState(false);

  const handleGuardar = async () => {
    if (!isValidFecha(fecha)) {
      Alert.alert('Fecha inválida', 'Usa el formato YYYY-MM-DD, por ejemplo 2026-09-15.');
      return;
    }
    if (!isValidHoras(horas)) {
      Alert.alert('Horas inválidas', 'Introduce un número entre 0 y 24, por ejemplo 8 u 8.5.');
      return;
    }

    setSaving(true);
    try {
      if (esEdicion) {
        await updateJornada(jornadaExistente.id, fecha, Number(horas));
      } else {
        await addJornada(fecha, Number(horas));
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la jornada. Inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{esEdicion ? 'Editar Jornada' : 'Agregar Jornada'}</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Fecha (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={fecha}
          onChangeText={setFecha}
          placeholder="2026-09-15"
          keyboardType="numbers-and-punctuation"
        />

        <Text style={styles.label}>Horas trabajadas</Text>
        <TextInput
          style={styles.input}
          value={horas}
          onChangeText={setHoras}
          placeholder="8, 8.5, 9.25..."
          keyboardType="decimal-pad"
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleGuardar}
            disabled={saving}
          >
            <Text style={styles.saveText}>{saving ? 'Guardando...' : 'Guardar'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 32,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#EEE',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelText: {
    color: '#333',
    fontWeight: '600',
  },
  saveText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
