import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';

import GoalInput from '@/components/GoalInput';
import ShiftsInput from '@/components/ShiftsInput';
import { GoalHistory } from "@/app/(tabs)/history";
import { Colors } from "@/constants/Colors";
import ParallaxScrollView from "@/components/ParallaxScrollView";

export type GoalType = {
  target: number;
  current: number;
};

const STORAGE_KEY = 'verizon_sales_goals';
const HISTORY_KEY = 'verizon_sales_history';

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

  const showSaveAlert = () => {
    Alert.alert(
      'Save Goals',
      'Are you sure you want to save current goals? This will reset your current progress.',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: saveToHistory,
        },
      ],
      { cancelable: true }
    );
  };

  const saveToHistory = async () => {
    try {
      const date = new Date();
      const historyItem: GoalHistory = {
        id: Date.now().toString(),
        date: date.toISOString(),
        month: date.toLocaleString('default', { month: 'long' }),
        year: date.getFullYear(),
        shifts,
        money: moneyGoal,
        phone: phoneGoal,
        internet: internetGoal,
      };

      const savedHistory = await AsyncStorage.getItem(HISTORY_KEY);
      const history = savedHistory ? JSON.parse(savedHistory) : [];
      history.unshift(historyItem);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));

      // Reset current values but keep targets
      setMoneyGoal({ ...moneyGoal, current: 0 });
      setPhoneGoal({ ...phoneGoal, current: 0 });
      setInternetGoal({ ...internetGoal, current: 0 });
    } catch (error) {
      console.error('Error saving to history:', error);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <KeyboardAwareScrollView
        style={styles.container}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <ThemedView style={styles.content}>
          <ThemedText type="title">Monthly Goals</ThemedText>

          <TouchableOpacity onPress={showSaveAlert} style={styles.saveButton}>
            <ThemedText style={styles.saveButtonText}>Save & Reset</ThemedText>
          </TouchableOpacity>

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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 0,
    paddingVertical: 20,
    gap: 20,
  },
  parallaxContent: {
    paddingHorizontal: 0,
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
  saveButton: {
    backgroundColor: Colors.light.tint,
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
