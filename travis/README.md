### Travis 
Travis tasks creates a configuration file `(.travis.yml)` in the root of your project. The tasks depends on the config file `config.json` and requires following key/value pairs.

```json
{
  "services": ["travis"],
  "minNodeVersion": "10.0"
}
```

To remove support for `travis` from your project, just `npm run mrm travis` task by removing the `travis` keyword from the `services` array.

```json
{
  "services": []
}
```

```sh
npm run mrm travis
```