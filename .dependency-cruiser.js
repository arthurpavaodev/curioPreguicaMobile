/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'domain-must-not-depend-on-frameworks-or-libraries',
      comment: 'Domain must be pure TypeScript. No external libraries allowed (React, Expo, etc.).',
      severity: 'error',
      from: { path: '^src/domain' },
      to: {
        dependencyTypes: [
          'npm',
          'npm-dev',
          'npm-optional',
          'npm-peer',
          'npm-bundled',
          'unknown',
        ],
      },
    },
    {
      name: 'domain-must-not-depend-on-outer-layers',
      comment: 'Domain cannot depend on application, adapters, or main.',
      severity: 'error',
      from: { path: '^src/domain' },
      to: { path: '^src/(application|adapters|main)' },
    },
    {
      name: 'application-must-not-depend-on-adapters-or-main',
      comment: 'Application layer can only depend on domain and application.',
      severity: 'error',
      from: { path: '^src/application' },
      to: { path: '^src/(adapters|main)' },
    },
    {
      name: 'application-must-not-depend-on-ui-frameworks',
      comment: 'Application layer must not depend on React, React Native or Expo.',
      severity: 'error',
      from: { path: '^src/application' },
      to: {
        dependencyTypes: ['npm'],
        path: '(react|react-native|expo)',
      },
    },
    {
      name: 'adapters-must-not-depend-on-main',
      comment: 'Adapters must not depend on composition root (main).',
      severity: 'error',
      from: { path: '^src/adapters' },
      to: { path: '^src/main' },
    },
  ],
  options: {
    doNotFollow: {
      path: 'node_modules',
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json',
    },
  },
};
