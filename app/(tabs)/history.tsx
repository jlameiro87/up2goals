import { useState, useEffect, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, Share, ScrollView, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Picker } from '@react-native-picker/picker';
import { LineChart } from 'react-native-chart-kit';
import { GoalType } from "@/app/(tabs)/index";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

const HISTORY_KEY = 'verizon_sales_history';

export type GoalHistory = {
  id: string;
  date: string;
  month: string;
  year: number;
  shifts: number;
  money: GoalType;
  phone: GoalType;
  internet: GoalType;
};

export default function HistoryScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const [history, setHistory] = useState<GoalHistory[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('');

  const years = useMemo(() =>
    [...new Set(history.map(item => item.year))], [history]
  );

  const months = useMemo(() =>
      [...new Set(history.filter(item => item.year === selectedYear)
        .map(item => item.month))],
    [history, selectedYear]
  );

  const filteredHistory = useMemo(() =>
      history.filter(item =>
        (!selectedYear || item.year === selectedYear) &&
        (!selectedMonth || item.month === selectedMonth)
      ),
    [history, selectedYear, selectedMonth]
  );

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem(HISTORY_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      const updatedHistory = history.filter(item => item.id !== id);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };

  const exportHistory = async () => {
    try {
      const historyString = JSON.stringify(filteredHistory, null, 2);
      await Share.share({
        message: historyString,
        title: 'Goals History Export'
      });
    } catch (error) {
      console.error('Error exporting history:', error);
    }
  };

  const renderChart = () => {
    if (filteredHistory.length === 0) return null;

    const data = {
      labels: filteredHistory.map(item => item.month.substring(0, 3)),
      datasets: [
        {
          data: filteredHistory.map(item =>
            (item.money.current / item.money.target) * 100
          ),
          color: () => '#FF4B4B',
          strokeWidth: 2
        }
      ]
    };

    return (
      <LineChart
        data={data}
        width={350}
        height={200}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        style={styles.chart}
      />
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <ThemedView style={styles.filters}>
        <Picker
          selectedValue={selectedYear}
          onValueChange={value => setSelectedYear(value)}
          style={[styles.picker, { color: Colors[colorScheme].text }]}
        >
          <Picker.Item label="All Years" value={0} />
          {years.map(year => (
            <Picker.Item key={year} label={year.toString()} value={year} />
          ))}
        </Picker>

        <Picker
          selectedValue={selectedMonth}
          onValueChange={value => setSelectedMonth(value)}
          style={[styles.picker, { color: Colors[colorScheme].text }]}
        >
          <Picker.Item label="All Months" value="" />
          {months.map(month => (
            <Picker.Item key={month} label={month} value={month} />
          ))}
        </Picker>

        <TouchableOpacity onPress={exportHistory} style={[styles.exportButton, { backgroundColor: Colors[colorScheme].tint }]}>
          <ThemedText style={{ color: Colors[colorScheme].background }}>Export</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {renderChart()}
    </View>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.container}>
        {renderHeader()}
        {filteredHistory.map(item => (
          <ThemedView key={item.id} style={styles.historyCard}>
            <ThemedView style={styles.cardHeader}>
              <ThemedText type="subtitle">{item.month} {item.year}</ThemedText>
              <TouchableOpacity onPress={() => deleteHistoryItem(item.id)}>
                <ThemedText style={styles.deleteButton}>Delete</ThemedText>
              </TouchableOpacity>
            </ThemedView>

            <ThemedView style={styles.goalSummary}>
              <ThemedText>Money: ${item.money.current}/${item.money.target}</ThemedText>
              <ThemedText>Phones: {item.phone.current}/{item.phone.target}</ThemedText>
              <ThemedText>Internet: {item.internet.current}/{item.internet.target}</ThemedText>
              <ThemedText>Shifts: {item.shifts}</ThemedText>
            </ThemedView>
          </ThemedView>
        ))}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 20,
  },
  filters: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
  },
  picker: {
    flex: 1,
    height: 50,
  },
  exportButton: {
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
  },
  listContent: {
    padding: 20,
    gap: 15,
  },
  historyCard: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalSummary: {
    marginTop: 10,
    gap: 5,
  },
  deleteButton: {
    color: '#FF4B4B',
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
    alignSelf: 'center',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
