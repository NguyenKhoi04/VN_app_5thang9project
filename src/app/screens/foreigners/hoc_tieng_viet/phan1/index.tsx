// Phần 1: Ngữ âm và chữ viết - Duolingo Roadmap
import React from 'react';
import DuolingoRoadmap, { LessonNode } from '../DuolingoRoadmap';

const THEME_COLOR = '#4F46E5';

const lessons: LessonNode[] = [
  {
    id: 1,
    title: 'Bảng chữ cái tiếng Việt',
    subtitle: 'The Vietnamese Alphabet',
    emoji: '🔤',
    status: 'current',
    screenName: 'Phan1Bai1',
  },
  {
    id: 2,
    title: 'Nguyên âm và phụ âm',
    subtitle: 'Vowels and Consonants',
    emoji: '🅰️',
    status: 'current',
    screenName: 'Phan1Bai2',
  },
  {
    id: 3,
    title: '  Thanh diệu',
    subtitle: 'Tones',
    emoji: '🎵',
    status: 'current',
    screenName: 'Phan1Bai3',
  },
];

interface Props { navigation: any; }

const Phan1Roadmap: React.FC<Props> = ({ navigation }) => (
  <DuolingoRoadmap
    navigation={navigation}
    sectionTitle="PHẦN 1: Ngữ âm và chữ viết"
    sectionSubtitle="Phonetics and Writing System"
    sectionColor={THEME_COLOR}
    lessons={lessons}
    onBack={() => navigation.goBack()}
  />
);

export default Phan1Roadmap;
