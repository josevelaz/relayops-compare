# RelayOps comparison

Independent implementations of **RelayOps**, an incident management and operational intelligence SaaS product.

Each app was built from the same brief: [PROMPT.md](PROMPT.md).

Live comparison: [josevelaz.github.io/relayops-compare](https://josevelaz.github.io/relayops-compare/)

## Implementations

| App | Directory | Local port |
| --- | --- | --- |
| Astra | [relayops-astra](relayops-astra) | 3001 |
| Spark | [relayops-spark](relayops-spark) | 3002 |
| Verdant | [relayops-verdant](relayops-verdant) | 3000 |

The apps do not share source, components, or config.

## Run locally

```sh
npm run hub
```

Open http://127.0.0.1:4173. The hub loads Astra or Spark at random. Click the blurred label to reveal which design is showing.

Run one app:

```sh
npm run dev:astra
npm run dev:spark
npm run dev:verdant
```

## GitHub Pages

Push to `main` to build Astra and Spark into a static comparison site.

```sh
npm run pages:build
```
