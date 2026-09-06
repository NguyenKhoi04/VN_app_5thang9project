import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Alert, 
  Dimensions,
  ScrollView 
} from 'react-native';

const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
    setUserCaptcha('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleRegister = () => {
    if (!email || !password || !confirmPassword || !userCaptcha) {
      //Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      //Chuyển vào Đăng nhập
      navigation.navigate('Login');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }
    if (userCaptcha.toUpperCase() !== captcha) {
      Alert.alert('Lỗi', 'Mã CAPTCHA không đúng!');
      generateCaptcha();
      return;
    }

    Alert.alert('Thành công', 'Tài khoản đã được tạo!');
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <Text style={styles.header}>Tạo Tài Khoản</Text>
          <Text style={styles.subtitle}>Tham gia ngay để bắt đầu luyện viết và tập đọc Tiếng Việt</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nhập lại mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          {/* CAPTCHA */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mã CAPTCHA</Text>
            
            <View style={styles.captchaContainer}>
              <Text style={styles.captchaText}>{captcha}</Text>
              <TouchableOpacity onPress={generateCaptcha} style={styles.refreshButton}>
                <Text style={styles.refreshIcon}>↻</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Nhập mã captcha"
              value={userCaptcha}
              onChangeText={setUserCaptcha}
              autoCapitalize="characters"
              maxLength={6}
            />
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Đăng Ký</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>Hoặc tiếp tục với</Text>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon_google}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon_facebook}>f</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.loginLinkContainer}>
            <Text style={styles.loginLink}>
              Đã có tài khoản? <Text style={styles.loginHighlight}>Đăng nhập</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: width > 400 ? 28 : 24,   // Responsive padding
    paddingTop: height > 700 ? 70 : 50,        // Responsive top padding
  },
  header: {
    fontSize: width > 400 ? 34 : 30,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 32,
    lineHeight: 24,
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
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    width: '100%',
  },
  // CAPTCHA
  captchaContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderWidth: 2,
    borderColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  captchaText: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 6,
    color: '#1E40AF',
    fontStyle: 'italic',
  },
  refreshButton: {
    backgroundColor: '#2563EB',
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshIcon: {
    fontSize: 26,
    color: 'white',
  },
  registerButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 24,
    width: '100%',
  },
  registerButtonText: {
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
    gap: 20,
    marginBottom: 32,
  },
  socialButton: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon_google: {
    fontSize: 26,
    color: '#DB4437',
    fontWeight: 'bold',
  },
    socialIcon_facebook: {
    fontSize: 26,
    color: '#1877F2',
    fontWeight: 'bold',
  },
  loginLinkContainer: {
    marginTop: 10,
  },
  loginLink: {
    textAlign: 'center',
    fontSize: 16,
    color: '#64748B',
  },
  loginHighlight: {
    color: '#2563EB',
    fontWeight: '600',
  },
});

export default RegisterScreen;