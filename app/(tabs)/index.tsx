import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, ScrollView, AppState, AppStateStatus } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import GoalInput from '@/components/GoalInput';
import ShiftsInput from '@/components/ShiftsInput';

type GoalType = {
  target: number;
  current: number;
};

const STORAGE_KEY = 'verizon_sales_goals';

export default function GoalsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const [shifts, setShifts] = useState(20);
  const [moneyGoal, setMoneyGoal] = useState<GoalType>({ target: 3500, current: 600 });
  const [phoneGoal, setPhoneGoal] = useState<GoalType>({ target: 15, current: 2 });
  const [internetGoal, setInternetGoal] = useState<GoalType>({ target: 3, current: 0 });

  useEffect(() => {
    loadGoals();
  }, []);

  useEffect(() => {
    saveGoals();
  }, [shifts, moneyGoal, phoneGoal, internetGoal]);

  const loadGoals = async () => {
    try {
      const savedGoals = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedGoals) {
        const { shifts: savedShifts, money, phone, internet } = JSON.parse(savedGoals);
        setShifts(savedShifts);
        setMoneyGoal(money);
        setPhoneGoal(phone);
        setInternetGoal(internet);
      } else {
        console.log('No saved goals found.');
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const saveGoals = async () => {
    try {
      const goalsData = {
        shifts,
        money: moneyGoal,
        phone: phoneGoal,
        internet: internetGoal,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(goalsData));
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}
    >
      <ThemedView style={styles.content}>
        <ThemedText type="title">Monthly Goals</ThemedText>

        <ShiftsInput
          shifts={shifts}
          setShifts={setShifts}
          moneyGoal={moneyGoal}
          phoneGoal={phoneGoal}
          internetGoal={internetGoal}
        />

        <GoalInput
          label="Sales Goal"
          goal={moneyGoal}
          setGoal={setMoneyGoal}
          prefix="$"
          keyboardType="decimal-pad"
        />

        <GoalInput
          label="Phone Sales"
          goal={phoneGoal}
          setGoal={setPhoneGoal}
        />

        <GoalInput
          label="Internet Sales"
          goal={internetGoal}
          setGoal={setInternetGoal}
        />
      </ThemedView>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 20,
  },
  goalContainer: {
    gap: 10,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  progressContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  progressInfo: {
    gap: 6,
    marginTop: 10,
  },
  remainingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic'
  },
  shiftsBreakdown: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    gap: 4,
  },
});
