// menu_survey.tsx
import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AgeScreen from './survey/age';
import LanguageScreen from './survey/language';
import LevelVnScreen from './survey/level_vn';
import ReasonScreen from './survey/reason';
import DesireScreen from './survey/desire';
import StyleForeignersScreen from './survey/style_foreigners';
import PracticeScreen from './survey/practice';
import { Stack, useRouter } from 'expo-router';

// const SurveyStack = createNativeStackNavigator();

const MenuSurvey = () => {
  const router = useRouter();

 return (
    <Stack
      initialRouteName="survey/language"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#2563EB' },
      }}
    >
      <Stack.Screen name="survey/age" />
      <Stack.Screen name="survey/language" />
      <Stack.Screen name="survey/level_vn" />
      <Stack.Screen name="survey/reason" />
      <Stack.Screen name="survey/desire" />
      <Stack.Screen name="survey/style_foreigners" />
      <Stack.Screen name="survey/practice" />
    </Stack>
  );
};

export default MenuSurvey;