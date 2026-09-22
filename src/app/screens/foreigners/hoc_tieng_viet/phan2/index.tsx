// Phần 2: Phát âm - Duolingo Roadmap
import React from 'react';
import DuolingoRoadmap, { LessonNode } from '../DuolingoRoadmap';

const THEME_COLOR = '#0891B2';

const lessons: LessonNode[] = [
  {
    id: 1,
    title: 'Âm đầu',
    subtitle: 'Initial Consonants',
    emoji: '🅱️',
    status: 'current',
    screenName: 'Phan2Bai1',
  },
  {
    id: 2,
    title: 'Âm cuối',
    subtitle: 'Final Consonants',
    emoji: '🔚',
    status: 'current',
    screenName: 'Phan2Bai2',
  },
  {
    id: 3,
    title: 'Âm đệm và âm chính',
    subtitle: 'Medial and Main Vowels',
    emoji: '🎯',
    status: 'current',
    screenName: 'Phan2Bai3',
  },
  {
    id: 4,
    title: 'Luyện tập tổng hợp',
    subtitle: 'Comprehensive Practice',
    emoji: '🏋️',
    status: 'current',
    screenName: 'Phan2Bai4',
  },
];

interface Props { navigation: any; }

const Phan2Roadmap: React.FC<Props> = ({ navigation }) => (
  <DuolingoRoadmap
    navigation={navigation}
    sectionTitle="PHẦN 2: Phát âm"
    sectionSubtitle="Pronunciation - Sounds & Tones"
    sectionColor={THEME_COLOR}
    lessons={lessons}
    onBack={() => navigation.goBack()}
  />
);

export default Phan2Roadmap;
