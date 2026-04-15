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
  Dimensions,
} from 'react-native';
import Svg, {
  Path,
  Rect,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Text as SvgText,
} from 'react-native-svg';
import { Colors, Fonts, Spacing, Radius, Shadow } from '../theme';
import MoneyBall from '../components/MoneyBall';
import { mockMilestones, mockUser, categoryColors, Milestone } from '../data/mockData';

const { width: SCREEN_W } = Dimensions.get('window');
const SVG_W = SCREEN_W;

// Each milestone occupies this much vertical space on the map
const SEGMENT_H = 160;
const MAP_PAD_TOP = 60;
const MAP_PAD_BOTTOM = 80;
const TOTAL_H = MAP_PAD_TOP + mockMilestones.length * SEGMENT_H + MAP_PAD_BOTTOM;

// X positions for left / center / right
const POS_X = {
  left:   SVG_W * 0.22,
  center: SVG_W * 0.50,
  right:  SVG_W * 0.78,
};

// Assign alternating x positions to each milestone to create the winding path
const MILESTONE_POSITIONS: Array<'left' | 'center' | 'right'> = [
  'center', 'left', 'right', 'center', 'left', 'right', 'center', 'left', 'center',
];

interface NodePoint { x: number; y: number; milestone: Milestone }

function buildPoints(): NodePoint[] {
  return mockMilestones.map((m, i) => ({
    x: POS_X[MILESTONE_POSITIONS[i]],
    y: MAP_PAD_TOP + i * SEGMENT_H + SEGMENT_H / 2,
    milestone: m,
  }));
}

// Build a smooth SVG path through all node points (for the road)
function buildRoadPath(points: NodePoint[]): string {
  if (points.length === 0) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cy = (prev.y + curr.y) / 2;
    d += ` C ${prev.x} ${cy}, ${curr.x} ${cy}, ${curr.x} ${curr.y}`;
  }
  return d;
}

