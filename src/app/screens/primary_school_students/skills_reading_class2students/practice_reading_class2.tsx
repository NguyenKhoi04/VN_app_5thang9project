// Danh mục đọc - Lớp 2

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header, { ClassInfo } from '../Header';
import Footer from '../Footer';

const { width } = Dimensions.get('window');

export default function PracticeReadingClass2Screen({ navigation, route }: any) {
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

  const handleNavigate = (screenName?: string) => {
    if (!screenName) {
      Alert.alert('Thông báo', `Tính năng đang được phát triển!`);
      return;
    }
    navigation.navigate(screenName as never, {
      ho_ten: name,
      ten_ky_nang: tenKyNang,
    } as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={name}
        classes={classes}
        selectedClass={selectedClass}
        setSelectedClass={setSelectedClass}
        navigation={navigation}
        route={route}
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
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageGrid}>
          {/* Hàng 1 */}
          <View style={styles.imageRow}>
            <TouchableOpacity
              style={styles.touchableImage}
              activeOpacity={0.8}
              onPress={() => handleNavigate('ReadingWeekDetailsClass2Topic1week3')}
            >
              <Image
                source={require('@/assets/images/lop2/em_lonlen.png')}
                style={styles.imageBox}
                resizeMode="cover"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.touchableImage}
              activeOpacity={0.8}
              onPress={() => handleNavigate('ReadingWeekDetailsClass2Topic2week5')}
            >
              <Image
                source={require('@/assets/images/lop2/hoc_vui.png')}
                style={styles.imageBox}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>

          {/* Hàng 2 */}
          <View style={styles.imageRow}>
            <TouchableOpacity
              style={styles.touchableImage}
              activeOpacity={0.8}
              onPress={() => handleNavigate('ReadingWeekDetailsClass2Topic2week6')}
            >
              <Image
                source={require('@/assets/images/lop2/tuoi_tho.png')}
                style={styles.imageBox}
                resizeMode="cover"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.touchableImage}
              activeOpacity={0.8}
              onPress={() => handleNavigate('ReadingWeekDetailsClass2Topic2week6')}
            >
              <Image
                source={require('@/assets/images/lop2/gia_dinh.png')}
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
  touchableImage: {
    width: (width - 16 * 2 - 12) / 2,
    height: (width - 16 * 2 - 12) / 2,
  },
  imageBox: {
    width: (width - 16 * 2 - 12) / 2,
    height: (width - 16 * 2 - 12) / 2,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
});