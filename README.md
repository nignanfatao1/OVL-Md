# Déploiement de OVL-MD

## Étapes pour déployer OVL-MD

### Étape 1 : Créer un fork du projet
- cliquez ici [OVL-MD-FORK](https://github.com/Nignanfatao/OVL-Md/fork).
- 
### Étape 2 : Obtenir une SESSION-ID
- Pour que le bot fonctionne correctement, vous aurez besoin d’une SESSION-ID.
- Suivez les étapes fournies dans le dossier `docs` du projet pour obtenir la SESSION-ID ou utilisez un générateur de SESSION-ID si fourni.
- **Remarque** : Conservez cette SESSION-ID en sécurité, car elle est nécessaire pour connecter le bot à votre compte.

### Étape 3 : Créer une base de données
- OVL-MD nécessite une base de données pour stocker les données du bot.
- Choisissez un fournisseur de base de données, par exemple, PostgreSQL, MySQL ou MongoDB.
- Créez une base de données et récupérez les informations de connexion (URL, utilisateur, mot de passe, etc.).
- **Conseil** : Assurez-vous que la base de données est accessible à partir de l’environnement où vous déploierez le bot.

### Étape 4 : Déployer OVL-MD

Vous pouvez déployer OVL-MD sur différentes plateformes. Voici les instructions pour quelques options populaires :

#### Option 1 : Déploiement sur Render
1. Connectez-vous sur [Render](https://render.com/).
2. Créez un nouveau service web et connectez-le à votre fork GitHub d'OVL-MD.
3. Configurez les variables d'environnement nécessaires (comme `SESSION-ID` et les informations de la base de données).
4. Lancez le déploiement et attendez que le service soit opérationnel.

#### Option 2 : Déploiement sur Koyeb
1. Connectez-vous sur [Koyeb](https://www.koyeb.com/).
2. Créez une nouvelle application et sélectionnez votre fork GitHub comme source.
3. Ajoutez les variables d'environnement pour le `SESSION-ID` et les détails de connexion de la base de données.
4. Lancez le déploiement et vérifiez que l’application est bien déployée.

#### Option 3 : Déploiement avec GitHub Actions (Workflow)
1. Dans votre fork GitHub, allez dans l'onglet **Actions**.
2. Activez les workflows GitHub Actions pour automatiser le déploiement.
3. Modifiez le fichier `.github/workflows/deploy.yml` pour ajouter vos variables d’environnement (par exemple, `SESSION-ID`, détails de la base de données).
4. Lancez le workflow pour démarrer le déploiement automatiquement.

---

### 📄 License

Ce projet est sous la licence MIT. Consultez le fichier LICENSE pour plus de détails.
