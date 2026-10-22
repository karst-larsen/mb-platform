import type { MigrationFunction } from 'contentful-migration';

const migration: MigrationFunction = (migration) => {
  const hero = migration.createContentType('sectionHero', {
    name: 'Section: Hero',
    displayField: 'heading',
  });
  hero.createField('heading').name('Heading').type('Symbol').required(true);
  hero.createField('subheading').name('Subheading').type('Text');
  hero.createField('ctaText').name('CTA Text').type('Symbol');
  hero.createField('ctaUrl').name('CTA URL').type('Symbol');
};

module.exports = migration;
