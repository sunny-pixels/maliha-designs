import { padVars, type Spacing } from "@/lib/sizing";

type Props = {
  text: string;
  /** Section wrapper padding. */
  padding: Spacing;
  /** Inner text-block padding. */
  blockPadding: Spacing;
  /** Space above the text (`--adjustment_m/d`). */
  adjustment?: number;
};

/** `section_heading_text`: a single u-h2 line in the left half of a two-column grid. */
export function HeadingText({ text, padding, blockPadding, adjustment = 20 }: Props) {
  const adj = { "--adjustment_m": `${adjustment}px`, "--adjustment_d": `${adjustment}px` } as React.CSSProperties;
  return (
    <div className="shopify-section">
      <div className="heading-text-section colorGroup--primary">
        <div className="heading-text-section__wrapper pad--responsive sectionMax_width " style={padVars(padding)}>
          <div className="heading-text-section__content heading-text-section__content--two-column ">
            <div className="group-text-button__block-wrapper content-alignment--left pad--responsive " style={padVars(blockPadding)}>
              <div className="heading-block adjustment rte u-h2" style={adj}>
                <p>{text}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