// Build a terrain fill path: hills that peak at each node
function buildTerrainPath(points: NodePoint[], floorY: number): string {
  if (points.length === 0) return '';
  // Start at bottom-left
  let d = `M 0 ${floorY}`;
  // Come up to first point
  d += ` C ${points[0].x * 0.5} ${floorY}, ${points[0].x * 0.8} ${points[0].y + 40}, ${points[0].x} ${points[0].y + 20}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const valleyY = Math.min(floorY, (prev.y + curr.y) / 2 + 55);
    const midX = (prev.x + curr.x) / 2;
    // Down into valley
    d += ` C ${prev.x} ${valleyY - 10}, ${midX} ${valleyY + 10}, ${midX} ${valleyY}`;
    // Up to next peak
    d += ` C ${midX} ${valleyY - 10}, ${curr.x} ${curr.y + 30}, ${curr.x} ${curr.y + 20}`;
  }
  // Close down to bottom-right
  const last = points[points.length - 1];
  d += ` C ${last.x + (SVG_W - last.x) * 0.3} ${last.y + 40}, ${SVG_W * 0.9} ${floorY}, ${SVG_W} ${floorY}`;
  d += ` L ${SVG_W} ${TOTAL_H} L 0 ${TOTAL_H} Z`;
  return d;
}

// ── Milestone detail modal ────────────────────────────────────────────────────
function MilestoneModal({ milestone, onClose }: { milestone: Milestone | null; onClose: () => void }) {
  if (!milestone) return null;
  const catColor = categoryColors[milestone.category] ?? Colors.pastelGreen;
  const statusLabel =
    milestone.status === 'completed' ? '✅ Completed'
    : milestone.status === 'active'  ? '⚡ In Progress'
    : '🔒 Locked';

  return (
    <Modal transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={[styles.catBadge, { backgroundColor: catColor }]}>
            <Text style={styles.catBadgeText}>{milestone.category}</Text>
          </View>
          <Text style={styles.modalTitle}>{milestone.title}</Text>
          <Text style={styles.modalDesc}>{milestone.description}</Text>
          <View style={styles.modalMeta}>
            <Text style={styles.modalMetaLabel}>Status</Text>
            <Text style={styles.modalMetaValue}>{statusLabel}</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function JourneyScreen() {
  const [selected, setSelected] = useState<Milestone | null>(null);
  const points = buildPoints();
  const roadPath = buildRoadPath(points);
  const terrainPath = buildTerrainPath(points, TOTAL_H - 30);

  const completedCount = mockUser.milestonesCompleted;
  const totalCount = mockUser.totalMilestones;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Journey</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>{completedCount} of {totalCount} milestones</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* SVG Terrain Map */}
        <View style={{ width: SVG_W, height: TOTAL_H }}>
          <Svg width={SVG_W} height={TOTAL_H}>
            <Defs>
              {/* Sky gradient */}
              <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#D6EEF5" />
                <Stop offset="100%" stopColor="#FAFAF7" />
              </LinearGradient>
              {/* Terrain gradient */}
              <LinearGradient id="terrain" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#6FD4A0" />
                <Stop offset="100%" stopColor="#2D8653" />
              </LinearGradient>
              {/* Background hills */}
              <LinearGradient id="bgHill" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#B8E8CC" stopOpacity="0.5" />
                <Stop offset="100%" stopColor="#B8E8CC" stopOpacity="0.1" />
              </LinearGradient>
              {/* Locked terrain */}
              <LinearGradient id="lockedTerrain" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#C5CEC7" />
                <Stop offset="100%" stopColor="#A0ABA2" />
              </LinearGradient>
              {/* Road */}
              <LinearGradient id="road" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#4CAF7D" stopOpacity="0.9" />
                <Stop offset="100%" stopColor="#2D8653" stopOpacity="0.6" />
              </LinearGradient>
            </Defs>

            {/* Sky */}
            <Path d={`M 0 0 L ${SVG_W} 0 L ${SVG_W} ${TOTAL_H} L 0 ${TOTAL_H} Z`} fill="url(#sky)" />

            {/* Far background hills — pale blue-green, tiny */}
            <Path
              d={`M -20 ${TOTAL_H}
                  C 0 ${TOTAL_H * 0.72}, ${SVG_W * 0.18} ${TOTAL_H * 0.62}, ${SVG_W * 0.28} ${TOTAL_H * 0.65}
                  C ${SVG_W * 0.38} ${TOTAL_H * 0.68}, ${SVG_W * 0.45} ${TOTAL_H * 0.60}, ${SVG_W * 0.55} ${TOTAL_H * 0.62}
                  C ${SVG_W * 0.65} ${TOTAL_H * 0.64}, ${SVG_W * 0.75} ${TOTAL_H * 0.58}, ${SVG_W * 0.85} ${TOTAL_H * 0.63}
                  C ${SVG_W * 0.95} ${TOTAL_H * 0.68}, ${SVG_W + 20} ${TOTAL_H * 0.66}, ${SVG_W + 20} ${TOTAL_H} Z`}
              fill="#b2d9a0"
              opacity={0.5}
            />

            {/* Mid hills — medium green */}
            <Path
              d={`M -20 ${TOTAL_H}
                  C ${SVG_W * 0.05} ${TOTAL_H * 0.78}, ${SVG_W * 0.15} ${TOTAL_H * 0.70}, ${SVG_W * 0.25} ${TOTAL_H * 0.72}
                  C ${SVG_W * 0.35} ${TOTAL_H * 0.75}, ${SVG_W * 0.42} ${TOTAL_H * 0.65}, ${SVG_W * 0.52} ${TOTAL_H * 0.67}
                  C ${SVG_W * 0.62} ${TOTAL_H * 0.70}, ${SVG_W * 0.70} ${TOTAL_H * 0.62}, ${SVG_W * 0.80} ${TOTAL_H * 0.66}
                  C ${SVG_W * 0.90} ${TOTAL_H * 0.70}, ${SVG_W + 20} ${TOTAL_H * 0.74}, ${SVG_W + 20} ${TOTAL_H} Z`}
              fill="#7ec850"
              opacity={0.7}
            />

            {/* Main terrain — bright cartoon green, big round hills */}
            <Path d={terrainPath} fill="url(#terrain)" />

            {/* Grass stripe at bottom */}
            <Rect x={0} y={TOTAL_H - 38} width={SVG_W} height={38} fill="#4caf50" opacity={0.9} />
            {/* Grass blade highlights */}
            <Path
              d={`M 0 ${TOTAL_H - 38} Q ${SVG_W * 0.12} ${TOTAL_H - 55} ${SVG_W * 0.25} ${TOTAL_H - 38}
                  Q ${SVG_W * 0.38} ${TOTAL_H - 58} ${SVG_W * 0.50} ${TOTAL_H - 38}
                  Q ${SVG_W * 0.62} ${TOTAL_H - 52} ${SVG_W * 0.75} ${TOTAL_H - 38}
                  Q ${SVG_W * 0.88} ${TOTAL_H - 56} ${SVG_W + 20} ${TOTAL_H - 38}`}
              stroke="#66bb6a"
              strokeWidth={3}
              fill="#56c45a"
              opacity={0.85}
            />

            {/* Dashed road path */}
            <Path
              d={roadPath}
              stroke="rgba(255,255,255,0.55)"
              strokeWidth={3}
              strokeDasharray="10,8"
              fill="none"
              strokeLinecap="round"
            />

            {/* Milestone nodes */}
            {points.map((pt) => {
              const { milestone } = pt;
              const isCompleted = milestone.status === 'completed';
              const isActive    = milestone.status === 'active';
              const isBoss      = milestone.category === 'Boss';
              const nodeR       = isBoss ? 26 : 20;
              const catColor    = categoryColors[milestone.category] ?? Colors.primary;

              if (isActive) return null; // rendered as MoneyBall overlay below

              return (
                <React.Fragment key={milestone.id}>
                  {/* Node circle */}
                  <Circle
                    cx={pt.x}
                    cy={pt.y}
                    r={nodeR}
                    fill={isCompleted ? catColor : '#E0E6E2'}
                    stroke={isCompleted ? 'white' : '#C5CEC7'}
                    strokeWidth={2.5}
                    onPress={() => setSelected(milestone)}
                  />
                  {/* Icon inside */}
                  <SvgText
                    x={pt.x}
                    y={pt.y + 6}
                    textAnchor="middle"
                    fontSize={isCompleted ? 16 : 14}
                    onPress={() => setSelected(milestone)}
                  >
                    {isCompleted ? '✓' : isBoss ? '⚔️' : '🔒'}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </Svg>

          {/* Money Ball on active node — overlaid as RN View for animation */}
          {points.map((pt) => {
            if (pt.milestone.status !== 'active') return null;
            return (
              <TouchableOpacity
                key={pt.milestone.id}
                onPress={() => setSelected(pt.milestone)}
                style={[
                  styles.activeBallWrapper,
                  { left: pt.x - 32, top: pt.y - 60 },
                ]}
                activeOpacity={0.85}
              >
                <MoneyBall size={64} animate glowing />
              </TouchableOpacity>
            );
          })}

          {/* Milestone labels — overlaid as RN Views */}
          {points.map((pt, i) => {
            const isRight = MILESTONE_POSITIONS[i] === 'right';
            const labelX = isRight ? pt.x - 140 : pt.x + 36;
            return (
              <TouchableOpacity
                key={`label-${pt.milestone.id}`}
                onPress={() => setSelected(pt.milestone)}
                style={[styles.labelWrapper, { left: labelX, top: pt.y - 22, width: 110 }]}
                activeOpacity={0.7}
              >
                <Text style={styles.labelTitle} numberOfLines={2}>{pt.milestone.title}</Text>
                {pt.milestone.category === 'Boss' && (
                  <Text style={styles.bossTag}>BOSS</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>

      <MilestoneModal milestone={selected} onClose={() => setSelected(null)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#D6EEF5' },
  scroll: { flex: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: Fonts.sizes.xl, fontWeight: Fonts.weights.bold, color: Colors.textDark },
  progressBadge: {
    backgroundColor: Colors.pastelGreen,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  progressText: { fontSize: Fonts.sizes.xs, color: Colors.primary, fontWeight: Fonts.weights.semibold },

  activeBallWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },

  labelWrapper: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: Radius.md,
    paddingHorizontal: 8,
    paddingVertical: 5,
    ...Shadow.card,
  },
  labelTitle: {
    fontSize: Fonts.sizes.xs,
    fontWeight: Fonts.weights.semibold,
    color: Colors.textDark,
  },
  bossTag: {
    fontSize: 9,
    fontWeight: Fonts.weights.bold,
    color: Colors.danger,
    marginTop: 2,
  },

  // Modal
  backdrop: { flex: 1, backgroundColor: 'rgba(26,43,30,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  catBadge: {
    alignSelf: 'flex-start',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  catBadgeText: { fontSize: Fonts.sizes.xs, fontWeight: Fonts.weights.semibold, color: Colors.textDark },
  modalTitle: { fontSize: Fonts.sizes.xl, fontWeight: Fonts.weights.bold, color: Colors.textDark, marginBottom: Spacing.sm },
  modalDesc: { fontSize: Fonts.sizes.md, color: Colors.textMuted, lineHeight: 22, marginBottom: Spacing.lg },
  modalMeta: { marginBottom: Spacing.lg },
  modalMetaLabel: { fontSize: Fonts.sizes.xs, color: Colors.textMuted, marginBottom: 2 },
  modalMetaValue: { fontSize: Fonts.sizes.md, fontWeight: Fonts.weights.semibold, color: Colors.textDark },
  closeBtn: { backgroundColor: Colors.primary, borderRadius: Radius.full, paddingVertical: Spacing.md, alignItems: 'center' },
  closeBtnText: { color: '#fff', fontWeight: Fonts.weights.bold, fontSize: Fonts.sizes.md },
});
