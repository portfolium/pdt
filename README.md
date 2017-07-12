# Portfolium Deploy Tool

This CLI tool can be used to assist in managing branch deployments on development and QA servers. It is useful when trying to manage multiple apps on a single server, especially with several developers creating feature branches that need to be deployed.

## Installation

```
npm install -g @portfolium/pdt
```

## Configuration

`pdt` looks for the json file in `$HOME/.pdt/pdt.json`. It expects 2 properties in the json file:

* projectDir  {String}
* apps        {Array[Object]}

This is an example:

```
{
  "projectDir": "/home/mywebapp/deploy",
  "apps": [
    {
      "name": "web",
      "script": "deploy-web.sh"
    },
    {
      "name": "api",
      "script": "deploy-api.sh"
    }
  ]
}
```
The `apps` section defines the app that `pdt` will operate on. The `name` should be a directory under the directory defined in `projectDir `. The `script` is the script that will be called with the `deploy` command.


## Usage

The main command is `pdt`. It is modeled after the `git` command. The following subcommands are available.

### `deploy|d <app> [branch]`

```
param  app    (required)   - the app name to deploy (i.e. web)
param  branch (optional)   - the branch to checkout and deploy; if branch is empty,
                             a branch selector is shown
```

Checkout the `branch` for `app` and run the deploy script

### `checkout|c <app> [branch]`

```
param  app    (required)   - the app name to run the checkout (i.e. web)
param  branch (optional)   - the branch to checkout; if branch is empty,
                             a branch selector is shown
```

Checkout the `branch` for `app`

### `reset|r [app]`

```
param  app    (optional)   - the app name to reset (i.e. web or all);
                             if app is empty, it is set to 'all'
```

Reset the `app` (or all apps) to master branch at the latest revision and run the deploy script

### `status|s [app] [-l|--long]`

```
param  app            (optional)   - the app name to show status for (i.e. web or all);
                                     if app is empty, it is set to 'all'
option [-l|--long]    (optional)   - show longer status message
```

Show the current branch for the `app` (or all apps) or full git status message if --list is used



