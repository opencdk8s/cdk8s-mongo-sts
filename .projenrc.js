const { ConstructLibraryCdk8s } = require('projen');

const project = new ConstructLibraryCdk8s({
  author: 'Hunter Thompson',
  authorAddress: 'aatman@auroville.org.in',
  cdk8sVersion: '1.0.0-beta.8',
  defaultReleaseBranch: 'development',
  stability: 'experimental',
  jsiiFqn: 'projen.ConstructLibraryCdk8s',
  name: 'cdk8s-mongo-sts',
  repositoryUrl: 'https://github.com/Hunter-Thompson/cdk8s-mongo-sts',

  python: {
    distName: 'cdk8s-mongo-sts',
    module: 'cdk8s_mongo_sts',
  },
  peerDeps: ['constructs@3.3.5'],

  devDeps: [
    'constructs@3.3.5',
    'prettier@^2.2.1',
    'jsii-pacmak@^1.20.1',
    '@commitlint/config-conventional@^11.0.0',
    '@commitlint/cli@^11.0.0',
    'eslint-import-resolver-node@^0.3.4',
    'eslint-import-resolver-typescript@^2.3.0',
    'eslint-plugin-import@^2.22.1',
    'eslint@^7.19.0',
    'jsii-diff@^1.20.1',
    'jsii-docgen@^1.8.36',
    'jsii@^1.20.1',
    'json-schema@^0.3.0',
  ],

  dependabot: false,
  gitignore: ['package.json', 'test/'],
  pullRequestTemplate: false,
  releaseBranches: ['development'],
  codeCov: true,
  releaseEveryCommit: false,

  clobber: false,
  readme: true,
});

project.synth();
