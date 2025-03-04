import { useState, useEffect } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import ProgressBar from '@/components/ProgressBar';

type GoalType = {
  target: number;
  current: number;
};

type GoalInputProps = {
  label: string;
  goal: GoalType;
  setGoal: (goal: GoalType) => void;
  prefix?: string;
  keyboardType?: 'numeric' | 'decimal-pad';
};

export default function GoalInput({ label, goal, setGoal, prefix, keyboardType = 'numeric' }: GoalInputProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const [localTarget, setLocalTarget] = useState(goal.target.toString());
  const [localCurrent, setLocalCurrent] = useState(goal.current.toString());

  useEffect(() => {
    setLocalTarget(goal.target.toString());
    setLocalCurrent(goal.current.toString());
  }, [goal]);

  const handleTargetBlur = () => {
    const parsedValue = localTarget ? parseFloat(localTarget) : 0;
    setGoal({ ...goal, target: isNaN(parsedValue) ? 0 : parsedValue });
  };

  const handleCurrentBlur = () => {
    const parsedValue = localCurrent ? parseFloat(localCurrent) : 0;
    setGoal({ ...goal, current: isNaN(parsedValue) ? 0 : parsedValue });
  };

  return (
    <ThemedView style={styles.goalContainer}>
      <ThemedText type="subtitle">{label}</ThemedText>
      <ThemedView style={styles.inputContainer}>
        <ThemedText>Target: </ThemedText>
        <TextInput
          style={[styles.input, { color: Colors[colorScheme].text }]}
          value={localTarget}
          onChangeText={setLocalTarget}
          onBlur={handleTargetBlur}
          keyboardType={keyboardType}
          placeholder="Enter target"
          placeholderTextColor={Colors[colorScheme].tabIconDefault}
          autoCorrect={false}
          returnKeyType="next"
        />
      </ThemedView>
      <ThemedView style={styles.inputContainer}>
        <ThemedText>Current: </ThemedText>
        <TextInput
          style={[styles.input, { color: Colors[colorScheme].text }]}
          value={localCurrent}
          onChangeText={setLocalCurrent}
          onBlur={handleCurrentBlur}
          keyboardType={keyboardType}
          placeholder="Enter current"
          placeholderTextColor={Colors[colorScheme].tabIconDefault}
          autoCorrect={false}
          returnKeyType="next"
        />
      </ThemedView>
      <ThemedView style={styles.progressInfo}>
        <ProgressBar progress={goal.current / goal.target} />
        <ThemedText type="defaultSemiBold">
          {prefix}
          {goal.current} / {prefix}
          {goal.target} ({((goal.current / goal.target) * 100).toFixed(1)}%)
        </ThemedText>
        <ThemedText style={styles.remainingText}>
          {Math.max(goal.target - goal.current, 0)} {label.toLowerCase().replace(' sales', '').replace(' goal', '')} remaining
        </ThemedText>
      </ThemedView>
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
  }
});
