# Boite de Dev UI

Mini framework CSS avec des controllers [Stimulus](https://stimulus.hotwired.dev/),
sans build : un fichier CSS, quelques fichiers JS et une doc. Le CSS fonctionne seul ;
les controllers ont besoin de Stimulus, que le projet doit fournir.

Il s'utilise dans n'importe quel projet : Go, PHP, Python, HTML simple…

Documentation : https://boitededev.github.io/boitededev-ui/docs.html

## Sommaire

- [Installation](#installation)
- [Exemples par langage](#exemples-par-langage)
- [Composants](#composants)
- [Personnaliser le thème](#personnaliser-le-thème)
- [Versions](#versions)
- [Contribuer](#contribuer)

## Installation

Les fichiers sont servis par le CDN [jsDelivr](https://www.jsdelivr.com/), directement
depuis ce dépôt. **Toujours indiquer une version précise** (`@v1.1.0`) : le site ne
changera pas tout seul le jour où une nouvelle version sort.

### CSS seul

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/boitededev/boitededev-ui@v1.1.0/css/style.css">
```

### Avec les controllers JS

Le kit n'embarque pas Stimulus, c'est le projet qui le fournit. Comme ça, il n'y a
jamais deux versions de Stimulus chargées en même temps.

```html
<script type="importmap">
{
  "imports": {
    "@hotwired/stimulus": "https://cdn.jsdelivr.net/npm/@hotwired/stimulus@3.2.1/dist/stimulus.js",
    "boitededev-ui": "https://cdn.jsdelivr.net/gh/boitededev/boitededev-ui@v1.1.0/js/index.js"
  }
}
</script>
<script type="module" src="/js/app.js"></script>
```

Puis dans `app.js` (le fichier JS du projet) :

```js
import { Application } from "@hotwired/stimulus"
import { registerControllers } from "boitededev-ui"

const app = Application.start()

// Les controllers du kit : modal, nav…
registerControllers(app)

// Les controllers propres au projet, comme d'habitude
// app.register("prospect", ProspectController)
```

Pour n'importer qu'un seul controller, ou lui donner un autre nom :

```js
import { ModalController } from "boitededev-ui"
app.register("popup", ModalController)
```

## Exemples par langage

Le HTML est le même partout, seule la façon d'écrire la version change.
L'idée est de mettre le numéro de version à un seul endroit du projet.

### Go (templ)

```go
const uiVersion = "v1.1.0"
```

```templ
<link rel="stylesheet" href={ "https://cdn.jsdelivr.net/gh/boitededev/boitededev-ui@" + uiVersion + "/css/style.css" }/>
```

### PHP

```php
<?php $uiVersion = 'v1.1.0'; ?>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/boitededev/boitededev-ui@<?= $uiVersion ?>/css/style.css">
```

### Python (Jinja2 : Flask, FastAPI…)

```python
# Côté Python : rendre la version disponible dans tous les templates
app.jinja_env.globals["ui_version"] = "v1.1.0"   # Flask
```

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/boitededev/boitededev-ui@{{ ui_version }}/css/style.css">
```

Pour l'importmap, même principe : remplacer `v1.1.0` par la variable.

## Composants

Tous les exemples sont dans la [documentation](https://boitededev.github.io/boitededev-ui/docs.html).

| Composant      | Classes principales                                   | Controller JS |
|----------------|-------------------------------------------------------|---------------|
| Boutons        | `.btn`, `.btn-ink`, `.btn-primary`, `.btn-ghost`, `.btn-danger`, `.btn-icon` | — |
| Navbar         | `.navbar`, `.navbar-links`                            | `nav` (lien actif) |
| Card           | `.card`, `.card-sectioned`, `.card-header/body/footer` | — |
| Badge / Chip / Tag | `.badge`, `.chips`, `.tag`                        | — |
| Formulaires    | `.field`, `.input`, `.hint`, `.hint-error`            | — |
| Table          | `.table-wrap`, `.table`                               | — |
| Alertes        | `.alert`, `.alert-success` …                          | — |
| Stat (KPI)     | `.stat`, `.stat-label`, `.stat-value`                 | — |
| Accordéon      | `.accordion` + `<details>` natif                      | — |
| Icônes         | `.icon`, `.icon-{nom}`, `.icon-box`                   | — |
| Modal          | `.modal`, `.modal-header/body/footer`, `.modal-sm/lg` | `modal` |
| Progress       | `.progress`, `.progress-field`, `.progress-label`, `.progress-sm/lg`, `.progress-success/warning/danger` | — |

## Personnaliser le thème

Toutes les valeurs (couleurs, espacements, rayons…) sont des variables CSS sur `:root`.
Pour changer le thème d'un projet, on les redéfinit après avoir chargé le kit :

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/boitededev/boitededev-ui@v1.1.0/css/style.css">
<style>
  :root {
    --sky: #16a34a;
    --radius: 8px;
  }
</style>
```

On peut aussi le faire sur un seul bloc : `<div style="--sky: #16a34a">…</div>`.

## Versions

Les versions suivent la règle [semver](https://semver.org/lang/fr/) : `MAJEURE.MINEURE.CORRECTIF`.

| Changement                                         | Exemple            | Les projets doivent… |
|----------------------------------------------------|--------------------|----------------------|
| Correctif : bug corrigé, rien ne change à l'usage | `1.0.0` → `1.0.1` | rien, mettre à jour sans risque |
| Mineure : nouveau composant, token, icône       | `1.0.1` → `1.1.0` | rien, mettre à jour sans risque |
| Majeure : classe ou token renommé / supprimé    | `1.1.0` → `2.0.0` | lire le CHANGELOG et adapter leur code |

Le détail de chaque version est dans le [CHANGELOG](CHANGELOG.md).

### Publier une nouvelle version

1. Mettre à jour `CHANGELOG.md` et le numéro en tête de `css/style.css`.
2. Mettre à jour les numéros de version dans `README.md` et `docs.html`.
3. Commit, puis tag :
   ```bash
   git tag v1.1.0
   git push && git push --tags
   ```

Un tag publié ne doit **jamais** être modifié ou supprimé : des projets l'utilisent peut-être déjà.

## Contribuer

### Voir la doc en local

Les modules JS ne marchent pas en ouvrant `docs.html` directement (adresse `file://`).
Lancer un petit serveur à la racine du dépôt :

```bash
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000/docs.html

### Règles

- Toutes les valeurs passent par les tokens (`--sp-*`, `--radius*`, couleurs…), jamais de valeur en dur.
- La doc reste à jour : tout nouveau composant, utilitaire ou token est documenté dans `docs.html`, avec
  - une `<section class="doc-section" id="…">` contenant des exemples `.doc-example > .doc-demo`
    (le code affiché sous la démo est généré automatiquement depuis son HTML) ;
  - un lien dans le sommaire `.doc-toc` ;
  - une ligne dans le sommaire en tête de `css/style.css` si c'est une nouvelle section.
- Les classes propres à la doc sont préfixées `.doc-` et restent dans le `<style>` de `docs.html`.
- Les commentaires du CSS sont en anglais, les textes de la doc en français.
- Une icône s'écrit `<span class="icon icon-nom" aria-hidden="true"></span>`. C'est un SVG au trait 24×24
  (stroke 2, bouts arrondis) appliqué en `mask`, dont la couleur vient de `currentColor`. Chaque nouvelle
  icône est aussi ajoutée à la liste `data-icons` de `docs.html` et à la liste en commentaire du CSS.
- Chaque controller JS a son propre fichier dans `js/controllers/`. Il est enregistré dans
  `registerControllers()` de `js/index.js` et ajouté au tableau [Composants](#composants).
- Stimulus n'est jamais embarqué dans le kit.
