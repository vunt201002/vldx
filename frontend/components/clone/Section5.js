export default function Section5() {
  const panels = [
    {
      src: "https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1650916498846-WIN385GTSZOJF38NZB9U/IMG_0012-3.JPG?format=2500w",
      alt: "IMG_0012-3.JPG",
      // Original: 1920x816 container, image 1920x1280 (2304x1536 source), focal point ~(0.518, 0.860)
      // Object position: center the focal point — 51.8% horizontal, 86% vertical
      heightClass: "h-[420px] md:h-[580px] lg:h-[816px]",
      objectPosition: "51.8% 86%",
    },
    {
      src: "https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1712350791472-ITP0ENRPYIJSD69B3LHR/BeigeLeftBanner.jpg?format=2500w",
      alt: "BeigeLeftBanner.jpg",
      // Original: 1920x581 container, image 1920x1016 (1500x794 source), focal point (0.5, 0.5)
      heightClass: "h-[300px] md:h-[420px] lg:h-[581px]",
      objectPosition: "50% 50%",
    },
    {
      src: "https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1584988979321-30OHQ0V026TXWD87U7G3/greenhomebanner.png?format=2500w",
      alt: "greenhomebanner.png",
      // Original: 1920x871 container, image 1920x1016 (1500x794 source), focal point (0.5, 0.5)
      heightClass: "h-[420px] md:h-[620px] lg:h-[871px]",
      objectPosition: "50% 50%",
    },
    {
      src: "https://images.squarespace-cdn.com/content/v1/5e7264e09353654eb06bde4d/1585783532903-CRMIRYQNEEKSRWZ93TMH/peachfooter.png?format=2500w",
      alt: "peachfooter.png",
      // Original: 1920x1208 container, image very wide 3754x1144 (1500x457 source), focal point (0.5, 0.5)
      // The image is rendered much wider than the container — simulate with object-cover center
      heightClass: "h-[400px] md:h-[700px] lg:h-[1208px]",
      objectPosition: "50% 50%",
    },
  ];

  return (
    <section
      style={{ backgroundColor: "rgb(0, 0, 0)" }}
      className="w-full overflow-hidden"
    >
      {panels.map((panel, index) => (
        <div
          key={index}
          className={`relative w-full overflow-hidden ${panel.heightClass}`}
        >
          {/* Inner figure mirrors the original's overflow:hidden + parallax offset wrapper */}
          <figure
            className="absolute inset-0 w-full h-full m-0 p-0 overflow-hidden"
            style={{ bottom: 0 }}
          >
            <img
              src={panel.src}
              alt={panel.alt}
              className="w-full h-full"
              style={{
                objectFit: "cover",
                objectPosition: panel.objectPosition,
                display: "block",
              }}
            />
          </figure>
        </div>
      ))}
    </section>
  );
}
