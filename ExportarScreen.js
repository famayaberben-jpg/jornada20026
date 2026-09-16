import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { exportToExcel } from './ExcelService';

export default function ExportarScreen() {
  const [exporting, setExporting] = useState(false);

  const handleExportar = async () => {
    setExporting(true);
    try {
      await exportToExcel();
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el archivo Excel. Inténtalo de nuevo.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Exportar a Excel</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Descarga todos tus registros de jornada en un archivo .xlsx compatible con Excel,
          Google Sheets y LibreOffice Calc.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleExportar}
          disabled={exporting}
        >
          {exporting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>📥 Exportar registros</Text>
          )}
        </TouchableOpacity>
      </View>
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
