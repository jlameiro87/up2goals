import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

type ProgressBarProps = {
  progress: number;
};

export default function ProgressBar({ progress }: ProgressBarProps) {
  const percentage = progress * 100;
  const getProgressColor = () => {
    if (percentage < 30) return '#FF4B4B';
    if (percentage < 85) return '#FFA500';
    return '#4CAF50';
  };

  return (
    <ThemedView style={styles.progressContainer}>
      <ThemedView
        style={[
          styles.progressBar,
          {
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: getProgressColor(),
          },
        ]}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
});
