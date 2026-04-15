import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { Colors, Fonts, Spacing, Radius, Shadow } from '../theme';
import { mockAccounts, mockNetWorth } from '../data/mockData';

const TYPE_LABELS: Record<string, string> = {
  checking: 'Checking',
  savings: 'Savings',
  credit: 'Credit Card',
  loan: 'Loan',
};

// ── Link Account Sheet ────────────────────────────────────────────────────────
function LinkAccountModal({ onClose, visible }: { onClose: () => void; visible: boolean }) {
  const banks = [
    { name: 'Chase', emoji: '🏛️' },
    { name: 'Bank of America', emoji: '🏦' },
    { name: 'Wells Fargo', emoji: '🌐' },
    { name: 'Citibank', emoji: '🔵' },
    { name: 'Capital One', emoji: '⚡' },
    { name: 'Marcus (Goldman)', emoji: '💚' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalSheet} onPress={() => {}}>
          <Text style={styles.modalTitle}>Link a Bank Account</Text>
          <Text style={styles.modalSubtitle}>
            Securely connect your accounts via Plaid.
          </Text>

          <View style={styles.bankGrid}>
            {banks.map(bank => (
              <TouchableOpacity
                key={bank.name}
                style={styles.bankCard}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.bankEmoji}>{bank.emoji}</Text>
                <Text style={styles.bankName}>{bank.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── Account Row ───────────────────────────────────────────────────────────────
function AccountRow({ account }: { account: (typeof mockAccounts)[number] }) {
  const isDebt = !account.isAsset;
  return (
    <View style={styles.accountRow}>
      <View style={styles.accountInfo}>
        <Text style={styles.accountName}>{account.name}</Text>
        <Text style={styles.accountInstitution}>
          {account.institution} · {TYPE_LABELS[account.type]}
        </Text>
      </View>
      <Text style={[styles.accountBalance, isDebt && styles.debtBalance]}>
        {isDebt ? '-' : '+'}${Math.abs(account.balance).toLocaleString()}
      </Text>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function AccountsScreen() {
  const [showLink, setShowLink] = useState(false);

  const assets = mockAccounts.filter(a => a.isAsset);
  const debts = mockAccounts.filter(a => !a.isAsset);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Accounts</Text>
          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => setShowLink(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.linkBtnText}>+ Link Account</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Banner */}
        <View style={styles.summaryBanner}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Assets</Text>
            <Text style={[styles.summaryValue, { color: Colors.primary }]}>
              ${mockNetWorth.totalAssets.toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Liabilities</Text>
            <Text style={[styles.summaryValue, { color: Colors.danger }]}>
              ${mockNetWorth.totalLiabilities.toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Net Worth</Text>
            <Text style={[styles.summaryValue, { color: Colors.textDark }]}>
              ${mockNetWorth.total.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Assets Group */}
        <Text style={styles.groupLabel}>Checking & Savings</Text>
        <View style={styles.card}>
          {assets.map((acct, i) => (
            <View key={acct.id}>
              <AccountRow account={acct} />
              {i < assets.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Debts Group */}
        <Text style={styles.groupLabel}>Debt & Credit</Text>
        <View style={styles.card}>
          {debts.map((acct, i) => (
            <View key={acct.id}>
              <AccountRow account={acct} />
              {i < debts.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      <LinkAccountModal onClose={() => setShowLink(false)} visible={showLink} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: Spacing.md },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  headerTitle: {
    fontSize: Fonts.sizes.xl,
    fontWeight: Fonts.weights.bold,
    color: Colors.textDark,
  },
  linkBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
  },
  linkBtnText: {
    color: '#fff',
    fontWeight: Fonts.weights.semibold,
    fontSize: Fonts.sizes.sm,
  },

  // Summary
  summaryBanner: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    ...Shadow.card,
    overflow: 'hidden',
  },
  summaryItem: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md },
  summaryLabel: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, marginBottom: 4 },
  summaryValue: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold },
  summaryDivider: { width: 1, backgroundColor: Colors.border },

  // Groups
  groupLabel: {
    fontSize: Fonts.sizes.sm,
    fontWeight: Fonts.weights.semibold,
    color: Colors.textMuted,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    marginBottom: Spacing.lg,
    ...Shadow.card,
    overflow: 'hidden',
  },

  // Account rows
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  accountInfo: { flex: 1 },
  accountName: {
    fontSize: Fonts.sizes.md,
    fontWeight: Fonts.weights.semibold,
    color: Colors.textDark,
  },
  accountInstitution: {
    fontSize: Fonts.sizes.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  accountBalance: {
    fontSize: Fonts.sizes.md,
    fontWeight: Fonts.weights.bold,
    color: Colors.primary,
  },
  debtBalance: { color: Colors.danger },
  divider: { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.md },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(26,43,30,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  modalTitle: {
    fontSize: Fonts.sizes.xl,
    fontWeight: Fonts.weights.bold,
    color: Colors.textDark,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: Fonts.sizes.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
  },
  bankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  bankCard: {
    width: '30%',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bankEmoji: { fontSize: 28, marginBottom: 4 },
  bankName: { fontSize: Fonts.sizes.xs, color: Colors.textDark, fontWeight: Fonts.weights.medium, textAlign: 'center' },
  cancelBtn: {
    borderRadius: Radius.full,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelText: { color: Colors.textMuted, fontWeight: Fonts.weights.medium },
});
