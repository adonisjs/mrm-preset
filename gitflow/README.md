### Gitflow
Adds git flow based release commands to npm scripts. 

#### release:start
Starts the **git flow** release by running `git flow release start $1` under the hood.

```
npm run release:start 1.0.0
```

#### release:end
Ends the **git flow** release by running multiple commands to create and merge release branches with git tags. Commands executed under the hood will use `--no-verify` flag to ignore git hooks, which can conflict with release commit messages style.

```
npm run release:end 1.0.0
```

Before running the above command, do make sure to update the **npm version**, **generate the changelog** and **commit these changes**.
