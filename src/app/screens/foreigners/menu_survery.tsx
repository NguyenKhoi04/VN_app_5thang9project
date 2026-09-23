// menu_survey.tsx - Chương trình học tiếng Việt cho người nước ngoài
import React from 'react';
import AgeScreen from './survey/age';
import LanguageScreen from './survey/language';
import LevelVnScreen from './survey/level_vn';
import ReasonScreen from './survey/reason';
import DesireScreen from './survey/desire';
import StyleForeignersScreen from './survey/style_foreigners';
import PracticeScreen from './survey/practice';

// Screens học tiếng Việt
import HocTiengViet from './hoc_tieng_viet/index';
import Phan1Roadmap from './hoc_tieng_viet/phan1/index';
import Phan1Bai1 from './hoc_tieng_viet/phan1/bai1';
import Phan1Bai2 from './hoc_tieng_viet/phan1/bai2';
import Phan1Bai3 from './hoc_tieng_viet/phan1/bai3';
import Phan1Bai4 from './hoc_tieng_viet/phan1/bai4';
import Phan2Roadmap from './hoc_tieng_viet/phan2/index';
import Phan2Bai1 from './hoc_tieng_viet/phan2/bai1';
import Phan2Bai2 from './hoc_tieng_viet/phan2/bai2';
import Phan2Bai3 from './hoc_tieng_viet/phan2/bai3';
import Phan2Bai4 from './hoc_tieng_viet/phan2/bai4';
import Phan3Roadmap from './hoc_tieng_viet/phan3/index';
import Phan3Bai1 from './hoc_tieng_viet/phan3/bai1';
import Phan3Bai2 from './hoc_tieng_viet/phan3/bai2';
import Phan3Bai3 from './hoc_tieng_viet/phan3/bai3';
import Phan3Bai4 from './hoc_tieng_viet/phan3/bai4';
import TuVungIndex from './hoc_tieng_viet/tu_vung/index';
import BangTuVung from './hoc_tieng_viet/tu_vung/bang_tu_vung';

// Skill screens (dùng chung cho cả 3 phần)
import PhatAmScreen from './hoc_tieng_viet/skills/phat_am';
import NgheLapLaiScreen from './hoc_tieng_viet/skills/nghe_lap_lai';
import TapDocScreen from './hoc_tieng_viet/skills/tap_doc';
import NguPhapScreen from './hoc_tieng_viet/skills/ngu_phap';
import NhanDienScreen from './hoc_tieng_viet/skills/nhan_dien';
import ChinhTaScreen from './hoc_tieng_viet/skills/chinh_ta';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const MenuSurvey = () => {
  return (
    <Stack.Navigator
      initialRouteName="Language"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#2563EB' },
      }}
    >
      {/* Survey screens */}
      <Stack.Screen name="Language" component={LanguageScreen} />
      <Stack.Screen name="Age" component={AgeScreen} />
      <Stack.Screen name="LevelVn" component={LevelVnScreen} />
      <Stack.Screen name="Reason" component={ReasonScreen} />
      <Stack.Screen name="Desire" component={DesireScreen} />
      <Stack.Screen name="Style_Foreigners" component={StyleForeignersScreen} />
      <Stack.Screen name="Practice" component={PracticeScreen} />

      {/* Chương trình học tiếng Việt */}
      <Stack.Screen name="HocTiengViet" component={HocTiengViet} options={{ contentStyle: { backgroundColor: '#F8FAFC' } }} />

      {/* Phần 1 */}
      <Stack.Screen name="Phan1Roadmap" component={Phan1Roadmap} />
      <Stack.Screen name="Phan1Bai1" component={Phan1Bai1} />
      <Stack.Screen name="Phan1Bai2" component={Phan1Bai2} />
      <Stack.Screen name="Phan1Bai3" component={Phan1Bai3} />
      <Stack.Screen name="Phan1Bai4" component={Phan1Bai4} />

      {/* Phần 2 */}
      <Stack.Screen name="Phan2Roadmap" component={Phan2Roadmap} />
      <Stack.Screen name="Phan2Bai1" component={Phan2Bai1} />
      <Stack.Screen name="Phan2Bai2" component={Phan2Bai2} />
      <Stack.Screen name="Phan2Bai3" component={Phan2Bai3} />
      <Stack.Screen name="Phan2Bai4" component={Phan2Bai4} />

      {/* Phần 3 */}
      <Stack.Screen name="Phan3Roadmap" component={Phan3Roadmap} />
      <Stack.Screen name="Phan3Bai1" component={Phan3Bai1} />
      <Stack.Screen name="Phan3Bai2" component={Phan3Bai2} />
      <Stack.Screen name="Phan3Bai3" component={Phan3Bai3} />
      <Stack.Screen name="Phan3Bai4" component={Phan3Bai4} />

      {/* Bảng từ vựng */}
      <Stack.Screen name="TuVungIndex" component={TuVungIndex} />
      <Stack.Screen name="BangTuVung" component={BangTuVung} />

      {/* Kỹ năng (6 màn hình dùng chung) */}
      <Stack.Screen name="SkillPhatAm" component={PhatAmScreen} />
      <Stack.Screen name="SkillNgheLapLai" component={NgheLapLaiScreen} />
      <Stack.Screen name="SkillTapDoc" component={TapDocScreen} />
      <Stack.Screen name="SkillNguPhap" component={NguPhapScreen} />
      <Stack.Screen name="SkillNhanDien" component={NhanDienScreen} />
      <Stack.Screen name="SkillChinhTa" component={ChinhTaScreen} />
    </Stack.Navigator>
  );
};

export default MenuSurvey;
