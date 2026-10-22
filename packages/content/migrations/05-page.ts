import type { MigrationFunction } from 'contentful-migration';

const migration: MigrationFunction = (migration) => {
  const page = migration.createContentType('page', {
    name: 'Page',
    displayField: 'title',
  });
  page.createField('title').name('Title').type('Symbol').required(true);
  page.createField('slug').name('Slug').type('Symbol').required(true);
  page
    .createField('brand')
    .name('Brand')
    .type('Link')
    .linkType('Entry')
    .required(true)
    .validations([{ linkContentType: ['brand'] }]);
  page
    .createField('seo')
    .name('SEO')
    .type('Link')
    .linkType('Entry')
    .validations([{ linkContentType: ['seo'] }]);
  page.createField('sections').name('Sections').type('Array').items({
    type: 'Link',
    linkType: 'Entry',
    validations: [{ linkContentType: ['sectionHero', 'sectionCta'] }],
  });
  page.changeFieldControl('slug', 'builtin', 'slugEditor');
};

module.exports = migration;
