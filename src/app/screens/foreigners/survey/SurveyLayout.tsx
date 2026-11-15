import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

interface SurveyLayoutProps {
  step: number;
  totalSteps?: number;
  title: string;
  subtitle?: string;
  titleBadge?: string;
  onBack?: () => void;
  onSkip?: () => void;
  continueText?: string;
  continueDisabled?: boolean;
  onContinue: () => void;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
}

export default function SurveyLayout({
  step,
  totalSteps = 7,
  title,
  subtitle,
  titleBadge,
  onBack,
  onSkip,
  continueText = 'Tiếp tục',
  continueDisabled = false,
  onContinue,
  children,
  headerRight,
}: SurveyLayoutProps) {
  const progressPercent = Math.min(Math.max((step / totalSteps) * 100, 10), 100);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar style="dark" />

      {/* Top Navigation Bar: Back Button, Progress Bar, Skip Button */}
      <View style={styles.topNav}>
        {onBack ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backPlaceholder} />
        )}

        {/* Thanh tiến trình Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.stepText}>
            {step}/{totalSteps}
          </Text>
        </View>

        {/* Nút Bỏ qua / Skip */}
        {headerRight ? (
          headerRight
        ) : onSkip ? (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={onSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Bỏ qua</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
      </View>

      {/* Nội dung cuộn chính */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {titleBadge && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{titleBadge}</Text>
          </View>
        )}

        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

        <View style={styles.body}>{children}</View>
      </ScrollView>

      {/* Thanh CTA cố định ở đáy */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.continueBtn,
            continueDisabled && styles.continueBtnDisabled,
          ]}
          disabled={continueDisabled}
          onPress={onContinue}
          activeOpacity={0.85}
        >
          <Text
            style={[
              styles.continueBtnText,
              continueDisabled && styles.continueBtnTextDisabled,
            ]}
          >
            {continueText}
          </Text>
          <Text
            style={[
              styles.continueBtnArrow,
              continueDisabled && styles.continueBtnTextDisabled,
            ]}
          >
            →
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  backPlaceholder: {
    width: 40,
  },
  backIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#334155',
    lineHeight: 22,
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    gap: 8,
  },
  progressTrack: {
    flex: 1,
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 5,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    minWidth: 32,
    textAlign: 'right',
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 24,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 32,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 20,
  },
  body: {
    flex: 1,
  },
  bottomBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 8 : 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  continueBtn: {
    backgroundColor: '#2563EB',
    height: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  continueBtnDisabled: {
    backgroundColor: '#E2E8F0',
    elevation: 0,
    shadowOpacity: 0,
  },
  continueBtnText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    marginRight: 6,
  },
  continueBtnTextDisabled: {
    color: '#94A3B8',
  },
  continueBtnArrow: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});

