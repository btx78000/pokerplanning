# Guide de Déploiement - Planning Poker

Déploiement gratuit sur **Render.com** avec connexion automatique à GitHub.

## 🚀 Déploiement Rapide (5 minutes)

### 1. Préparer votre dépôt GitHub

```bash
# Créer un nouveau dépôt sur GitHub (via l'interface web)
# Puis dans votre terminal :

git init
git add .
git commit -m "Initial commit - Planning Poker app"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/poker-planning.git
git push -u origin main
```

### 2. Déployer sur Render

#### Option A : Déploiement automatique avec render.yaml

1. Créez un compte sur [Render.com](https://render.com) (gratuit)
2. Connectez votre compte GitHub
3. Cliquez sur **"New" → "Blueprint"**
4. Sélectionnez votre dépôt `poker-planning`
5. Render détectera automatiquement le fichier `render.yaml` ✅
6. Cliquez sur **"Apply"**

#### Option B : Déploiement manuel

**Backend :**
1. New → Web Service
2. Connectez votre dépôt GitHub
3. Configuration :
   - **Name**: `poker-planning-backend`
   - **Region**: Frankfurt (ou le plus proche)
   - **Branch**: main
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

**Frontend :**
1. New → Static Site
2. Connectez le même dépôt
3. Configuration :
   - **Name**: `poker-planning-frontend`
   - **Region**: Frankfurt
   - **Branch**: main
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free

### 3. Configurer les Variables d'Environnement

**Backend (poker-planning-backend) :**
1. Allez dans le dashboard du backend
2. Environment → Add Environment Variable
3. Ajoutez :
   ```
   CLIENT_URL = https://poker-planning-frontend.onrender.com
   ```
   (Remplacez par l'URL réelle de votre frontend)

**Frontend (poker-planning-frontend) :**
1. Allez dans le dashboard du frontend
2. Environment → Add Environment Variable
3. Ajoutez :
   ```
   VITE_API_URL = https://poker-planning-backend.onrender.com
   ```
   (Remplacez par l'URL réelle de votre backend)

### 4. Redéployer

Après avoir configuré les variables d'environnement :
1. Backend : Manual Deploy → Deploy latest commit
2. Frontend : Manual Deploy → Clear build cache & deploy

### 5. Tester votre application

Votre app est maintenant en ligne ! 🎉

- Frontend : `https://poker-planning-frontend.onrender.com`
- Backend : `https://poker-planning-backend.onrender.com`

## 🔄 Déploiement Continu

Chaque `git push` vers la branche `main` déclenchera automatiquement :
- ✅ Rebuild du backend
- ✅ Rebuild du frontend
- ✅ Redéploiement automatique

## ⚙️ Configuration Locale

Pour tester en local avec les variables d'environnement :

**Backend (`server/.env`) :**
```bash
PORT=3001
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend (`client/.env`) :**
```bash
VITE_API_URL=http://localhost:3001
```

**Puis lancez :**
```bash
npm run dev
```

## 📝 Notes Importantes

### Plan Gratuit Render
- ✅ 750 heures/mois (suffisant pour 1 service 24/7)
- ⚠️ Le service s'endort après 15 min d'inactivité
- 🐌 Premier chargement après inactivité : ~30 secondes
- 💾 Données en mémoire perdues au redémarrage

### Optimisations Futures
Si vous dépassez le plan gratuit ou voulez améliorer les performances :

1. **Persister les données** : Ajouter une base de données (Redis, PostgreSQL)
2. **Éviter le sleep** : Utiliser un service de ping (cron-job.org)
3. **Upgrade** : Passer au plan payant (~$7/mois)

## 🐛 Dépannage

**Erreur CORS :**
- Vérifiez que `CLIENT_URL` dans le backend correspond à l'URL exacte du frontend

**WebSocket ne se connecte pas :**
- Vérifiez que `VITE_API_URL` dans le frontend correspond à l'URL du backend
- Vérifiez les logs du backend dans Render

**Build échoue :**
- Vérifiez les logs de build dans Render
- Assurez-vous que toutes les dépendances sont dans `package.json`

**Service indisponible :**
- Le plan gratuit s'endort après 15 min d'inactivité
- Attendez ~30 secondes pour le réveil

## 🔗 Ressources

- [Documentation Render](https://render.com/docs)
- [Render Status](https://status.render.com/)
- [Render Community](https://community.render.com/)

## ✅ Checklist de Déploiement

- [ ] Code pushé sur GitHub
- [ ] Services créés sur Render (backend + frontend)
- [ ] Variables d'environnement configurées
- [ ] Backend redéployé avec variables
- [ ] Frontend redéployé avec variables
- [ ] Test de création de room
- [ ] Test de WebSocket (votes en temps réel)
- [ ] Test des réactions
- [ ] Test du reveal et nouveau round

---

**Félicitations ! Votre Planning Poker est maintenant en ligne ! 🎉**
