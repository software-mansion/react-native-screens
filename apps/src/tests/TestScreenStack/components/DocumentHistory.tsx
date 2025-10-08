import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
// @ts-ignore its fine
import { Clock, RotateCcw, Download, Eye } from 'lucide-react-native';

interface HistoryVersion {
  id: string;
  timestamp: string;
  changes: string;
  version: string;
  isCurrent?: boolean;
}

const MOCK_HISTORY: HistoryVersion[] = [
  {
    id: '1',
    timestamp: 'Today, 3:45 PM',
    changes: 'Updated conclusion and added final thoughts',
    version: 'v1.8',
    isCurrent: true,
  },
  {
    id: '2',
    timestamp: 'Today, 2:30 PM',
    changes: 'Revised "Looking Ahead" section with new insights',
    version: 'v1.7',
  },
  {
    id: '3',
    timestamp: 'Today, 11:20 AM',
    changes: 'Added cross-platform considerations section',
    version: 'v1.6',
  },
  {
    id: '4',
    timestamp: 'Yesterday, 5:15 PM',
    changes: 'Expanded performance optimization paragraph',
    version: 'v1.5',
  },
  {
    id: '5',
    timestamp: 'Yesterday, 2:00 PM',
    changes: 'Added "The Foundation of Great Apps" heading',
    version: 'v1.4',
  },
  {
    id: '6',
    timestamp: '2 days ago',
    changes: 'Refined introduction and opening paragraphs',
    version: 'v1.3',
  },
  {
    id: '7',
    timestamp: '3 days ago',
    changes: 'Initial draft with main sections outlined',
    version: 'v1.2',
  },
  {
    id: '8',
    timestamp: '4 days ago',
    changes: 'Created document structure and title',
    version: 'v1.1',
  },
];

export function DocumentHistory() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Version History</Text>
      </View>

      {/* History Timeline */}
      <ScrollView
        style={styles.historyList}
        showsVerticalScrollIndicator={false}>
        {MOCK_HISTORY.map((version, index) => (
          <View key={version.id} style={styles.historyItem}>
            {/* Timeline connector */}
            {index < MOCK_HISTORY.length - 1 && (
              <View style={styles.timelineConnector} />
            )}

            {/* Timeline dot */}
            <View
              style={[
                styles.timelineDot,
                version.isCurrent && styles.timelineDotCurrent,
              ]}
            />

            {/* Version card */}
            <View style={[styles.versionCard]}>
              <View style={styles.versionHeader}>
                <View style={styles.versionInfo}>
                  <View style={styles.versionBadge}>
                    <Text style={styles.versionText}>{version.version}</Text>
                  </View>
                  <Text style={styles.timestamp}>{version.timestamp}</Text>
                </View>

                <View style={styles.actionButtons}>
                  {version.isCurrent && (
                    <View style={styles.currentBadge}>
                      <Text style={styles.currentText}>Current</Text>
                    </View>
                  )}
                </View>
              </View>

              <Text style={styles.changes}>{version.changes}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#172554',
  },
  historyList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  historyItem: {
    position: 'relative',
    paddingLeft: 32,
    marginBottom: 8,
  },
  timelineConnector: {
    position: 'absolute',
    left: 7,
    top: 16,
    bottom: -8,
    width: 2,
    backgroundColor: '#cbd5e1',
    height: '105%',
  },
  timelineDot: {
    position: 'absolute',
    left: 2,
    top: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#94a3b8',
    borderWidth: 2,
    borderColor: '#fff',
  },
  timelineDotCurrent: {
    backgroundColor: '#3b82f6',
    width: 14,
    height: 14,
    borderRadius: 7,
    left: 1,
    top: 10,
  },
  versionCard: {
    borderRadius: 12,
    padding: 12,
  },
  versionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  versionInfo: {
    flex: 1,
  },
  versionBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
  timestamp: {
    fontSize: 12,
    color: '#64748b',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  currentBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  currentText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'white',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  authorName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  changes: {
    fontSize: 13,
    lineHeight: 18,
    color: '#475569',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  footerText: {
    flex: 1,
    fontSize: 14,
    color: '#64748b',
  },
});
