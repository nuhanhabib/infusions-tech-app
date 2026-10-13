import { lucide, brands } from "./icons";

// Renders a line icon (Lucide) or a brand logo by name. See components/icons.js.
export default function Icon({ name, size = 24, strokeWidth = 2, className = "" }) {
  const brand = brands[name];
  if (brand) {
    return (
      <svg
        viewBox={brand.viewBox}
        width={size}
        height={size}
        fill="currentColor"
        className={className}
        aria-hidden="true"
        focusable="false"
        dangerouslySetInnerHTML={{ __html: brand.body }}
      />
    );
  }
  const body = lucide[name];
  if (!body) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: body }}
    />
  );
}
