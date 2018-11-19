module.exports = {
  extends: 'airbnb-base',
  env: {
    mocha: true,
    node: true,
  },
  globals: {
    expect: true,
  },
  rules: {
    "require-jsdoc": ["error",
      {
        "require": {
          "FunctionDeclaration": true,
          "MethodDefinition": false,
          "ArrowFunctionExpression": false,
          "FunctionExpression": false
        }
      }
    ],
    "valid-jsdoc": "error"
  }
};
