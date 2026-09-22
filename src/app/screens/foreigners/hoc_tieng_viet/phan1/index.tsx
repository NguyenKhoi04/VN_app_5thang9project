// Phần 1: Ngữ âm và chữ viết - Duolingo Roadmap
import React from 'react';
import DuolingoRoadmap, { LessonNode } from '../DuolingoRoadmap';

const THEME_COLOR = '#4F46E5';

const lessons: LessonNode[] = [
  {
    id: 1,
    title: 'Bảng chữ cái',
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
    title: 'Vần và ghép âm',
    subtitle: 'Rhymes and Sound Blending',
    emoji: '🧩',
    status: 'current',
    screenName: 'Phan1Bai3',
  },
  {
    id: 4,
    title: 'Tập viết chữ',
    subtitle: 'Writing Practice',
    emoji: '✍️',
    status: 'current',
    screenName: 'Phan1Bai4',
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
