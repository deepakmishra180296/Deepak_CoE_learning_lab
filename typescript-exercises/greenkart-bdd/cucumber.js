module.exports = {
  default: {
    // paths: ['features/**/*.feature'],
    requireModule: ['tsx/cjs'],
    require: ['steps/**/*.ts', 'support/**/*.ts'],
    format: ['progress', 'html:reports/cucumber-report.html']
  },
  cart: {
    paths: ['features/add_to_cart.feature'],
    requireModule: ['tsx/cjs'],
    require: ['steps/add_to_cart_steps.ts', 'steps/search_steps.ts', 'support/**/*.ts'],
    tags: 'not @known-failing',
    format: ['progress']
  }
};
