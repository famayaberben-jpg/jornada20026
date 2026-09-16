import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { JornadaProvider } from './src/context/JornadaContext';
import HomeScreen from './src/screens/HomeScreen';
import HistorialScreen from './src/screens/HistorialScreen';
import EstadisticasScreen from './src/screens/EstadisticasScreen';
import ExportarScreen from './src/screens/ExportarScreen';
import AgregarJornadaScreen from './src/screens/AgregarJornadaScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Historial" component={HistorialScreen} />
      <Tab.Screen name="Estadisticas" component={EstadisticasScreen} />
      <Tab.Screen name="Exportar" component={ExportarScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <JornadaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen
            name="AgregarJornada"
            component={AgregarJornadaScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen
            name="EditarJornada"
            component={AgregarJornadaScreen}
            options={{ presentation: 'modal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </JornadaProvider>
  );
}
