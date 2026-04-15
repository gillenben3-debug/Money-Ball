import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../theme';

import DashboardScreen from '../screens/DashboardScreen';
import JourneyScreen from '../screens/JourneyScreen';
import AccountsScreen from '../screens/AccountsScreen';
import AdvisorScreen from '../screens/AdvisorScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: true,
        tabBarIcon: ({ focused, color }) => {
          const icons: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
            Home:     { active: 'home',            inactive: 'home-outline' },
            Journey:  { active: 'map',             inactive: 'map-outline' },
            Accounts: { active: 'cash',            inactive: 'cash-outline' },
            Advisor:  { active: 'sparkles',        inactive: 'sparkles-outline' },
          };
          const icon = icons[route.name];
          return <Ionicons name={focused ? icon.active : icon.inactive} size={22} color={color} />;
        },
        tabBarLabel: route.name,
        tabBarLabelStyle: styles.label,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarItemStyle: styles.tabItem,
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Journey" component={JourneyScreen} />
      <Tab.Screen name="Accounts" component={AccountsScreen} />
      <Tab.Screen name="Advisor" component={AdvisorScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 84,
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingTop: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: Fonts.weights.semibold,
    textAlign: 'center',
    marginTop: 2,
  },
});
