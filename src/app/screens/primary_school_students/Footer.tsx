import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const Footer = () => {
  // ✅ ĐÚNG: Hook phải nằm bên trong component
  const navigation = useNavigation<any>();

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.footerItem} onPress={() => {
        navigation.navigate('HomePrimary');
      }}>
        <Text style={styles.footerIcon}>🏠</Text>
        <Text style={styles.footerTextActive}>Trang chủ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerItem} onPress={() => {}}>
        <Text style={styles.footerIcon}>📚</Text>
        <Text style={styles.footerText}>Bài học</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerItem} onPress={() => {}}>
        <Text style={styles.footerIcon}>🏆</Text>
        <Text style={styles.footerText}>Thành tích</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerItem} onPress={() => {}}>
        <Text style={styles.footerIcon}>👤</Text>
        <Text style={styles.footerText}>Cá nhân</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  footerItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  footerIcon: { fontSize: 22, marginBottom: 2 },
  footerText: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  footerTextActive: { fontSize: 12, color: '#2563EB', fontWeight: '700' },
});

export default Footer;