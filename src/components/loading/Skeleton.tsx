interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export default function Skeleton({
  width,
  height = "20px",
  className,
}: SkeletonProps) {
  const style: React.CSSProperties = {
    width: width || "100%",
    height,
  };

  return <div className={`skeleton ${className || ""}`} style={style} />;
}
