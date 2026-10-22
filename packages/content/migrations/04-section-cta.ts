import type { MigrationFunction } from 'contentful-migration';

const migration: MigrationFunction = (migration) => {
  const cta = migration.createContentType('sectionCta', {
    name: 'Section: CTA Banner',
    displayField: 'heading',
  });
  cta.createField('heading').name('Heading').type('Symbol').required(true);
  cta.createField('body').name('Body').type('Text');
  cta.createField('ctaText').name('CTA Text').type('Symbol').required(true);
  cta.createField('ctaUrl').name('CTA URL').type('Symbol').required(true);
};

export default migration;
