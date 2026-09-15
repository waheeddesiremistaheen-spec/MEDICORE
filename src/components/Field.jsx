export default function Field({ label, ...props }) {
  return (
    <label style={{ display: 'block', marginBottom: 16 }}>
      <span style={{
        display: 'block',
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        color: 'var(--muted)',
        marginBottom: 6,
      }}>
        {label}
      </span>
      {props.as === 'textarea'
        ? <textarea rows={3} {...props} />
        : <input {...props} />}
    </label>
  );
}