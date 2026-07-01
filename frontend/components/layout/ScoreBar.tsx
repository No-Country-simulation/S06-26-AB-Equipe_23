interface ScoreBarProps {
  score: number;
  label?: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#639922';
  if (score >= 60) return '#6C3FC5';
  return '#BA7517';
}

export default function ScoreBar({ score, label = 'Score diversidade' }: ScoreBarProps) {
  const color = getScoreColor(score);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
      <span style={{ fontSize: 10, color: '#9ca3af', width: 90, flexShrink: 0 }}>{label}</span>
      <div style={{
        flex: 1,
        height: 4,
        background: '#e5e7eb',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${score}%`,
          background: color,
          borderRadius: 2,
          transition: 'width 0.4s ease',
        }} />
      </div>
      <span style={{ fontSize: 10, fontWeight: 500, color, width: 28, textAlign: 'right' }}>
        {score}%
      </span>
    </div>
  );
}
