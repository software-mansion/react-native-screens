import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { GlassButton } from '../components/GlassButton';
// @ts-ignore its fine
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Image,
  Link,
  Save,
  Share2,
  Undo,
  Redo,
} from 'lucide-react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Toolbar */}
      <View style={styles.toolbar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.toolbarContent}>
          <GlassButton>
            <Save color="white" size={20} />
          </GlassButton>
          <GlassButton>
            <Undo color="white" size={20} />
          </GlassButton>
          <GlassButton>
            <Redo color="white" size={20} />
          </GlassButton>

          <View style={styles.separator} />

          <GlassButton>
            <Bold color="white" size={20} />
          </GlassButton>
          <GlassButton>
            <Italic color="white" size={20} />
          </GlassButton>
          <GlassButton>
            <Underline color="white" size={20} />
          </GlassButton>

          <View style={styles.separator} />

          <GlassButton>
            <AlignLeft color="white" size={20} />
          </GlassButton>
          <GlassButton>
            <AlignCenter color="white" size={20} />
          </GlassButton>
          <GlassButton>
            <AlignRight color="white" size={20} />
          </GlassButton>

          <View style={styles.separator} />

          <GlassButton>
            <List color="white" size={20} />
          </GlassButton>
          <GlassButton>
            <ListOrdered color="white" size={20} />
          </GlassButton>

          <View style={styles.separator} />

          <GlassButton>
            <Image color="white" size={20} />
          </GlassButton>
          <GlassButton>
            <Link color="white" size={20} />
          </GlassButton>

          <View style={styles.separator} />

          <GlassButton>
            <Share2 color="white" size={20} />
          </GlassButton>
        </ScrollView>
      </View>

      {/* Document Area */}
      <ScrollView style={styles.documentContainer}>
        <View style={styles.paper}>
          <Text style={styles.title}>The Art of Mobile Development</Text>
          <Text style={styles.subtitle}>A Journey Through Innovation</Text>

          <Text style={styles.paragraph}>
            In the rapidly evolving landscape of technology, mobile development
            stands as one of the most transformative forces of our time. The
            ability to create applications that fit in the palm of our hands yet
            connect us to the entire world represents a paradigm shift in how we
            interact with technology and with each other.
          </Text>

          <Text style={styles.paragraph}>
            The journey of mobile development began with simple applications
            designed to perform basic tasks. Today, we craft sophisticated
            experiences that blur the lines between the physical and digital
            worlds. From augmented reality applications that overlay information
            onto our surroundings to machine learning algorithms that predict
            our needs before we articulate them, the possibilities seem
            boundless.
          </Text>

          <Text style={styles.heading}>The Foundation of Great Apps</Text>

          <Text style={styles.paragraph}>
            At the heart of every successful mobile application lies a deep
            understanding of user needs and behaviors. It's not enough to simply
            translate desktop experiences to smaller screens; we must reimagine
            interactions from the ground up. Touch interfaces demand intuitive
            gestures, limited screen real estate requires thoughtful information
            hierarchy, and varied network conditions necessitate resilient
            architecture.
          </Text>

          <Text style={styles.paragraph}>
            Performance optimization becomes paramount in this context. Users
            expect instantaneous responses, smooth animations, and minimal
            battery drain. Achieving this trifecta requires careful
            consideration of every line of code, every asset loaded, and every
            network request made. The difference between a good app and a great
            one often lies in these micro-optimizations that collectively create
            a seamless experience.
          </Text>

          <Text style={styles.heading}>Cross-Platform Considerations</Text>

          <Text style={styles.paragraph}>
            The debate between native and cross-platform development continues
            to evolve. While native development offers unparalleled access to
            platform-specific features and optimal performance, cross-platform
            frameworks have matured significantly, offering compelling
            alternatives that balance code reusability with native-like
            experiences. React Native, Flutter, and other modern frameworks
            demonstrate that we need not sacrifice quality for efficiency.
          </Text>

          <Text style={styles.paragraph}>
            Yet, the choice of technology stack extends beyond mere technical
            considerations. Team expertise, project timeline, budget
            constraints, and long-term maintenance all factor into this crucial
            decision. The most successful projects are those where technology
            choices align with business objectives and team capabilities,
            creating a sustainable development ecosystem.
          </Text>

          <Text style={styles.heading}>Looking Ahead</Text>

          <Text style={styles.paragraph}>
            As we stand on the cusp of new technological frontiers, mobile
            development continues to evolve. The integration of artificial
            intelligence, the promise of 5G connectivity, and the emergence of
            foldable devices present both challenges and opportunities. The
            developers who will thrive in this future are those who remain
            curious, adaptable, and committed to continuous learning.
          </Text>

          <Text style={styles.paragraph}>
            In conclusion, mobile development is not merely about writing
            code—it's about crafting experiences that empower users, solve real
            problems, and push the boundaries of what's possible. It's an art
            form that combines technical prowess with creative vision, and those
            who master it will continue to shape the future of human-computer
            interaction.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  toolbar: {
    backgroundColor: '#1e293b',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  toolbarContent: {
    gap: 8,
    alignItems: 'center',
  },
  separator: {
    width: 1,
    height: 30,
    backgroundColor: '#475569',
    marginHorizontal: 4,
  },
  documentContainer: {
    flex: 1,
  },
  paper: {
    backgroundColor: 'white',
    marginHorizontal: 40,
    marginVertical: 32,
    padding: 80,
    minHeight: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#64748b',
    marginBottom: 32,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 28,
    color: '#334155',
    marginBottom: 16,
    textAlign: 'justify',
  },
});
