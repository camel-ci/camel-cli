# Camel CI/CD CLI

CLI tool providing a simple and complete CI/CD environment using GitLab and Artifactory.

_Built for a Computer Engineering school project. Not to use in production._

## Development

### Prerequisites

#### Node.js and npm

You'll need to have Node.js 9.0.0 or later and npm on your machine. You can download Node.js [here](https://nodejs.org/en/download/) (npm comes with it).

#### GitLab Runner

You'll also need to have a GitLab Runner available on your machine. You can download a GitLab Runner binary [here](https://docs.gitlab.com/runner/install/index.html).

For the purpose of this tool, you only need to add it to your PATH with the name `gitlab-runner.exe`, no need to register it or install it as a service.

### Installation

#### `Step 1` - Clone the repository

```bash
git clone git@github.com:camel-ci/camel-cli.git
```

#### `Step 2` - Move inside the repository

```bash
cd camel-cli
```

#### `Step 3` - Install dependencies

```bash
npm install
```

#### `Step 4` - Link the CLI locally

```bash
npm link
```

### Usage

Once you followed the previous installation steps, you can run any CLI command from your favorite terminal.
To get an overview of the available commands, just run the CLI as is or with the `--help` option:

```bash
camel --help
```

## License

MIT License - see the [LICENSE](LICENSE) file for details.
