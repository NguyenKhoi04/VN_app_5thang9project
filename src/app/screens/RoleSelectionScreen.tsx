import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Dimensions, ActivityIndicator } from 'react-native';
import { API_ENDPOINTS } from '../../../src/config/api';

const { width } = Dimensions.get('window');
const API_roles_URL = API_ENDPOINTS.GET_ROLES;

// // 1. Dữ liệu mặc định hiển thị ngay lập tức (phòng khi mất mạng hoặc API lỗi)
// const DEFAULT_ROLES = [
//   { ma: 'hoc_sinh_tieu_hoc', ten_vn: 'Học sinh tiểu học', ten_en: 'Primary Student', icon: '👦' },
//   { ma: 'nguoi_nuoc_ngoai', ten_vn: 'Người nước ngoài', ten_en: 'Foreigner', icon: '🌏' },
// ];
// 1. Chỉ giữ lại ROLE_CONFIG để gắn màu sắc & màn hình theo mã 'ma'
const ROLE_CONFIG: Record<string, { screen: string; bg: string; bar: string }> = {
  hoc_sinh_tieu_hoc: { screen: 'HomePrimary', bg: '#EFF6FF', bar: '#3B82F6' },
  nguoi_nuoc_ngoai: { screen: 'MenuSurvey', bg: '#F0FDF4', bar: '#10B981' },
  giao_vien: { screen: 'HomeTeacher', bg: '#F5F3FF', bar: '#8B5CF6' },
};

const RoleSelectionScreen = ({ navigation, route }: any) => {
  // 2. Khởi tạo mảng rỗng []
  const [rolesList, setRolesList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const currentName = route?.params?.ho_ten || '';

  // 3. Gọi API lấy thẳng từ Database
  useEffect(() => {
    fetch(API_roles_URL)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRolesList(data);
        }
      })
      .catch((err) => {
        console.error('Lỗi kết nối API roles:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelectRole = (selectedRole: string, targetScreen: string) => {
    if (!targetScreen) return;
    navigation.navigate(targetScreen, { 
      doi_tuong: selectedRole, 
      ho_ten: currentName,
      user: route?.params?.user || null,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/images/welcome-illustration.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>Đối tượng học tiếng Việt</Text>
        </View>

        <Text style={styles.welcomeText}>
          Chào mừng bạn đến với{' '}
          <Text style={styles.appName}>Luyện Viết Chính Tả và Tập Đọc Tiếng Việt</Text>
        </Text>
        <Text style={styles.subtitle}>Bạn muốn học tiếng Việt với vai trò nào?</Text>
        <Text style={styles.subtitle_bold}>Hãy chọn một trong các vai trò dưới đây để bắt đầu trải nghiệm.</Text>

        <View style={styles.rolesContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#2563EB" style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.row}>
              {rolesList.map((item) => {
                const config = ROLE_CONFIG[item.ma] || { screen: '', bg: '#F8FAFC', bar: '#94A3B8' };

                return (
                  <TouchableOpacity
                    key={item.ma}
                    style={[styles.roleCard, { backgroundColor: config.bg }]}
                    onPress={() => handleSelectRole(item.ma, config.screen)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.iconContainer}>
                      <Text style={styles.icon}>{item.icon}</Text>
                    </View>
                    <Text style={styles.roleTitle}>{item.ten_vn}</Text>
                    <Text style={styles.roleTitle_small}>{item.ten_en}</Text>
                    <View style={[styles.bottomBar, { backgroundColor: config.bar }]} />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logo: {
    width: 180,
    height: 80,
  },
  tagline: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 4,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 8,
  },
  appName: {
    color: '#2563EB',
  },
  subtitle: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle_bold: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  rolesContainer: {
    width: '100%',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    width: '100%',
  },
  roleCard: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: 20,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#F1F5F9',
  },
  icon: {
    fontSize: 26,
  },
  roleTitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1E3A8A',
  },
  roleTitle_small: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    color: '#64748B',
    marginTop: 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 10,
    width: '40%',
    height: 5,
    borderRadius: 3,
  },
});

export default RoleSelectionScreen;