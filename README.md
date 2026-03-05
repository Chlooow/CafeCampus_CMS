# ☕ CaféCampus

**"Pause café sans stress avec CaféCampus à Paris-Saclay"**

## Présentation du projet

CaféCampus est une solution innovante conçue pour répondre à la problématique de la disponibilité des machines à café sur le campus de l'Université Paris-Saclay. L'application vise à améliorer l'expérience des étudiants et du personnel en fournissant des informations en temps réel sur l’état des machines à café, notamment leur disponibilité et les éventuelles pannes.

## Objectifs

- Optimiser la gestion des pauses café pour les étudiants et le personnel.
- Réduire les temps d’attente devant les machines en panne ou surchargées.
- Fournir des données en temps réel sur l’état des machines.

## Fonctionnalités de l'application

1. **Localisation des machines à café** sur le campus.
2. **Statut en temps réel** des machines (disponible, en panne, en cours de maintenance).
3. **Notifications** sur les pannes ou réparations en cours.
4. **Feedback des utilisateurs** pour signaler des problèmes non détectés automatiquement.

## Comment construire l'application

**Technologies utilisées :**
- Frontend : React Native avec Expo (JavaScript)
- Backend : Firebase (Firestore pour la base de données en temps réel)
- Base de données : Cloud Firestore (NoSQL) pour le stockage des informations sur les machines et la gestion des statuts en temps réel.

**Architecture :**
- Application mobile multiplateforme (Android / iOS) développée avec Expo.
- Synchronisation en temps réel via Firestore pour afficher instantanément les changements de statut des machines.
- Système de verrouillage pour éviter les conflits lors des modifications simultanées.
- Interface optimisée pour une utilisation simple et rapide sur smartphone.

## Utilisateurs et Revenus

- **Cible principale :** Étudiants et personnel de l’université Paris-Saclay.  
- **Modèle économique :** Gratuit pour les utilisateurs finaux, avec possibilité de partenariats avec des fournisseurs de machines à café.

## Modèle économique complémentaire

- Partenariats avec des distributeurs automatiques pour l’entretien des machines.  
- Publicités ciblées pour des produits liés aux pauses café.

## Proposition de valeur

> **"Gagnez du temps et savourez votre café sans stress grâce à CaféCampus."**

## Retours des utilisateurs

- Interface intuitive et facile à utiliser.  
- Amélioration significative de la gestion des pauses.  
- Réduction des frustrations liées aux pannes imprévues.

## Extrait de code Java (exemple simplifié)

```java
public class CoffeeMachine {
    private String id;
    private boolean isAvailable;

    public CoffeeMachine(String id, boolean isAvailable) {
        this.id = id;
        this.isAvailable = isAvailable;
    }

    public String getStatus() {
        return isAvailable ? "Disponible" : "En panne";
    }

    public void setAvailability(boolean status) {
        this.isAvailable = status;
    }
}
```

## Démo Video


https://github.com/user-attachments/assets/bd640b2f-0076-4140-b7a6-47b13c3739d2



## Sources
Données collectées auprès des utilisateurs du campus.
Documentation technique des machines à café utilisées sur le campus.
Études sur l’optimisation des services de distribution automatique.

## Équipe du projet
- Cheïma HAMROUNI
- Uriel LOUIS
- Maïmouna TALL
- Chloé MAKOUNDOU
- Projet réalisé dans le cadre du Projet CMS (L3 Informatique) – Université Paris-Saclay
© Copyright 2024
