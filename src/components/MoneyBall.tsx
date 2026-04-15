import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import Svg, { Circle, Ellipse, Path, Defs, RadialGradient, LinearGradient, Stop, G, ClipPath, Rect } from 'react-native-svg';
import { Colors } from '../theme';

const AnimatedG = Animated.createAnimatedComponent(G);

interface MoneyBallProps {
  size?: number;
  animate?: boolean;
  glowing?: boolean;
  style?: object;
}

export default function MoneyBall({ size = 56, animate = true, glowing = false, style }: MoneyBallProps) {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const squishX   = useRef(new Animated.Value(1)).current;
  const squishY   = useRef(new Animated.Value(1)).current;
  const glowAnim  = useRef(new Animated.Value(0.5)).current;
  const eyeAnim   = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animate) return;
    const bounceLoop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(bounceAnim, { toValue: -size * 0.3, duration: 420, useNativeDriver: true }),
          Animated.timing(squishX,   { toValue: 0.9,          duration: 420, useNativeDriver: true }),
          Animated.timing(squishY,   { toValue: 1.1,          duration: 420, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(bounceAnim, { toValue: 0,   duration: 380, useNativeDriver: true }),
          Animated.timing(squishX,   { toValue: 1,    duration: 380, useNativeDriver: true }),
          Animated.timing(squishY,   { toValue: 1,    duration: 380, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(squishX, { toValue: 1.15, duration: 100, useNativeDriver: true }),
          Animated.timing(squishY, { toValue: 0.85, duration: 100, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(squishX, { toValue: 1, duration: 160, useNativeDriver: true }),
          Animated.timing(squishY, { toValue: 1, duration: 160, useNativeDriver: true }),
        ]),
        Animated.delay(700),
      ])
    );
    const blinkLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(2800),
        Animated.timing(eyeAnim, { toValue: 0.05, duration: 70, useNativeDriver: true }),
        Animated.timing(eyeAnim, { toValue: 1,    duration: 70, useNativeDriver: true }),
      ])
    );
    bounceLoop.start();
    blinkLoop.start();
    return () => { bounceLoop.stop(); blinkLoop.stop(); };
  }, [animate, size]);

  useEffect(() => {
    if (!glowing) return;
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1,   duration: 900, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0.3, duration: 900, useNativeDriver: true }),
      ])
    );
    glowLoop.start();
    return () => glowLoop.stop();
  }, [glowing]);

  const r = size / 2;
  const cx = r;
  const cy = r;

  // Bill rectangles scattered over the sphere surface
  // Each bill: [centerX_frac, centerY_frac, width_frac, height_frac, rotation_deg]
  const bills = [
    [0.50, 0.32, 0.52, 0.22,   5],
    [0.28, 0.50, 0.48, 0.21, -38],
    [0.72, 0.50, 0.48, 0.21,  38],
    [0.50, 0.68, 0.52, 0.22,  -5],
    [0.30, 0.28, 0.38, 0.18,  55],
    [0.70, 0.28, 0.38, 0.18, -55],
    [0.20, 0.66, 0.36, 0.17,  30],
    [0.80, 0.66, 0.36, 0.17, -30],
    [0.50, 0.50, 0.44, 0.20,  20],
    [0.48, 0.18, 0.34, 0.16,  -8],
    [0.50, 0.82, 0.34, 0.16,   8],
  ];

  return (
    <Animated.View
      style={[
        styles.wrapper,
        style,
        { transform: [{ translateY: bounceAnim }, { scaleX: squishX }, { scaleY: squishY }] },
      ]}
    >
      {glowing && (
        <Animated.View
          style={[
            styles.glow,
            { width: size * 1.8, height: size * 1.8, borderRadius: size * 0.9, opacity: glowAnim },
          ]}
        />
      )}

      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <RadialGradient id="ballBase" cx="40%" cy="35%" r="65%">
            <Stop offset="0%"   stopColor="#d4edaa" />
            <Stop offset="45%"  stopColor="#8bc34a" />
            <Stop offset="100%" stopColor="#33691e" />
          </RadialGradient>
          <RadialGradient id="ballSheen" cx="38%" cy="30%" r="55%">
            <Stop offset="0%"   stopColor="rgba(255,255,255,0.28)" />
            <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </RadialGradient>
          <ClipPath id="ballClip">
            <Circle cx={cx} cy={cy} r={r - 1} />
          </ClipPath>
          <LinearGradient id="billFace" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%"   stopColor="#c8e6a0" />
            <Stop offset="100%" stopColor="#7cb342" />
          </LinearGradient>
          <LinearGradient id="billBorder" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%"   stopColor="#558b2f" />
            <Stop offset="100%" stopColor="#33691e" />
          </LinearGradient>
        </Defs>

        {/* Base sphere */}
        <Circle cx={cx} cy={cy} r={r - 1} fill="url(#ballBase)" />

        {/* Dollar bills clipped to sphere */}
        <G clipPath="url(#ballClip)">
          {bills.map(([bx, by, bw, bh, rot], i) => {
            const bCx = bx * size;
            const bCy = by * size;
            const bW  = bw * size;
            const bH  = bh * size;
            return (
              <G key={i} transform={`rotate(${rot}, ${bCx}, ${bCy})`}>
                {/* Bill background */}
                <Rect
                  x={bCx - bW / 2}
                  y={bCy - bH / 2}
                  width={bW}
                  height={bH}
                  rx={bH * 0.12}
                  fill="url(#billFace)"
                  stroke="url(#billBorder)"
                  strokeWidth={r * 0.04}
                  opacity={0.82}
                />
                {/* Inner border line */}
                <Rect
                  x={bCx - bW / 2 + bH * 0.1}
                  y={bCy - bH / 2 + bH * 0.1}
                  width={bW - bH * 0.2}
                  height={bH - bH * 0.2}
                  rx={bH * 0.06}
                  fill="none"
                  stroke="rgba(85,139,47,0.5)"
                  strokeWidth={r * 0.025}
                />
                {/* Center oval (portrait area) */}
                <Ellipse
                  cx={bCx}
                  cy={bCy}
                  rx={bH * 0.28}
                  ry={bH * 0.32}
                  fill="rgba(200,230,160,0.6)"
                  stroke="rgba(85,139,47,0.4)"
                  strokeWidth={r * 0.02}
                />
                {/* $ symbol in center */}
                <Path
                  d={`M${bCx - bH * 0.06},${bCy - bH * 0.12}
                      C${bCx - bH * 0.14},${bCy - bH * 0.12} ${bCx - bH * 0.16},${bCy - bH * 0.06} ${bCx - bH * 0.16},${bCy}
                      C${bCx - bH * 0.16},${bCy + bH * 0.06} ${bCx - bH * 0.04},${bCy + bH * 0.07} ${bCx + bH * 0.01},${bCy + bH * 0.1}
                      C${bCx + bH * 0.14},${bCy + bH * 0.12} ${bCx + bH * 0.16},${bCy + bH * 0.06} ${bCx + bH * 0.16},${bCy}
                      C${bCx + bH * 0.16},${bCy - bH * 0.06} ${bCx + bH * 0.06},${bCy - bH * 0.07} ${bCx + bH * 0.01},${bCy - bH * 0.1}`}
                  stroke="rgba(51,105,30,0.8)"
                  strokeWidth={r * 0.045}
                  fill="none"
                  strokeLinecap="round"
                />
                <Path
                  d={`M${bCx},${bCy - bH * 0.2} L${bCx},${bCy + bH * 0.2}`}
                  stroke="rgba(51,105,30,0.8)"
                  strokeWidth={r * 0.04}
                  strokeLinecap="round"
                />
              </G>
            );
          })}
        </G>

        {/* Sphere sheen overlay */}
        <Circle cx={cx} cy={cy} r={r - 1} fill="url(#ballSheen)" />

        {/* Face — eyes */}
        <AnimatedG opacity={eyeAnim}>
          {/* Left eye white */}
          <Ellipse cx={cx - r * 0.26} cy={cy + r * 0.1} rx={r * 0.13} ry={r * 0.16} fill="white" />
          {/* Right eye white */}
          <Ellipse cx={cx + r * 0.26} cy={cy + r * 0.1} rx={r * 0.13} ry={r * 0.16} fill="white" />
          {/* Left pupil */}
          <Circle cx={cx - r * 0.22} cy={cy + r * 0.13} r={r * 0.07} fill="#1A2B1E" />
          {/* Right pupil */}
          <Circle cx={cx + r * 0.30} cy={cy + r * 0.13} r={r * 0.07} fill="#1A2B1E" />
          {/* Left eye shine */}
          <Circle cx={cx - r * 0.19} cy={cy + r * 0.08} r={r * 0.03} fill="white" />
          <Circle cx={cx + r * 0.33} cy={cy + r * 0.08} r={r * 0.03} fill="white" />
        </AnimatedG>

        {/* Smile */}
        <Path
          d={`M${cx - r * 0.22},${cy + r * 0.3} Q${cx},${cy + r * 0.48} ${cx + r * 0.22},${cy + r * 0.3}`}
          stroke="rgba(51,105,30,0.85)"
          strokeWidth={r * 0.08}
          fill="none"
          strokeLinecap="round"
        />

        {/* Rosy cheeks */}
        <Ellipse cx={cx - r * 0.38} cy={cy + r * 0.22} rx={r * 0.1} ry={r * 0.06} fill="rgba(255,160,100,0.3)" />
        <Ellipse cx={cx + r * 0.38} cy={cy + r * 0.22} rx={r * 0.1} ry={r * 0.06} fill="rgba(255,160,100,0.3)" />

        {/* Highlight */}
        <Ellipse
          cx={cx - r * 0.2}
          cy={cy - r * 0.28}
          rx={r * 0.18}
          ry={r * 0.1}
          fill="rgba(255,255,255,0.4)"
          transform={`rotate(-30, ${cx - r * 0.2}, ${cy - r * 0.28})`}
        />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center', justifyContent: 'center' },
  glow: { position: 'absolute', backgroundColor: Colors.primary, opacity: 0.2 },
});
