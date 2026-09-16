import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function StatCard({ label, value, unit }) {
  return (
    <Card style={styles.statCard}>
      <Text style={styles.statValue}>
        {value} <Text style={styles.statUnit}>{unit}</Text>
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

export function JornadaItem({ fecha, horasTrabajadas, onEdit, onDelete }) {
  return (
    <View style={styles.item}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemFecha}>{fecha}</Text>
        <Text style={styles.itemHoras}>{horasTrabajadas} h</Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
          <Text style={styles.actionText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
          <Text style={styles.actionText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statUnit: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemFecha: {
    fontSize: 14,
    color: '#333',
    textTransform: 'capitalize',
  },
  itemHoras: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  actionText: {
    fontSize: 16,
  },
});
