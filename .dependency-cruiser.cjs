/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-cross-service-source-imports',
      comment:
        'Microservices must not import the source code of other services. ' +
        'Communication must go through explicit contracts (HTTP, gRPC, events, messages).',
      severity: 'error',
      from: { path: '^apps/([^/]+)/src/' },
      to: {
        path: '^apps/(?!\\1)[^/]+/src/',
        pathNot: '^apps/[^/]+/src/(?:shared|contracts)/',
      },
    },
    {
      name: 'no-package-depends-on-app',
      comment:
        'Workspace packages must not depend on application source. ' +
        'Dependency direction must be apps → packages.',
      severity: 'error',
      from: { path: '^packages/' },
      to: { path: '^apps/' },
    },
    {
      name: 'no-cross-database-access',
      comment:
        "Services must not directly access another service's database. " +
        'Use API, events, or messages instead.',
      severity: 'error',
      from: { path: '^apps/([^/]+)/' },
      to: { path: '^(?!.*\\1).*\\.(sql|prisma|migration)\b' },
    },
    {
      name: 'no-circular-dependencies',
      comment: 'Dependency cycles are forbidden across all workspace boundaries.',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
    {
      name: 'no-shared-dumping-ground',
      comment:
        'Do not create generic shared packages without concrete architectural responsibility.',
      severity: 'warn',
      from: { path: '^packages/(common|utils|shared|misc)/' },
      to: { path: '^packages/(common|utils|shared|misc)/' },
    },
  ],
  options: {
    doNotFollow: {
      path: ['node_modules', '.turbo', 'dist', 'build', 'coverage'],
    },
    tsPreCompilationDeps: true,
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
  },
};
