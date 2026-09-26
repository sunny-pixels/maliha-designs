import Link from "next/link";
import { LongArrowRightIcon } from "./Icons";

type Props = {
  label: string;
  /** Renders a link when set; otherwise a non-interactive span (used inside card links). */
  href?: string;
  textClass?: "u-pb1" | "u-p2";
  className?: string;
  style?: React.CSSProperties;
};

/** `.Button--TertiaryOnDark`: white text + long arrow, underline grows on hover. */
export function TertiaryButton({ label, href, textClass = "u-pb1", className = "", style }: Props) {
  const inner = (
    <span className="ButtonTextContainer">
      <span className="ButtonText">
        <span className={`button-txt ${textClass}`}>{label}</span>
        <LongArrowRightIcon />
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className={`Button Button--TertiaryOnDark ${className}`} style={style}>
        {inner}
      </Link>
    );
  }
  return (
    <span className={`Button Button--TertiaryOnDark ${className}`} style={style}>
      {inner}
    </span>
  );
}
