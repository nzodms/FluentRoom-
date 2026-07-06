/**
 * Fond de map illustré : la vraie scène premium (image dans /public),
 * avec un léger overlay pour garder l'UI lisible par-dessus.
 * L'image remplit exactement la boîte de scène calculée par la map —
 * les nodes positionnés en % de l'image restent calés sur le décor.
 */
export function AdventureMapBackground({
  image,
}: {
  image: { src: string; width: number; height: number };
}) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt=""
        aria-hidden
        draggable={false}
        width={image.width}
        height={image.height}
        className="absolute inset-0 h-full w-full select-none object-fill"
      />
      {/* Overlay léger : lisibilité de l'UI sans éteindre la scène */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-cream/25 via-transparent to-cream/35"
      />
    </>
  );
}
