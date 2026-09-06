// Danh mục đọc - Tuần 5

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header, { ClassInfo } from '../Header';
import Footer from '../Footer';

const { width } = Dimensions.get('window');

export default function ReadingWeekDetailsScreen({ navigation, route }: any) {
  const [name, setName] = useState<string>(route?.params?.ho_ten || '');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [tenKyNang, setTenKyNang] = useState<string>(
    route?.params?.ten_ky_nang || 'Tập Đọc'
  );

  useEffect(() => {
    if (route?.params?.ho_ten) setName(route.params.ho_ten);
    if (route?.params?.ten_ky_nang) setTenKyNang(route.params.ten_ky_nang);
  }, [route?.params?.ho_ten, route?.params?.ten_ky_nang]);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={name}
        classes={classes}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
      />

      {/* Banner Kỹ năng */}
      <View style={styles.bannerContainer}>
        <ImageBackground
          source={require('@/assets/images/banner-chuong-trinh.png')}
          style={styles.bannerBackground}
          resizeMode="contain"
        >
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>KỸ NĂNG</Text>
            <Text style={styles.bannerSubtitle}>{tenKyNang}</Text>
          </View>
        </ImageBackground>
      </View>

      <ScrollView
        style={styles.mainContent}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Grid hình */}
        <View style={styles.imageGrid}>
          <View style={styles.imageRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                navigation.navigate(
                  'ReadingPronunciationWeek5' as never
                )
              }
            >
              <Image
                source={require('@/assets/images/hsth_RS.png')}
                style={styles.imageBox}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  bannerContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
    marginTop: 8,
    marginBottom: 5,
  },
  bannerBackground: {
    width: '100%',
    height: 85,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTextContainer: {
    alignItems: 'center',
    marginTop: -25,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E53E3E',
    letterSpacing: 0.5,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#2B6CB0',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  mainContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 16,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  imageGrid: {
    marginVertical: 12,
    gap: 12,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  imageBox: {
    width: (width - 16 * 2 - 12) / 2,
    height: (width - 16 * 2 - 12) / 2,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
});