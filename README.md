# TimeTravel Agency

> Un site web marketing immersif haut de gamme en single-page pour une agence fictive de voyages temporels de luxe. Construit avec Next.js 16, React 19, Framer Motion et Tailwind CSS.

---

## Informations academiques

| Champ | Detail |
|---|---|
| **Contributeur** | YAKOUBI Ala Eddine |
| **Ecole** | YNOV Campus |
| **Specialite** | Master 1 Data Engineering |

---

## Table des matieres

- [Informations academiques](#informations-academiques)
- [Apercu general](#apercu-general)
- [Fonctionnalites](#fonctionnalites)
- [Stack technique](#stack-technique)
- [Architecture du projet](#architecture-du-projet)
- [Detail des composants](#detail-des-composants)
- [Routes API](#routes-api)
- [Systeme de design](#systeme-de-design)
- [Outils IA utilises](#outils-ia-utilises)
- [Variables d'environnement](#variables-denvironnement)
- [Demarrage rapide](#demarrage-rapide)
- [Deploiement](#deploiement)
- [Credits](#credits)
- [Licence](#licence)

---

## Apercu general

TimeTravel Agency est une maquette marketing haute fidelite et entierement animee pour une entreprise fictive de tourisme temporel de luxe. Le site presente trois destinations fictives -- **Paris 1889**, la **Periode du Cretace (il y a 65 millions d'annees)** et **Florence Renaissance 1504** -- a travers des fonds video cinematographiques, des effets de parallaxe, des cartes a inclinaison 3D et un chatbot concierge IA nomme **Chronos**.

Le projet met en oeuvre des techniques front-end avancees :

- Hero plein ecran avec videos et transitions en fondu croise
- Animations de parallaxe et de revelation au defilement
- Interface glassmorphisme avec un design bleu marine fonce et or
- Integration chatbot IA via l'API Mistral
- Modal de reservation avec calcul de prix en temps reel
- Soumission de formulaire par webhook (integration Make.com)
- Stockage media via Vercel Blob

---

## Fonctionnalites

### Section Hero
- Trois videos en boucle hebergees sur Vercel Blob Storage avec transitions automatiques en fondu croise (8s d'affichage, 1,5s de fondu)
- Deplacement en parallaxe pilote par le defilement sur la couche video
- Systeme de particules flottantes avec animations de derive aleatoires
- Elements d'anneau orbital decoratifs avec rotation CSS continue
- Badge anime, titre (avec texte en degrade or), sous-titre et double boutons CTA
- Indicateur de defilement avec animation de rebond

### En-tete de navigation
- En-tete fixe avec effet glassmorphisme au defilement
- Navigation par ancres avec defilement fluide (Accueil, Destinations, A propos)
- Menu hamburger responsive pour mobile avec animation de glissement
- Bouton CTA "Reserver" integre au systeme de reservation

### Section A propos de l'agence
- Compteurs animes (500+ Voyages, 100% Retours en securite, 4,5 milliards d'annees de portee) declenches a l'intersection du defilement
- Image plein largeur avec superpositions statistiques flottantes en glassmorphisme
- Trois points forts avec badges d'icones (Securite inegalee, Guides experts, Luxe pur)
- Animations de revelation au defilement decalees via Framer Motion

### Destinations en vedette
- Trois cartes de destination : Paris 1889, Periode du Cretace, Florence 1504
- Effet d'inclinaison 3D suivant la souris sur chaque carte avec `perspective()` et `rotateX/Y`
- Zoom de l'image au survol avec superpositions en degrade
- Etiquettes de caracteristiques (Culture, Architecture, Gastronomie, etc.)
- Boutons "En savoir plus" ouvrant le modal de reservation avec la destination pre-selectionnee
- Revelation au defilement avec delai decale par carte

### Widget chatbot IA (Chronos)
- Bulle de chat flottante en bas a droite avec point de notification non lu
- Fenetre de chat animee en ressort avec fond glassmorphisme
- Interface de conversation complete avec bulles de messages utilisateur/assistant, horodatages et indicateurs de statut de livraison
- Indicateur de saisie avec points rebondissants animes
- Suggestions rapides initiales et suggestions contextuelles analysees depuis les reponses de l'IA
- Persistance de l'historique de chat basee sur la session (sessionStorage)
- Gestion des erreurs avec bouton de reessai en ligne
- Info-bulle d'accroche apparaissant apres 10 secondes si le chat n'a pas ete ouvert
- Limite de caracteres (500) avec indicateur visuel
- Backend alimente par Mistral AI (modele `mistral-small-latest`) avec un prompt systeme elabore en francais

### Modal de reservation
- Superposition plein ecran avec fond floute
- Formulaire de reservation multi-champs : Nom complet, Email, Destination (select), Dates de depart/retour, Nombre de voyageurs (1-4), Demandes speciales
- Calculateur de prix dynamique en temps reel avec compteur anime (prix = tarif journalier x jours x passagers)
- Validation cote client avec messages d'erreur par champ
- Soumission du formulaire via webhook (endpoint Make.com)
- Etat de succes avec resume de confirmation et icone de validation animee
- Animations d'entree/sortie en ressort

### Pied de page
- Disposition en trois colonnes : A propos, Liens rapides, Contact et Newsletter
- Icones de reseaux sociaux avec animations de survol en ressort
- Formulaire d'inscription a la newsletter par email
- Mention legale faisant reference au fictif "Temporal Displacement Act de 2024"

---

## Stack technique

| Categorie | Technologie |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Bibliotheque UI** | React 19.2 |
| **Langage** | TypeScript 5.7 |
| **Styles** | Tailwind CSS 3.4 + tokens de design personnalises |
| **Animations** | Framer Motion 11 |
| **Composants UI** | shadcn/ui (primitives Radix UI) |
| **Icones** | Lucide React |
| **Polices** | Playfair Display (serif pour les titres) + Inter (sans-serif pour le corps) via `next/font/google` |
| **Backend IA** | API Mistral AI (`mistral-small-latest`) |
| **Stockage media** | Vercel Blob Storage |
| **Webhook formulaire** | Make.com (Integromat) |
| **Gestionnaire de paquets** | pnpm |

---

## Architecture du projet

```
.
├── app/
│   ├── api/
│   │   ├── chat/route.ts              # Endpoint API du chatbot Mistral AI
│   │   └── upload-images/route.ts     # Utilitaire d'upload Vercel Blob
│   ├── globals.css                     # Tokens de design, utilitaires, animations
│   ├── layout.tsx                      # Layout racine avec polices et metadonnees
│   └── page.tsx                        # Composition de la page d'accueil
├── components/
│   ├── agency-section.tsx              # Section A propos avec compteurs et fonctionnalites
│   ├── booking-context.tsx             # Contexte React pour l'etat du modal de reservation
│   ├── booking-modal.tsx               # Formulaire de reservation avec calculateur de prix
│   ├── chatbot-widget.tsx              # Interface du chatbot IA (Chronos)
│   ├── destinations-section.tsx        # Cartes de destinations avec inclinaison 3D
│   ├── footer.tsx                      # Pied de page avec newsletter et liens
│   ├── header.tsx                      # Navigation fixe avec glassmorphisme
│   ├── hero.tsx                        # Hero video avec parallaxe et particules
│   ├── particles.tsx                   # Systeme de particules flottantes
│   ├── theme-provider.tsx              # Wrapper du fournisseur next-themes
│   └── ui/                             # Bibliotheque de composants shadcn/ui
├── hooks/
│   ├── use-mobile.tsx                  # Detection du point de rupture mobile
│   ├── use-scroll-reveal.ts           # Animations au defilement via IntersectionObserver
│   └── use-toast.ts                   # Hook de notification toast
├── lib/
│   └── utils.ts                        # Utilitaire cn() pour fusionner les classes
├── scripts/
│   ├── trigger-upload.js              # Script de declenchement d'upload
│   └── upload-images.js               # Upload groupes d'images vers Vercel Blob
├── styles/
│   └── globals.css                     # Styles globaux supplementaires
├── next.config.mjs                     # Configuration Next.js (images distantes, TS)
├── tailwind.config.ts                  # Extensions du theme Tailwind
└── package.json
```

---

## Detail des composants

### `Hero` (`components/hero.tsx`)
Gere un carrousel video avec trois fichiers MP4 heberges sur Vercel Blob. Utilise `useScroll` et `useTransform` de Framer Motion pour la parallaxe. La logique de fondu croise repose sur une machine a etats basee sur un minuteur cyclant entre `activeIndex` et `nextIndex` avec des transitions d'opacite.

### `AgencySection` (`components/agency-section.tsx`)
Affiche des compteurs animes via un composant `AnimatedCounter` qui interpole les valeurs avec un easing cubique sur 2 secondes. Trois cartes de fonctionnalites avec les icones `ShieldCheck`, `Award` et `Gem` s'animent avec des delais decales.

### `DestinationsSection` (`components/destinations-section.tsx`)
Encapsule chaque carte de destination dans un composant `TiltCard` qui suit la position de la souris et applique des transformations `perspective(1000px) rotateX/Y` en temps reel. Utilise un hook personnalise `useScrollReveal` pour le basculement de visibilite base sur l'intersection.

### `ChatbotWidget` (`components/chatbot-widget.tsx`)
Interface de chat autonome communiquant avec `/api/chat`. Analyse les balises `[SUGGESTIONS]...[/SUGGESTIONS]` dans la reponse de l'IA pour extraire des boutons de reponse rapide contextuels. Persiste l'historique de conversation dans le `sessionStorage` et affiche une info-bulle d'accroche apres 10 secondes d'inactivite.

### `BookingModal` (`components/booking-modal.tsx`)
Formulaire multi-etapes encapsule dans `AnimatePresence` pour les animations d'entree/sortie. Calcule dynamiquement le prix : `totalPrice = pricePerDay * days * passengers`. Utilise un composant `AnimatedPrice` avec `requestAnimationFrame` pour des transitions de compteur fluides. Envoie les donnees a un endpoint webhook Make.com.

### `BookingContext` (`components/booking-context.tsx`)
Fournisseur de contexte React gerant l'etat d'ouverture/fermeture du modal de reservation et la destination pre-selectionnee. Expose via le hook `useBooking()`, consomme par les composants Header, Destinations et BookingModal.

---

## Routes API

### `POST /api/chat`
- **Objectif** : Relaye les messages utilisateur vers l'API Mistral AI
- **Modele** : `mistral-small-latest`
- **Prompt systeme** : Un prompt elabore en francais pour le personnage de "Chronos", concierge temporel de luxe. Inclut des connaissances detaillees sur trois destinations, la tarification, des anecdotes historiques et des regles comportementales strictes (refuse les questions hors sujet, maintient un vocabulaire immersif)
- **Reponse** : Retourne `{ content: string }` avec la reponse de l'IA (peut contenir des balises `[SUGGESTIONS]`)
- **Gestion des erreurs** : Retourne des messages d'erreur thematiques ("perturbation temporelle") au lieu d'erreurs generiques

### `GET /api/upload-images`
- **Objectif** : Endpoint utilitaire pour uploader en lot les images locales depuis `public/images/` vers Vercel Blob Storage
- **Dependances** : `@vercel/blob`

---

## Systeme de design

### Palette de couleurs
| Token | Valeur HSL | Utilisation |
|---|---|---|
| `--background` | `228 40% 7%` | Fond de page bleu marine profond |
| `--foreground` | `45 29% 97%` | Texte creme clair |
| `--primary` | `43 56% 52%` | Accent or (boutons, surlignages, icones) |
| `--primary-foreground` | `228 40% 7%` | Texte sombre sur fonds dores |
| `--secondary` | `228 25% 15%` | Couleur de surface elevee |
| `--muted-foreground` | `228 10% 55%` | Texte attenue |
| `--border` | `228 20% 18%` | Lignes de bordure subtiles |

### Typographie
- **Titres** : Playfair Display (serif), gras, espacement serre
- **Corps** : Inter (sans-serif), interligne aere
- **Texte en degrade or** : Classe personnalisee `.text-gradient-gold` avec animation de decalage `background-size`

### Utilitaires personnalises
- `.glass` / `.glass-strong` -- Glassmorphisme avec flou d'arriere-plan
- `.glow-gold` / `.glow-gold-hover` -- Effets de lueur doree en box-shadow
- `.section-gradient-1` / `.section-gradient-2` -- Degrades d'arriere-plan verticaux subtils
- `.chat-scrollbar` -- Barre de defilement fine teintee or pour le widget de chat

### Accessibilite
- La media query `prefers-reduced-motion` est respectee globalement
- Le hook `useReducedMotion()` de Framer Motion est utilise dans tous les composants animes
- Labels ARIA sur le widget de chat (`role="dialog"`, `role="log"`, `aria-live="polite"`)
- Structure HTML semantique avec `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`

---

## Outils IA utilises

> Dans un souci de transparence academique, voici la liste complete des outils d'intelligence artificielle utilises dans la conception et le developpement de ce projet.

| Outil IA | Utilisation dans le projet |
|---|---|
| **v0 by Vercel** | Generation et iteration du code front-end (composants React, layout, styles Tailwind, structure du projet). Outil principal de prototypage et de developpement assiste par IA. |
| **Mistral AI** (`mistral-small-latest`) | Modele de langage integre dans le chatbot "Chronos" pour la generation de reponses conversationnelles en francais. Utilise via l'API Mistral dans la route `/api/chat`. |
| **Make.com (Integromat)** | Automatisation du traitement des formulaires de reservation via webhook. Bien que ce ne soit pas un outil d'IA a proprement parler, il fait partie de l'ecosysteme d'automatisation intelligente du projet. |

### Niveau d'assistance IA
- **Conception UI/UX** : Assistee par v0 (generation de composants, suggestions de design)
- **Logique metier** : Ecrite manuellement avec assistance IA pour le scaffolding initial
- **Prompt engineering** : Le prompt systeme du chatbot Chronos a ete redige et affine manuellement pour garantir un personnage coherent et des reponses pertinentes
- **Contenu redactionnel** : Les textes du site (descriptions de destinations, accroches marketing) ont ete elabores avec assistance IA puis revises manuellement

---

## Variables d'environnement

| Variable | Requise | Description |
|---|---|---|
| `MISTRAL_API_KEY` | Oui | Cle API pour Mistral AI (alimente le chatbot Chronos) |
| `BLOB_READ_WRITE_TOKEN` | Non | Token Vercel Blob (necessaire uniquement pour l'utilitaire d'upload d'images) |

---

## Demarrage rapide

### Prerequis
- Node.js 18+
- pnpm

### Installation

```bash
# Cloner le depot
git clone <url-du-depot>
cd timetravel-agency

# Installer les dependances
pnpm install

# Configurer les variables d'environnement
cp .env.example .env.local
# Ajoutez votre MISTRAL_API_KEY dans .env.local

# Demarrer le serveur de developpement (Turbopack)
pnpm dev
```

L'application sera disponible a l'adresse `http://localhost:3000`.

### Build de production

```bash
pnpm build
pnpm start
```

---

## Deploiement

Ce projet est optimise pour le deploiement sur **Vercel** :

1. Poussez le depot sur GitHub
2. Importez le projet sur [vercel.com](https://vercel.com)
3. Ajoutez la variable d'environnement `MISTRAL_API_KEY` dans le tableau de bord Vercel
4. Deployez -- Vercel Blob Storage est automatiquement disponible pour les ressources media

Le site utilise Vercel Blob Storage pour tous les medias (videos du hero, images des destinations, photo de l'agence), donc aucun repertoire local `public/images/` n'est necessaire en production.

---

## Credits

### APIs et services
| Service | Utilisation |
|---|---|
| **Mistral AI** | API de generation de texte pour le chatbot Chronos (`mistral-small-latest`) |
| **Vercel Blob Storage** | Hebergement des medias (videos MP4 du hero, images des destinations, photo de l'agence) |
| **Vercel** | Plateforme de deploiement et d'hebergement |
| **Make.com** | Automatisation du traitement des reservations via webhook |

### Bibliotheques et frameworks
| Bibliotheque | Role |
|---|---|
| **Next.js 16** | Framework React avec App Router et Turbopack |
| **Framer Motion 11** | Animations, transitions, parallaxe et gestion des gestes |
| **shadcn/ui** | Composants UI accessibles bases sur Radix UI |
| **Tailwind CSS 3.4** | Systeme de styles utilitaires |
| **Lucide React** | Bibliotheque d'icones SVG |

### Polices
- **Playfair Display** -- Police serif via Google Fonts (titres et accents)
- **Inter** -- Police sans-serif via Google Fonts (corps de texte)

### Assets visuels
- Les images des destinations et de l'agence sont des visuels generes par IA et heberges sur Vercel Blob Storage
- Les videos du hero sont des clips cinematographiques utilises a des fins de demonstration

### Remerciements
- **YNOV Campus** -- Cadre academique du projet
- **Vercel** -- Plateforme de developpement et outils (v0, Blob Storage, deploiement)
- **Mistral AI** -- Acces au modele de langage pour le chatbot integre

---

## Licence

Ce projet est une maquette fictive creee a des fins de demonstration. Toutes les references historiques sont utilisees de maniere creative. TimeTravel Agency n'est pas une entreprise reelle. Le voyage dans le temps n'est pas encore disponible (a notre connaissance).
