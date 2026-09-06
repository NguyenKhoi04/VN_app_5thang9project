import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Image, Dimensions } from 'react-native';
import { API_ENDPOINTS } from '../../../src/config/api'; // Import API_ENDPOINTS from the config file

const { width } = Dimensions.get('window');

//const API_roles_URL = 'http://192.168.102.12:5000/api/roles';

const API_roles_URL = API_ENDPOINTS.GET_ROLES;

const RoleSelectionScreen = ({ navigation, route }: any) => {
  const [doi_tuong, setRoles] = useState<string>('');
  
  // Nhận họ tên từ Login truyền sang
  const currentName = route?.params?.ho_ten || '';

  const handleSelectRole = (selectedRole: string, targetScreen: string) => {
    setRoles(selectedRole);

    // Chuyển tiếp đúng họ tên sang HomePrimary
    navigation.navigate(targetScreen, { 
      doi_tuong: selectedRole, 
      ho_ten: currentName,
      user: route?.params?.user || null, // Truyền đối tượng user nếu có
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/images/welcome-illustration.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>Đối tượng học tiếng Việt</Text>
        </View>

        {/* Tiêu đề */}
        <Text style={styles.welcomeText}>
          Chào mừng bạn đến với{' '}
          <Text style={styles.appName}>Luyện Viết Chính Tả và Tập Đọc Tiếng Việt</Text>
        </Text>
        <Text style={styles.subtitle}>Bạn muốn học tiếng Việt với vai trò nào?</Text>
        <Text style={styles.subtitle_bold}>Hãy chọn một trong các vai trò dưới đây để bắt đầu trải nghiệm.</Text>

        <View style={styles.rolesContainer}>
          {/* Dòng 1: 2 thẻ */}
          <View style={styles.row}>
            <TouchableOpacity 
              style={[styles.roleCard, { backgroundColor: '#EFF6FF' }]}
              onPress={() => handleSelectRole('hoc_sinh_tieu_hoc', 'HomePrimary')}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>👨‍🎓</Text>
              </View>
              <Text style={styles.roleTitle}>Học sinh Tiểu Học</Text>
              <Text style={styles.roleTitle_small}>Primary School Students</Text>
              <View style={[styles.bottomBar, { backgroundColor: '#3B82F6' }]} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.roleCard, { backgroundColor: '#F0FDF4' }]}
              onPress={() => handleSelectRole('nguoi_nuoc_ngoai', 'MenuSurvey')}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>🌍</Text>
              </View>
              <Text style={styles.roleTitle}>Người nước ngoài</Text>
              <Text style={styles.roleTitle_small}>Foreigners</Text>
              <View style={[styles.bottomBar, { backgroundColor: '#10B981' }]} />
            </TouchableOpacity>
          </View>

          {/* Dòng 2: 1 thẻ căn giữa */}
          {/* <View style={styles.row}>
            <TouchableOpacity 
              style={[styles.roleCard, { backgroundColor: '#F5F3FF' }]}
              onPress={() => { Alert.alert('Đã chọn', 'Giáo viên') }}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>👩‍🏫</Text>
              </View>
              <Text style={styles.roleTitle}>Giáo viên</Text>
              <Text style={styles.roleTitle_small}>Teachers</Text>
              <View style={[styles.bottomBar, { backgroundColor: '#8B5CF6' }]} />
            </TouchableOpacity>
          </View> */}
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
    paddingTop: 60,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
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
    fontSize: 18,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle_bold: {
    fontSize: 18,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },

  /* Layout 2 dòng */
  rolesContainer: {
    width: '100%',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 18,
    width: '100%',
  },

  roleCard: {
    width: width * 0.38,
    height: width * 0.38,        // Làm cho thẻ vuông
    borderRadius: 20,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 3,
    borderColor: '#F1F5F9',
  },

  icon: {
    fontSize: 30,
  },

  roleTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
    color: '#1E3A8A',
  },

  roleTitle_small: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
    color: '#1E3A8A',
  },

  bottomBar: {
    position: 'absolute',
    bottom: 16,
    width: '50%',
    height: 6,
    borderRadius: 3,
    top: '115%',
  },
});

export default RoleSelectionScreen;