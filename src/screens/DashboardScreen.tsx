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
import MoneyBall from '../components/MoneyBall';
import {
  mockUser,
  mockNetWorth,
  mockCashflow,
  mockCashflowHistory,
  mockSpendingCategories,
  mockDebts,
  mockSubscriptions,
} from '../data/mockData';

const CARD_PADDING = Spacing.md;

// ── Milestone Progress Bar ────────────────────────────────────────────────────
function MilestoneProgress() {
  const pct = mockUser.milestonesCompleted / mockUser.totalMilestones;
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressLabelRow}>
        <Text style={styles.progressLabel}>Journey Progress</Text>
        <Text style={styles.progressLabel}>
          {mockUser.milestonesCompleted} / {mockUser.totalMilestones} milestones
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct * 100}%` }]} />
      </View>
    </View>
  );
}

// ── Net Worth Hero Card ───────────────────────────────────────────────────────
function NetWorthCard() {
  const isPositive = mockNetWorth.total >= 0;
  return (
    <View style={styles.netWorthCard}>
      <View style={styles.netWorthLeft}>
        <Text style={styles.netWorthLabel}>Net Worth</Text>
        <Text style={styles.netWorthAmount}>
          {isPositive ? '+' : ''}${mockNetWorth.total.toLocaleString()}
        </Text>
        <View style={styles.netWorthRow}>
          <View style={styles.netWorthStat}>
            <Text style={styles.netWorthStatLabel}>Assets</Text>
            <Text style={styles.netWorthStatValue}>
              ${mockNetWorth.totalAssets.toLocaleString()}
            </Text>
          </View>
          <View style={styles.netWorthDivider} />
          <View style={styles.netWorthStat}>
            <Text style={styles.netWorthStatLabel}>Debts</Text>
            <Text style={[styles.netWorthStatValue, { color: Colors.danger }]}>
              ${mockNetWorth.totalLiabilities.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
      <MoneyBall size={64} animate glowing />
    </View>
  );
}

// ── Quick Stats ───────────────────────────────────────────────────────────────
function QuickStats() {
  const stats = [
    { label: 'Income', value: `$${mockCashflow.monthlyIncome.toLocaleString()}`, color: Colors.primary },
    { label: 'Spending', value: `$${mockCashflow.monthlySpending.toLocaleString()}`, color: Colors.textDark },
    { label: 'Surplus', value: `$${mockCashflow.surplus.toLocaleString()}`, color: Colors.primary },
  ];
  return (
    <View style={styles.quickStatsRow}>
      {stats.map((s, i) => (
        <View key={i} style={styles.quickStat}>
          <Text style={[styles.quickStatValue, { color: s.color }]}>{s.value}</Text>
          <Text style={styles.quickStatLabel}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}

// ── Cashflow History Modal ────────────────────────────────────────────────────
function CashflowHistoryModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const maxIncome = Math.max(...mockCashflowHistory.map(m => m.income));
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalSheet} onPress={() => {}}>
          <Text style={styles.modalTitle}>Monthly Cashflow History</Text>
          <Text style={styles.modalSubtitle}>Last 6 months</Text>
          {mockCashflowHistory.map((m, i) => {
            const incomePct = m.income / maxIncome;
            const spendPct = m.spending / maxIncome;
            const surplus = m.surplus >= 0;
            return (
              <View key={i} style={styles.historyRow}>
                <Text style={styles.historyMonth}>{m.month}</Text>
                <View style={styles.historyBars}>
                  <View style={styles.historyBarTrack}>
                    <View style={[styles.historyBar, { width: `${incomePct * 100}%`, backgroundColor: Colors.pastelGreen }]} />
                  </View>
                  <View style={[styles.historyBarTrack, { marginTop: 3 }]}>
                    <View style={[styles.historyBar, { width: `${spendPct * 100}%`, backgroundColor: spendPct > 0.9 ? Colors.danger : Colors.pastelPeach }]} />
                  </View>
                </View>
                <Text style={[styles.historySurplus, { color: surplus ? Colors.primary : Colors.danger }]}>
                  {surplus ? '+' : ''}${m.surplus.toLocaleString()}
                </Text>
              </View>
            );
          })}
          <View style={styles.historyLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.pastelGreen }]} />
              <Text style={styles.legendLabel}>Income</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: Colors.pastelPeach }]} />
              <Text style={styles.legendLabel}>Spending</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── Cashflow Bar ──────────────────────────────────────────────────────────────
function CashflowSection({ onPress }: { onPress: () => void }) {
  const spendingPct = mockCashflow.monthlySpending / mockCashflow.monthlyIncome;
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Monthly Cashflow</Text>
      <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
        <View style={styles.card}>
          <View style={styles.cashflowLabelRow}>
            <Text style={styles.cashflowLabel}>Income</Text>
            <Text style={styles.cashflowLabel}>Spending</Text>
            <Text style={styles.cashflowTapHint}>Tap for history</Text>
          </View>
          <View style={styles.cashflowBarTrack}>
            <View style={[styles.cashflowBar, { width: '100%', backgroundColor: Colors.pastelGreen }]} />
          </View>
          <View style={styles.cashflowBarTrack}>
            <View
              style={[
                styles.cashflowBar,
                {
                  width: `${spendingPct * 100}%`,
                  backgroundColor: spendingPct > 0.9 ? Colors.danger : Colors.pastelPeach,
                },
              ]}
            />
          </View>
          <Text style={styles.surplusText}>
            ${mockCashflow.surplus.toLocaleString()} surplus this month
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// ── Subscriptions ─────────────────────────────────────────────────────────────
function SubscriptionsSection() {
  const total = mockSubscriptions.reduce((sum, s) => sum + s.amount, 0);
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Subscriptions</Text>
      <View style={styles.card}>
        <View style={styles.subHeader}>
          <Text style={styles.subTotalLabel}>Monthly total</Text>
          <Text style={styles.subTotalValue}>${total.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />
        {mockSubscriptions.map((sub, i) => (
          <View key={i} style={styles.subRow}>
            <View style={[styles.subDot, { backgroundColor: sub.color }]} />
            <View style={styles.subInfo}>
              <Text style={styles.subName}>{sub.name}</Text>
              <Text style={styles.subCategory}>{sub.category}</Text>
            </View>
            <Text style={styles.subAmount}>${sub.amount.toFixed(2)}/mo</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ── Spending Breakdown ────────────────────────────────────────────────────────
function SpendingBreakdown() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Spending Breakdown</Text>
      <View style={styles.card}>
        {mockSpendingCategories.map((cat, i) => {
          const pct = cat.amount / cat.budget;
          const overBudget = pct > 1;
          return (
            <View key={i} style={styles.catRow}>
              <View style={styles.catLabelCol}>
                <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                <Text style={styles.catName}>{cat.name}</Text>
              </View>
              <View style={styles.catBarCol}>
                <View style={styles.catTrack}>
                  <View
                    style={[
                      styles.catFill,
                      {
                        width: `${Math.min(pct, 1) * 100}%`,
                        backgroundColor: overBudget ? Colors.danger : cat.color,
                      },
                    ]}
                  />
                </View>
              </View>
              <Text style={[styles.catAmount, overBudget && styles.overBudget]}>
                ${cat.amount}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ── Debt Tracker ─────────────────────────────────────────────────────────────
function DebtTracker() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Debt Tracker</Text>
      {mockDebts.map(debt => (
        <View key={debt.id} style={[styles.card, styles.debtCard]}>
          <View style={styles.debtTop}>
            <View>
              <Text style={styles.debtName}>{debt.name}</Text>
              <Text style={styles.debtInstitution}>{debt.institution}</Text>
            </View>
            <Text style={styles.debtBalance}>${debt.balance.toLocaleString()}</Text>
          </View>
          <View style={styles.debtStats}>
            <Text style={styles.debtStat}>{debt.interestRate}% APR</Text>
            <Text style={styles.debtStatDot}>·</Text>
            <Text style={styles.debtStat}>Min ${debt.minPayment}/mo</Text>
            <Text style={styles.debtStatDot}>·</Text>
            <Text style={styles.debtStat}>{debt.payoffMonths} mo payoff</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function DashboardScreen() {
  const [showCashflowHistory, setShowCashflowHistory] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>{mockUser.name}</Text>
          </View>
          <View style={styles.milestoneBadge}>
            <Text style={styles.milestoneBadgeText}>
              {mockUser.milestonesCompleted} milestones
            </Text>
          </View>
        </View>

        <MilestoneProgress />
        <NetWorthCard />
        <QuickStats />
        <CashflowSection onPress={() => setShowCashflowHistory(true)} />
        <SubscriptionsSection />
        <SpendingBreakdown />

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      <CashflowHistoryModal
        visible={showCashflowHistory}
        onClose={() => setShowCashflowHistory(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: CARD_PADDING },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  greeting: { fontSize: Fonts.sizes.sm, color: Colors.textMuted, fontWeight: Fonts.weights.regular },
  userName: { fontSize: Fonts.sizes.xl, color: Colors.textDark, fontWeight: Fonts.weights.bold },
  milestoneBadge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  milestoneBadgeText: { color: '#fff', fontWeight: Fonts.weights.bold, fontSize: Fonts.sizes.xs },

  // Milestone Progress
  progressContainer: { marginBottom: Spacing.md },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, fontWeight: Fonts.weights.medium },
  progressTrack: { height: 8, backgroundColor: Colors.border, borderRadius: Radius.full, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: Radius.full },

  // Net Worth Card
  netWorthCard: {
    backgroundColor: Colors.gradientStart,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadow.strong,
  },
  netWorthLeft: { flex: 1 },
  netWorthLabel: { color: 'rgba(255,255,255,0.75)', fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.medium },
  netWorthAmount: { color: '#fff', fontSize: Fonts.sizes.xxl, fontWeight: Fonts.weights.heavy, marginVertical: 4 },
  netWorthRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  netWorthStat: { marginRight: Spacing.sm },
  netWorthStatLabel: { color: 'rgba(255,255,255,0.65)', fontSize: Fonts.sizes.xs },
  netWorthStatValue: { color: '#fff', fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.semibold },
  netWorthDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.3)', marginRight: Spacing.sm },

  // Quick Stats
  quickStatsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    ...Shadow.card,
    overflow: 'hidden',
  },
  quickStat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  quickStatValue: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold },
  quickStatLabel: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, marginTop: 2 },

  // Sections
  section: { marginBottom: Spacing.md },
  sectionTitle: {
    fontSize: Fonts.sizes.lg,
    fontWeight: Fonts.weights.bold,
    color: Colors.textDark,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.card,
  },

  // Cashflow
  cashflowLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  cashflowLabel: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, fontWeight: Fonts.weights.medium, marginRight: Spacing.sm },
  cashflowTapHint: { marginLeft: 'auto', fontSize: Fonts.sizes.xs, color: Colors.primary, fontWeight: Fonts.weights.medium },
  cashflowBarTrack: { height: 12, backgroundColor: Colors.border, borderRadius: Radius.full, marginBottom: 6, overflow: 'hidden' },
  cashflowBar: { height: '100%', borderRadius: Radius.full },
  surplusText: { fontSize: Fonts.sizes.sm, color: Colors.primary, fontWeight: Fonts.weights.semibold, marginTop: 6 },

  // Cashflow history modal
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(26,43,30,0.45)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  modalTitle: { fontSize: Fonts.sizes.xl, fontWeight: Fonts.weights.bold, color: Colors.textDark, marginBottom: 2 },
  modalSubtitle: { fontSize: Fonts.sizes.sm, color: Colors.textMuted, marginBottom: Spacing.lg },
  historyRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  historyMonth: { width: 32, fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.semibold, color: Colors.textMuted },
  historyBars: { flex: 1, marginHorizontal: Spacing.sm },
  historyBarTrack: { height: 8, backgroundColor: Colors.border, borderRadius: Radius.full, overflow: 'hidden' },
  historyBar: { height: '100%', borderRadius: Radius.full },
  historySurplus: { width: 52, fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.bold, textAlign: 'right' },
  historyLegend: { flexDirection: 'row', gap: Spacing.lg, marginTop: Spacing.md, marginBottom: Spacing.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { fontSize: Fonts.sizes.xs, color: Colors.textMuted },
  closeBtn: { borderRadius: Radius.full, paddingVertical: Spacing.md, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  closeBtnText: { color: Colors.textMuted, fontWeight: Fonts.weights.medium },

  // Subscriptions
  subHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  subTotalLabel: { fontSize: Fonts.sizes.sm, color: Colors.textMuted, fontWeight: Fonts.weights.medium },
  subTotalValue: { fontSize: Fonts.sizes.lg, fontWeight: Fonts.weights.bold, color: Colors.textDark },
  divider: { height: 1, backgroundColor: Colors.border, marginBottom: Spacing.sm },
  subRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  subDot: { width: 10, height: 10, borderRadius: 5, marginRight: Spacing.sm },
  subInfo: { flex: 1 },
  subName: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.semibold, color: Colors.textDark },
  subCategory: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, marginTop: 1 },
  subAmount: { fontSize: Fonts.sizes.sm, fontWeight: Fonts.weights.semibold, color: Colors.textDark },

  // Spending
  catRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  catLabelCol: { flexDirection: 'row', alignItems: 'center', width: 110 },
  catDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  catName: { fontSize: Fonts.sizes.xs, color: Colors.textDark, fontWeight: Fonts.weights.medium, flex: 1 },
  catBarCol: { flex: 1, marginHorizontal: Spacing.sm },
  catTrack: { height: 6, backgroundColor: Colors.border, borderRadius: Radius.full, overflow: 'hidden' },
  catFill: { height: '100%', borderRadius: Radius.full },
  catAmount: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, width: 36, textAlign: 'right' },
  overBudget: { color: Colors.danger },

  // Debt
  debtCard: { marginBottom: Spacing.sm },
  debtTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  debtName: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.semibold, color: Colors.textDark },
  debtInstitution: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, marginTop: 2 },
  debtBalance: { fontSize: Fonts.sizes.xl, fontWeight: Fonts.weights.bold, color: Colors.danger },
  debtStats: { flexDirection: 'row', alignItems: 'center' },
  debtStat: { fontSize: Fonts.sizes.xs, color: Colors.textMuted },
  debtStatDot: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, marginHorizontal: 4 },
});
