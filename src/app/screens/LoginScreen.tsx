import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_ENDPOINTS } from '../../config/api'; // Import API_ENDPOINTS from the config file

const API_LOGIN_URL = API_ENDPOINTS.LOGIN;


const LoginScreen = ({ navigation }: any) => {
  const [ten_dang_nhap, setusername] = useState('');
  const [mat_khau, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  
  if (!ten_dang_nhap.trim() || !mat_khau.trim()) {
    Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu');
    return;
  }

  setLoading(true);

  try {
    const response = await fetch(API_LOGIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: ten_dang_nhap.trim(),
        password: mat_khau.trim(),
      }),
    });

    // 2. Đọc phản hồi dưới dạng text để tránh lỗi crash nếu server trả về HTML
    const textData = await response.text();
    let data;
    try {
      data = JSON.parse(textData);
    } catch {
      console.log('Server trả về HTML lỗi:', textData);
      Alert.alert('Lỗi Server', 'Đường dẫn API sai hoặc server gặp sự cố.');
      return;
    }

    // 3. Xử lý kết quả từ server trả về
    if (response.ok) {
      // Lấy đúng họ tên trả về từ server
      const userFullName = data.user?.ho_ten || data.ho_ten || ten_dang_nhap.trim();

      Alert.alert('Thành công', data.message || 'Đăng nhập thành công', [
        {
          text: 'OK',
          onPress: () =>
            navigation.replace('RoleSelection', {
              ho_ten: userFullName || ten_dang_nhap.trim() || 'Chưa có tên', // Sử dụng họ tên từ server hoặc tên đăng nhập nếu không có
              user: data.user || null,
            }),
        },
      ]);

//       console.log('=== PARSED DATA ===');
// console.log(JSON.stringify(data, null, 2));

// console.log('data.user?.ho_ten =', data.user?.ho_ten);
// console.log('data.ho_ten =', data.ho_ten);

    } 
    
    else {
      Alert.alert('Thất bại', data.message || 'Sai thông tin đăng nhập');
    }

  } catch (error: any) {
    Alert.alert('Lỗi kết nối', error.message || 'Không thể kết nối đến server');
  } finally {
    setLoading(false);
  }

  
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Đăng Nhập</Text>
        <Text style={styles.welcomeText}>
          Chào mừng bạn trở lại!{'\n'}Hãy tiếp tục luyện tập nhé!
        </Text>

        {/* Ô Tên đăng nhập */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tên đăng nhập</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên đăng nhập"
            value={ten_dang_nhap}
            onChangeText={setusername}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Ô Mật khẩu */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mật khẩu</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Nhập mật khẩu"
              value={mat_khau}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.showPasswordButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#64748B"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotText}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Đăng Nhập</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>Hoặc tiếp tục với</Text>

        <View style={styles.socialButtons}>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIconGoogle}>G</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Text style={styles.socialIconFacebook}>f</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerLink}>
            Chưa có tài khoản? <Text style={styles.registerHighlight}>Đăng ký</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 18,
    color: '#475569',
    marginBottom: 40,
    lineHeight: 26,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  showPasswordButton: {
    paddingHorizontal: 12,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    color: '#2563EB',
    fontSize: 15,
  },
  loginButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  orText: {
    textAlign: 'center',
    color: '#64748B',
    marginBottom: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIconGoogle: {
    fontSize: 24,
    color: '#DB4437',
    fontWeight: 'bold',
  },
  socialIconFacebook: {
    fontSize: 24,
    color: '#4267B2',
    fontWeight: 'bold',
  },
  registerLink: {
    textAlign: 'center',
    fontSize: 16,
    color: '#64748B',
  },
  registerHighlight: {
    color: '#2563EB',
    fontWeight: '600',
  },
});

export default LoginScreen;