// STUB – Person B replaces this
type Props = {
  src: string;
  title: string;
  color?: string;
  height?: number;
  autoRotate?: boolean;
};

export default function StlViewer({ src, title, height = 360 }: Props) {
  return (
    <figure className="stl-viewer">
      <div style={{ height }} role="img" aria-label={`3D model: ${title}`}>
        <p>3D preview placeholder for {title}</p>
      </div>
      <figcaption>
        {title} · <a href={src} download>Download STL</a>
      </figcaption>
    </figure>
  );
}
