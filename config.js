const config = {
  port: 3001,
  saltRounds: 10,
  jwtSecret: 'slkajdlkasdlaks',
  baseDir: __dirname,
  googleClientId: '730037568968-4lmrfuimkppnbp9m3htd0ial20t1r0ut.apps.googleusercontent.com',
  googleClientSecret: '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',
  googleRedirectUri: 'http://localhost:3000/users/auth/callback',
};

module.exports = config;
