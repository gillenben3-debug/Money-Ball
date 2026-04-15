import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, Fonts, Spacing, Radius, Shadow } from '../theme';
import MoneyBall from '../components/MoneyBall';
import { mockUser } from '../data/mockData';

interface Message {
  id: string;
  role: 'user' | 'advisor';
  text: string;
}

const QUICK_PROMPTS = [
  "How's my debt payoff?",
  'Where am I overspending?',
  'How much can I save this month?',
  'What should I focus on next?',
];

const MOCK_RESPONSES: Record<string, string> = {
  "How's my debt payoff?":
    "You have $7,450 in total debt across 2 accounts. At your current minimums, your credit card takes 68 months. If you put your $1,020 monthly surplus toward it using the avalanche method, you'd be debt-free in under 18 months. 🎯",
  'Where am I overspending?':
    "Entertainment is $40 over budget this month, and Shopping is $20 over. Everything else looks solid — Housing and Food are right on target. Try trimming $60 from entertainment to stay green. 💚",
  'How much can I save this month?':
    "Your income is $4,200 and spending is $3,180, leaving a $1,020 surplus. I'd recommend putting $500 toward your emergency fund and $520 toward debt — you're close to unlocking the Emergency Fund milestone! ⚡",
  'What should I focus on next?':
    "You're 3 milestones in — great start! Your next target is the Emergency Fund ($1k). You need about $1,000 more in savings. At your current surplus, you can hit it in 2 months. Let's go! 🚀",
};

const DEFAULT_RESPONSE =
  "Great question! Based on your linked accounts, you're making solid progress. Your net worth is growing and your spending is mostly on track. Keep hitting those milestones to unlock more personalized insights! 💪";

function TypingIndicator() {
  return (
    <View style={styles.typingRow}>
      <View style={styles.advisorAvatar}>
        <MoneyBall size={28} animate={false} />
      </View>
      <View style={styles.typingBubble}>
        <Text style={styles.typingDots}>• • •</Text>
      </View>
    </View>
  );
}

export default function AdvisorScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'advisor',
      text: `Hey ${mockUser.name}! I'm your Money Ball advisor. Ask me anything about your finances, or tap a quick prompt below. 💚`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  function sendMessage(text: string) {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = MOCK_RESPONSES[text] ?? DEFAULT_RESPONSE;
      const advisorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'advisor',
        text: response,
      };
      setMessages(prev => [...prev, advisorMsg]);
      setIsTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 1200);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <MoneyBall size={36} animate />
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Money Ball Advisor</Text>
          <Text style={styles.headerSub}>Powered by AI · Always in your corner</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={styles.messages}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map(msg => (
            <View
              key={msg.id}
              style={msg.role === 'user' ? styles.userRow : styles.advisorRow}
            >
              {msg.role === 'advisor' && (
                <View style={styles.advisorAvatar}>
                  <MoneyBall size={28} animate={false} />
                </View>
              )}
              <View
                style={[
                  styles.bubble,
                  msg.role === 'user' ? styles.userBubble : styles.advisorBubble,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    msg.role === 'user' ? styles.userText : styles.advisorText,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}

          {isTyping && <TypingIndicator />}
        </ScrollView>

        {/* Quick prompts */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.quickPrompts}
          contentContainerStyle={styles.quickPromptsContent}
        >
          {QUICK_PROMPTS.map(prompt => (
            <TouchableOpacity
              key={prompt}
              style={styles.promptChip}
              onPress={() => sendMessage(prompt)}
              activeOpacity={0.7}
            >
              <Text style={styles.promptChipText}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input bar */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Ask anything about your money..."
            placeholderTextColor={Colors.textMuted}
            value={input}
            onChangeText={setInput}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage(input)}
            multiline={false}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim()}
            activeOpacity={0.8}
          >
            <Text style={styles.sendIcon}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing.sm,
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.bold, color: Colors.textDark },
  headerSub: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, marginTop: 2 },

  messages: { flex: 1 },
  messagesContent: { padding: Spacing.md, gap: Spacing.sm },

  userRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  advisorRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm },
  advisorAvatar: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  bubble: {
    maxWidth: '78%',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.card,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  advisorBubble: {
    backgroundColor: Colors.card,
    borderBottomLeftRadius: 4,
  },
  bubbleText: { fontSize: Fonts.sizes.md, lineHeight: 22 },
  userText: { color: '#fff' },
  advisorText: { color: Colors.textDark },

  typingRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm },
  typingBubble: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderBottomLeftRadius: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Shadow.card,
  },
  typingDots: { fontSize: Fonts.sizes.lg, color: Colors.textMuted, letterSpacing: 2 },

  quickPrompts: { maxHeight: 48, borderTopWidth: 1, borderTopColor: Colors.border },
  quickPromptsContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  promptChip: {
    backgroundColor: Colors.pastelGreen,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  promptChipText: {
    fontSize: Fonts.sizes.xs,
    color: Colors.primary,
    fontWeight: Fonts.weights.semibold,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
    backgroundColor: Colors.card,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: Fonts.sizes.md,
    color: Colors.textDark,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: Colors.locked },
  sendIcon: { color: '#fff', fontSize: 20, fontWeight: Fonts.weights.bold },
});
