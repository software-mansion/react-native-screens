import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { GlassButton } from './GlassButton';
// @ts-ignore its fine
import { MessageSquare, X, MoreVertical } from 'lucide-react-native';

interface Comment {
  id: string;
  author: string;
  timestamp: string;
  content: string;
  resolved?: boolean;
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    author: 'Tomasz Zawadzki',
    timestamp: '2 hours ago',
    content:
      'This section could benefit from more specific examples. Perhaps we could add a case study?',
  },
  {
    id: '2',
    author: 'Jakub Piasecki',
    timestamp: '4 hours ago',
    content:
      'Great point about performance optimization! Should we also mention memory management here?',
  },
  {
    id: '3',
    author: 'Kacper Kafara',
    timestamp: 'Yesterday',
    content:
      'I think this paragraph flows better if we move it after the next section.',
    resolved: true,
  },
  {
    id: '4',
    author: 'Krzysztof Piaskowy',
    timestamp: 'Yesterday',
    content: 'Love the analogy here! Very clear and accessible for beginners.',
  },
  {
    id: '5',
    author: 'Wojciech Lewicki',
    timestamp: '2 days ago',
    content:
      'Should we add references to support these statistics? It would strengthen the argument.',
  },
  {
    id: '6',
    author: 'Kacper Kapuściak',
    timestamp: '3 days ago',
    content:
      'I agree with the points made here. Adding more visuals could improve understanding.',
    resolved: true,
  },
];

export function CommentColumn() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Comments</Text>
      </View>

      {/* Comments List */}
      <ScrollView
        style={styles.commentsList}
        showsVerticalScrollIndicator={false}>
        {MOCK_COMMENTS.map(comment => (
          <View
            key={comment.id}
            style={[
              styles.commentCard,
              comment.resolved && styles.commentCardResolved,
            ]}>
            <View style={styles.commentHeader}>
              <View style={styles.authorSection}>
                <View style={styles.author}>
                  <Text style={styles.authorName}>{comment.author}</Text>
                  <Text style={styles.timestamp}>{comment.timestamp}</Text>
                </View>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {comment.author
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.commentContent}>{comment.content}</Text>

            {comment.resolved && (
              <View style={styles.resolvedBadge}>
                <Text style={styles.resolvedText}>Resolved</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Add a comment...</Text>
        <GlassButton tintColor="#3b82f6">
          <MessageSquare color="white" size={18} />
        </GlassButton>
      </View>
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
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderBottomColor: '#475569',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#172554',
  },
  commentsList: {
    flex: 1,
    // padding: 16,
    marginHorizontal: 8,
  },
  commentCard: {
    backgroundColor: '#fffa0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderRightWidth: 3,
    borderColor: '#3b82f6',
  },
  commentCardResolved: {
    borderColor: '#22c55e',
  },
  commentHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  author: {
    // width: '100%',
    flex: 1,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    // color: 'white',
  },
  timestamp: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 20,
    color: '#0f172a',
  },
  resolvedBadge: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#22c55e',
    position: 'absolute',
    left: 16,
    top: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  resolvedText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
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
