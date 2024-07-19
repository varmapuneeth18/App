// import { Tabs } from 'expo-router';
// import React from 'react';

// import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';
// import { TabBarIcon } from '@/components/navigation/TabBarIcon';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         headerShown: false,
//       }}>
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: '',
//           tabBarIcon: ({ color, focused }) => (
//             focused ? null : <TabBarIcon name="home-outline" color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="signUp"
//         options={{
//           title: '',
//           tabBarIcon: ({ color, focused }) => (
//             focused ? null : <TabBarIcon name="home-outline" color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }


import { Tabs } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            focused ? null : <TabBarIcon name="home-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="signUp"
        options={{
          title: '',
          tabBarIcon: ({ color, focused }) => (
            focused ? null : <TabBarIcon name="home-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
