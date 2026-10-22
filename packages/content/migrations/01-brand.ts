import type { MigrationFunction } from 'contentful-migration';

const migration: MigrationFunction = (migration) => {
  const brand = migration.createContentType('brand', {
    name: 'Brand',
    displayField: 'name',
  });
  brand.createField('name').name('Name').type('Symbol').required(true);
  brand.createField('slug').name('Slug').type('Symbol').required(true);
  brand.changeFieldControl('slug', 'builtin', 'slugEditor');
};

export default migration;
