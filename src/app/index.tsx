import React from "react";
import { registerRootComponent } from "expo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import các màn hình của bạn
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import RoleSelectionScreen from "./screens/RoleSelectionScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import MenuSurvey from "./screens/foreigners/menu_survery";
import Footer from "./screens/primary_school_students/Footer";
import Header from "./screens/primary_school_students/Header";
import HomePrimary from "./screens/primary_school_students/Home_primary";
import PracticeReadingclass1 from "./screens/primary_school_students/skills_reading_students/practice_reading_class1";

import PracticeReadingclass2 from "./screens/primary_school_students/skills_reading_class2students/practice_reading_class2";

import PracticeReadingclass3 from "./screens/primary_school_students/skills_reading_class3students/practice_reading_class3";

import ReadingWeekDetailsclass1week1 from "./screens/primary_school_students/skills_reading_students/reading_week1_details";
import ReadingWeekDetailsclass1week3 from "./screens/primary_school_students/skills_reading_students/reading_week3_details";
import ReadingWeekDetailsclass1week5 from "./screens/primary_school_students/skills_reading_students/reading_week5_details";
import ReadingTopicDetails_Topic1Class1Screen from "./screens/primary_school_students/skills_reading_students/reading_topic1_details";
import ReadingPronunciationTopic1 from "./screens/primary_school_students/skills_reading_students/reading_pronunciation_topic1";

// pronunciation lớp 1
import ReadingPronunciationWeek1 from "./screens/primary_school_students/skills_reading_students/reading_pronunciation_week1";
import ReadingPronunciationWeek3 from "./screens/primary_school_students/skills_reading_students/reading_pronunciation_week3";
import ReadingPronunciationWeek5 from "./screens/primary_school_students/skills_reading_students/reading_pronunciation_week5";

// Lớp 2 - detail screens
import ReadingWeekDetailsClass2Topic1week3 from "./screens/primary_school_students/skills_reading_class2students/reading_topic1week3_class2details";
import ReadingWeekDetailsClass2Topic2week5 from "./screens/primary_school_students/skills_reading_class2students/reading_topic2week5_class2details";
import ReadingWeekDetailsClass2Topic2week6 from "./screens/primary_school_students/skills_reading_class2students/reading_topic2week6_class2details";

// Lớp 2 - bài cụ thể (cấp 3)
import ReadingWeekDetailsClass2Topic1week3Bai5 from "./screens/primary_school_students/skills_reading_class2students/reading_topic1week3_class2details_bai5";
import ReadingWeekDetailsClass2Topic2week5Bai9 from "./screens/primary_school_students/skills_reading_class2students/reading_topic2week5_class2details_bai9";
import ReadingWeekDetailsClass2Topic2week6Bai11 from "./screens/primary_school_students/skills_reading_class2students/reading_topic2week6_class2details_bai11";

// Lớp 2 - pronunciation
import ReadingPronunciation_bai5_week3 from "./screens/primary_school_students/skills_reading_class2students/readingpronunciation_bai5_week3";
import ReadingPronunciation_bai6_week3 from "./screens/primary_school_students/skills_reading_class2students/readingpronunciation_bai6_week3";
import ReadingPronunciation_bai9_week5 from "./screens/primary_school_students/skills_reading_class2students/readingpronunciation_bai9_week5";
import ReadingPronunciation_bai11_week6 from "./screens/primary_school_students/skills_reading_class2students/readingpronunciation_bai11_week6";

// Lớp 3 - detail screens
import ReadingWeekDetailsClass3Topic1 from "./screens/primary_school_students/skills_reading_class3students/reading_topic1_class3details";
import ReadingWeekDetailsClass3Topic1Bai2 from "./screens/primary_school_students/skills_reading_class3students/reading_topic1week3_class3details_bai2";
import ReadingPronunciationClass3Bai2Week3 from "./screens/primary_school_students/skills_reading_class3students/readingpronunciation_bai2_week3class3";

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#2563EB" },
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Footer" component={Footer} />        
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="MenuSurvey" component={MenuSurvey} />
        <Stack.Screen name="HomePrimary" component={HomePrimary} />

        {/* Lớp 1 */}
        <Stack.Screen name="PracticeReadingClass1" component={PracticeReadingclass1} />
        <Stack.Screen name="ReadingWeekDetailsClass1week1" component={ReadingWeekDetailsclass1week1} />
        <Stack.Screen name="ReadingWeekDetailsClass1week3" component={ReadingWeekDetailsclass1week3} />
        <Stack.Screen name="ReadingWeekDetailsClass1week5" component={ReadingWeekDetailsclass1week5} />
        <Stack.Screen name="ReadingTopicDetails_Topic1Class1Screen" component={ReadingTopicDetails_Topic1Class1Screen} />
        <Stack.Screen name="ReadingPronunciationTopic1" component={ReadingPronunciationTopic1} />
        <Stack.Screen name="ReadingPronunciationWeek1" component={ReadingPronunciationWeek1} />
        <Stack.Screen name="ReadingPronunciationWeek3" component={ReadingPronunciationWeek3} />
        <Stack.Screen name="ReadingPronunciationWeek5" component={ReadingPronunciationWeek5} />

        {/* Lớp 2 */}
        <Stack.Screen name="PracticeReadingClass2" component={PracticeReadingclass2} />
        <Stack.Screen name="ReadingWeekDetailsClass2Topic1week3" component={ReadingWeekDetailsClass2Topic1week3} />
        <Stack.Screen name="ReadingWeekDetailsClass2Topic1week3Bai5" component={ReadingWeekDetailsClass2Topic1week3Bai5} />
        <Stack.Screen name="ReadingWeekDetailsClass2Topic2week5" component={ReadingWeekDetailsClass2Topic2week5} />
        <Stack.Screen name="ReadingWeekDetailsClass2Topic2week5Bai9" component={ReadingWeekDetailsClass2Topic2week5Bai9} />
        <Stack.Screen name="ReadingWeekDetailsClass2Topic2week6" component={ReadingWeekDetailsClass2Topic2week6} />
        <Stack.Screen name="ReadingWeekDetailsClass2Topic2week6Bai11" component={ReadingWeekDetailsClass2Topic2week6Bai11} />
        <Stack.Screen name="ReadingPronunciation_bai5_week3" component={ReadingPronunciation_bai5_week3} />
        <Stack.Screen name="ReadingPronunciation_bai6_week3" component={ReadingPronunciation_bai6_week3} />
        <Stack.Screen name="ReadingPronunciation_bai9_week5" component={ReadingPronunciation_bai9_week5} />
        <Stack.Screen name="ReadingPronunciation_bai11_week6" component={ReadingPronunciation_bai11_week6} />

        {/* Lớp 3 */}
        <Stack.Screen name="PracticeReadingClass3" component={PracticeReadingclass3} />
        <Stack.Screen name="ReadingWeekDetailsClass3Topic1" component={ReadingWeekDetailsClass3Topic1} />
        <Stack.Screen name="ReadingWeekDetailsClass3Topic1Bai2" component={ReadingWeekDetailsClass3Topic1Bai2} />
        <Stack.Screen name="ReadingPronunciationClass3Bai2Week3" component={ReadingPronunciationClass3Bai2Week3} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Bắt buộc để Expo khởi chạy root component
registerRootComponent(App);