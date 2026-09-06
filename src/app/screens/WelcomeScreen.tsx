import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { API_ENDPOINTS } from '@/config/api';

const { width } = Dimensions.get('window');

// Link API Backend

// LƯU Ý ĐỔI IP:
// - Máy ảo Android: dùng 'http://10.0.2.2:5000/api/login'
// - Máy thật (qua Wi-Fi): dùng 'http://<IP_MAY_TINH>:5000/api/login' (ví dụ: 'http://192.168.1.15:5000/api/login')
//Hoặc localhost:5000/api/login
// - Máy ảo iOS: dùng 'http://localhost:5000/api/login'

// const API_STATUS_URL = 'http://192.168.102.12:5000/api/status';

const API_STATUS_URL = API_ENDPOINTS.GET_STATUS;
export default function WelcomeScreen({ navigation }: any) {
  const [status, setStatus] = useState<string>('Đang kiểm tra kết nối Backend...');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [showStatus, setShowStatus] = useState<boolean>(true);

  useEffect(() => {
    // 1. Gọi API kiểm tra trạng thái
    fetch(API_STATUS_URL)
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.message || 'Kết nối MySQL thành công!');
        setIsConnected(true);
      })
      .catch((error) => {
        console.error('Lỗi kết nối chi tiết:', error);
        setStatus('Không thể kết nối đến Backend');
        setIsConnected(false);
      });

    // 2. Đặt bộ đếm tự ẩn statusBadge sau 15 giây
    const timer = setTimeout(() => {
      setShowStatus(false);
    }, 20000);

    // Hủy timer khi rời màn hình để tránh memory leak
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image 
            source={require('../../../assets/images/welcome-illustration.png')} 
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Luyện Viết Chính Tả</Text>
        <Text style={styles.title}>và Tập Đọc Tiếng Việt</Text>
        
        <Text style={styles.subtitle}>
          Cải thiện kỹ năng tiếng Việt qua các bài tập vui nhộn và hiệu quả
        </Text>

        {/* Nút Đăng Nhập */}
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.primaryButtonText}>Đăng Nhập</Text>
        </TouchableOpacity>

        {/* Nút Đăng Ký */}
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.secondaryButtonText}>Đăng Ký</Text>
        </TouchableOpacity> 
      </View>
     
      {/* Hiển thị trạng thái kết nối Database/Backend (Tự ẩn sau 10s) */}
      {showStatus && (
        <View style={styles.statusBadge}>
          <Text style={[styles.statusText, { color: isConnected ? '#16a34a' : '#dc2626' }]}>
            {'● '}{status}
          </Text>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  illustrationContainer: {
    marginBottom: 24,
  },
  illustration: {
    width: width * 0.75,
    height: 240,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E3A8A',
    textAlign: 'center',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
    lineHeight: 22,
  },
  statusBadge: {
    backgroundColor: '#EFEBE9',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 999,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 80,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  secondaryButtonText: {
    color: '#2563EB',
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
});