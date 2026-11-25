# Changelog

Toutes les évolutions du kit, de la plus récente à la plus ancienne.
Numérotation : voir la section « Versions » du [README](README.md#versions).

## [1.4.0] — 2026-11-25

### Ajouté
- Utilitaire `.text-pre-line` : garde les retours à la ligne d'un texte saisi
  (notes, commentaires).

## [1.3.0] — 2026-11-25

Passe de finition visuelle. Aucune classe n'est renommée ni supprimée, mais le rendu
change : vérifier les écrans après la mise à jour.

### Ajouté
- Tokens `--radius-control` (10px, boutons), `--line-hover`, `--row-hover` et
  `--on-dark-muted`, qui remplacent des couleurs écrites en dur.

### Modifié
- Titres plus légers : h1 et h2 en 600, h3 et h4 en 500 (avant 800 et 700). `.stat-value`
  passe en 600. Les polices à charger deviennent Bricolage Grotesque 500 et 600, Figtree
  400, 500 et 600.
- Graisse de l'interface ramenée à 500 ou 600 : boutons, badges, liens de navbar, onglets,
  menu, labels de formulaire, alertes, accordéon, pagination. `.text-bold` passe en 600.
- `.eyebrow` et en-têtes de `.table` en casse normale, sans espacement de lettres.
- Boutons : coins de 10px au lieu de la pilule (8px pour `.btn-sm`). Plus de lévitation ni
  de halo bleu au survol ; `.btn-ink` fonce légèrement, léger enfoncement au clic. Hauteurs
  alignées sur les tokens : 32, 40 et 48px.
- `--control` passe de 42 à 40px, `--control-lg` de 50 à 48px, `--radius-lg` de 22 à 16px
  (cards, tables, modals).
- Champs de formulaire : bordure de 1px, hauteur 40px comme les boutons.
- `.page-link` : coins de 8px au lieu de la pilule.
- `.hl` : surlignage d'une seule teinte au lieu d'un dégradé.
- Espacements internes ramenés sur la grille de 4px (badges, chips, tags, alertes,
  accordéon, lien d'évitement).
- `.reveal` : apparition plus courte (12px, 0,45 s).

### Corrigé
- `.text-white` donnait du bleu clair (`--sky-soft`) au lieu du blanc.

## [1.2.0] — 2026-11-23

### Ajouté
- Composant Toast : messages temporaires (`.toasts`, `.toast`, `.toast-body`,
  `.toast-success/warning/danger`) et controller `toast`. Fermeture après 5 s
  (`data-toast-delay-value`, `0` pour garder le toast), pause au survol et au focus,
  retrait avant la mise en cache Turbo. Nouveau token `--toast-w`.
- Composant Menu déroulant : `.menu` avec l'attribut natif `popover`, `.menu-item`,
  `.menu-item-danger`, `.menu-sep`, et controller `dropdown`. Le menu se place sous le
  bouton (au-dessus s'il manque de place), se navigue aux flèches et fonctionne dans un
  `.table-wrap`. Nouveau token `--menu-w`.
- Composant Onglets : `.tabs`, `.tab`, `.tab-panel` et controller `tabs` (motif ARIA
  « tabs », flèches du clavier, onglet ouvert d'après l'ancre de l'URL, événement
  `tabs:change`). `.tabs` sert aussi d'onglets-liens avec le controller `nav`.
- Composant État vide, sans JS : `.empty` (icône, titre, texte, action) et `.empty-compact`
  pour une card ou une table.
- Composant Pagination, sans JS : `.pagination`, `.page-link` (page courante avec
  `aria-current="page"`, flèche désactivée avec `aria-disabled="true"`), `.page-gap` et
  `.pagination-bar` pour ajouter le nombre de résultats.
- Controller `scrollspy` : dans un sommaire d'ancres, marque la section en cours de
  lecture avec `aria-current="location"`. Ligne de lecture réglable avec
  `data-scrollspy-offset-value`.
- Navbar : `.navbar a[aria-current="location"]` a le même style que le lien actif.
- Controller `nav` : option `data-nav-match="prefix"` pour qu'un lien reste actif sur
  ses sous-pages (`/prospects` actif sur `/prospects/12`).
- Controller `nav` : sur mobile, le lien actif est centré dans la barre qui défile.

### Modifié
- Controller `nav` : le lien actif est recalculé à chaque navigation Turbo et au retour
  arrière, y compris avec une navbar en `data-turbo-permanent`. Le target `links`
  devient optionnel.

### Corrigé
- Controller `nav` : les liens placés dans un autre élément (`<li>`, `<div>`) sont
  maintenant pris en compte, et `/factures/` correspond à `/factures`.
- Controller `nav` : `aria-current` est retiré des liens qui ne correspondent plus.

## [1.1.0] — 2026-11-23

### Ajouté
- Composant Progress : `<progress class="progress">` natif, sans JS. Couleurs
  (`.progress-success/warning/danger`), tailles (`.progress-sm/lg`), état
  indéterminé animé, libellé + valeur (`.progress-field`, `.progress-label`).

## [1.0.0] — 2026-11-23

Première version, extraite du dashboard Boite de Dev.

### Ajouté
- Tokens : couleurs, typographie, espacements, rayons, ombres, tailles de contrôles, modal.
- Composants : boutons, navbar, card, badge / chip / tag, formulaires, table, alertes,
  stat (KPI), accordéon, icônes, modal.
- Utilitaires : marges, paddings, gaps, flex, texte, fonds, bordures, affichage.
- Accessibilité : focus clavier, `.sr-only`, lien d'évitement.
- Controllers Stimulus : `modal`, `nav`, et la fonction `registerControllers()`.
- Documentation vivante : `docs.html`.
