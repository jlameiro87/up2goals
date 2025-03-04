import { useState, useEffect } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type GoalType = {
  target: number;
  current: number;
};

type ShiftsInputProps = {
  shifts: number;
  setShifts: (shifts: number) => void;
  moneyGoal: GoalType;
  phoneGoal: GoalType;
  internetGoal: GoalType;
};

export default function ShiftsInput({ 
  shifts, 
  setShifts, 
  moneyGoal, 
  phoneGoal, 
  internetGoal 
}: ShiftsInputProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const [localShifts, setLocalShifts] = useState(shifts.toString());

  useEffect(() => {
    setLocalShifts(shifts.toString());
  }, [shifts]);

  const handleShiftsBlur = () => {
    const parsedValue = localShifts ? parseInt(localShifts) : 0;
    setShifts(isNaN(parsedValue) ? 0 : parsedValue);
  };

  return (
    <ThemedView style={styles.goalContainer}>
      <ThemedText type="subtitle">Remaining Shifts</ThemedText>
      <ThemedView style={styles.inputContainer}>
        <ThemedText>Shifts: </ThemedText>
        <TextInput
          style={[styles.input, { color: Colors[colorScheme].text }]}
          value={localShifts}
          onChangeText={setLocalShifts}
          onBlur={handleShiftsBlur}
          keyboardType="numeric"
          placeholder="Enter shifts"
          placeholderTextColor={Colors[colorScheme].tabIconDefault}
          autoCorrect={false}
          returnKeyType="next"
        />
      </ThemedView>
      {shifts > 0 && (
        <ThemedView style={styles.shiftsBreakdown}>
          <ThemedText style={styles.remainingText}>
            Need ${((moneyGoal.target - moneyGoal.current) / shifts).toFixed(2)} per shift
          </ThemedText>
          <ThemedText style={styles.remainingText}>
            Need {((phoneGoal.target - phoneGoal.current) / shifts).toFixed(1)} phones per shift
          </ThemedText>
          <ThemedText style={styles.remainingText}>
            Need {((internetGoal.target - internetGoal.current) / shifts).toFixed(1)} internet per shift
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
  shiftsBreakdown: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    gap: 4,
  },
  remainingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic'
  }
});
