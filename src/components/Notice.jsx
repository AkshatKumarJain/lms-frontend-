export default function Notice({ type = "info", message }) {
  if (!message) {
    return null;
  }

  const toneMap = {
    info: "border-[#c8dde7] bg-[#eef8fd] text-[#194a68]",
    success: "border-[rgba(18,81,62,0.16)] bg-[var(--success)] text-[var(--success-ink)]",
    error: "border-[rgba(138,47,34,0.18)] bg-[var(--error)] text-[var(--error-ink)]",
  };

  return (
    <div className={`rounded-[1.25rem] border px-4 py-3 text-sm font-medium shadow-[0_10px_24px_rgba(55,33,18,0.05)] ${toneMap[type]}`}>
      {message}
    </div>
  );
}
