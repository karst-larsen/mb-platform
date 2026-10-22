import type { MigrationFunction } from 'contentful-migration';

const migration: MigrationFunction = (migration) => {
  const seo = migration.createContentType('seo', {
    name: 'SEO',
    displayField: 'title',
  });
  seo.createField('title').name('Title').type('Symbol').required(true);
  seo.createField('description').name('Description').type('Text');
  seo.createField('noIndex').name('No Index').type('Boolean');
};

module.exports = migration;
