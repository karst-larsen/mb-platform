export interface HeroProps {
  heading: string;
  subheading?: string;
  ctaText?: string;
  ctaUrl?: string;
}

export function Hero({ heading, subheading, ctaText, ctaUrl }: HeroProps) {
  return (
    <section className="hero">
      <h1>{heading}</h1>
      {subheading && <p>{subheading}</p>}
      {ctaText && ctaUrl && <a href={ctaUrl}>{ctaText}</a>}
    </section>
  );
}
