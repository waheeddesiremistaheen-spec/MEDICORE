export default function Empty({ text }) {
  return (
    <p style={{
      padding: 40,
      textAlign: 'center',
      color: 'var(--muted)',
      border: '1px dashed var(--line)',
      borderRadius: 8,
    }}>
      {text}
    </p>
  );
}