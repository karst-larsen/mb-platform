export interface CtaBannerProps {
  heading: string;
  body?: string;
  ctaText: string;
  ctaUrl: string;
}

export function CtaBanner({ heading, body, ctaText, ctaUrl }: CtaBannerProps) {
  return (
    <section className="cta-banner">
      <h2>{heading}</h2>
      {body && <p>{body}</p>}
      <a href={ctaUrl}>{ctaText}</a>
    </section>
  );
}
