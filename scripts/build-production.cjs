// Local production artifact only. This command never publishes or contacts Netlify.
process.env.SITE_ENV = 'production';
require('./build.cjs');
