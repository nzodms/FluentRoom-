/**
 * Fond vivant : halos flous qui dérivent lentement + grain très fin.
 * Purement décoratif, désactivé si prefers-reduced-motion.
 */
export function AmbientBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div
        className="fr-blob fr-blob-a"
        style={{
          top: "-12%",
          right: "-10%",
          width: "55vw",
          height: "55vw",
          maxWidth: 560,
          maxHeight: 560,
          background:
            "radial-gradient(circle, rgba(88,92,226,0.16), transparent 70%)",
        }}
      />
      <div
        className="fr-blob fr-blob-b"
        style={{
          top: "30%",
          left: "-18%",
          width: "48vw",
          height: "48vw",
          maxWidth: 480,
          maxHeight: 480,
          background:
            "radial-gradient(circle, rgba(249,113,74,0.1), transparent 70%)",
        }}
      />
      <div
        className="fr-blob fr-blob-a"
        style={{
          bottom: "-15%",
          right: "8%",
          width: "42vw",
          height: "42vw",
          maxWidth: 420,
          maxHeight: 420,
          animationDelay: "-12s",
          background:
            "radial-gradient(circle, rgba(44,183,131,0.1), transparent 70%)",
        }}
      />
      <div className="fr-grain" />
    </div>
  );
}
