module.exports = {
    default:{
        paths: ['features/**/*.feature'],
    requireModule: ['tsx/cjs'],
    require: ['steps/**/*.ts', 'support/**/*.ts'],
    format: ['progress']
    }
    
};