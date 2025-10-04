# Guide de Dépannage 🔧

## Problème: Erreur CORS (Access-Control-Allow-Origin)

### Symptômes
```
Access to XMLHttpRequest at 'http://localhost:3001/socket.io/...'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

### Solution Rapide ⚡

**ÉTAPE 1 - Arrêt Complet:**
```
Double-cliquez sur: clean-restart.bat
```

**ÉTAPE 2 - Attendez 10 secondes**
Laissez les serveurs démarrer complètement

**ÉTAPE 3 - Vérification:**
1. Ouvrez la console du navigateur (F12)
2. Vous devriez voir: `✅ Connected to server`
3. Le point de statut devrait être VERT

### Solution Détaillée 🔍

Si `clean-restart.bat` ne résout pas le problème:

**1. Diagnostic:**
```
Double-cliquez sur: diagnostic.bat
```

Vérifiez:
- ✅ Node.js installé
- ✅ Dependencies installées
- ✅ Ports 3001 et 5173 disponibles ou utilisés correctement

**2. Nettoyage Manuel:**
```bash
# Ouvrez PowerShell en tant qu'administrateur

# Tuez tous les processus Node.js
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Vérifiez les ports
netstat -ano | findstr "3001"
netstat -ano | findstr "5173"
```

**3. Vérification Backend:**
```bash
# Dans le dossier server/
cd server
node index.js
```

Vous devriez voir:
```
🚀 Server running on http://localhost:3001
```

**4. Vérification Frontend:**
```bash
# Dans le dossier client/
cd client
npm run dev
```

Vous devriez voir:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

## Problème: Erreur 308 (Permanent Redirect)

### Symptômes
```
GET http://localhost:3001/socket.io/?EIO=4&transport=polling
net::ERR_FAILED 308 (Permanent Redirect)
```

### Causes Possibles
1. ❌ Backend pas démarré
2. ❌ Ancienne instance de Node.js qui tourne
3. ❌ Cache du navigateur
4. ❌ Service worker actif

### Solutions

**1. Clean Restart:**
```
clean-restart.bat
```

**2. Vider Cache Navigateur:**
- Chrome/Edge: `Ctrl + Shift + Delete`
- Cochez "Cached images and files"
- Période: "All time"
- Cliquez "Clear data"

**3. Navigation Privée:**
Testez en mode navigation privée pour éliminer les problèmes de cache

**4. Vérifier que le backend écoute:**
Ouvrez http://localhost:3001 dans votre navigateur
Vous devriez voir une erreur 404 (c'est normal, ça prouve que le serveur répond)

## Problème: Backend ne démarre pas

### Symptômes
```
Error: listen EADDRINUSE: address already in use :::3001
```

### Solution
**Port 3001 déjà utilisé:**
```bash
# PowerShell (Administrateur)
# Trouver le processus
netstat -ano | findstr ":3001"

# Tuer le processus (remplacez PID par le numéro affiché)
taskkill /F /PID <PID>
```

Ou plus simple:
```
clean-restart.bat
```

## Problème: Frontend ne démarre pas

### Symptômes
```
Error: Port 5173 is in use
```

### Solution
Même procédure que pour le backend mais pour le port 5173

## Problème: "Cannot find module"

### Symptômes
```
Error: Cannot find module 'express'
Error: Cannot find module 'socket.io'
```

### Solution
```
install.bat
```

Attendez que l'installation se termine, puis:
```
start.bat
```

## Problème: Inputs non cliquables

### Symptômes
- Les champs de saisie ne répondent pas au clic
- Impossible de taper dans les inputs

### Solution
1. Vérifiez que vous avez bien les dernières modifications:
```
clean-restart.bat
```

2. Hard refresh du navigateur:
```
Ctrl + Shift + R
```

3. Si le problème persiste, essayez un autre navigateur

## Vérifications Générales

### ✓ Liste de Contrôle de Base

- [ ] Node.js version 18+ installé (`node --version`)
- [ ] Dependencies installées (dossier `node_modules` existe dans root, server, et client)
- [ ] Aucun autre processus sur port 3001
- [ ] Aucun autre processus sur port 5173
- [ ] Pare-feu autorise Node.js
- [ ] Antivirus n'interfère pas

### ✓ Vérification de Connexion

**Backend:**
```bash
curl http://localhost:3001/socket.io/
```
Devrait retourner quelque chose (même si c'est juste un slash)

**Frontend:**
```
Ouvrez http://localhost:5173
```
Devrait afficher la page d'accueil Planning Poker

### ✓ Console du Navigateur

Ouvrez F12 → Console

**Messages Attendus (Bon):**
```
✅ Connected to server
[vite] connected.
```

**Messages d'Erreur (Mauvais):**
```
❌ Connection error: ...
Access to XMLHttpRequest blocked by CORS policy
```

## Commandes de Diagnostic

### Tester la Connectivité Backend
```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:3001/socket.io/" -Method GET
```

### Voir les Logs Backend en Direct
1. Fermez la fenêtre backend actuelle
2. Ouvrez un terminal dans le dossier `server/`
3. Lancez: `npm run dev`
4. Observez les logs en temps réel

### Voir les Logs Frontend en Direct
1. F12 dans le navigateur → Console
2. Tous les logs s'affichent ici

## Solutions Nucléaires 💣

Si RIEN ne fonctionne:

**1. Réinstallation Complète:**
```bash
# Supprimez tous les node_modules
rmdir /s /q node_modules
rmdir /s /q server\node_modules
rmdir /s /q client\node_modules

# Réinstallez
install.bat
```

**2. Redémarrage Machine:**
Parfois, un simple redémarrage de l'ordinateur résout des problèmes de ports/processus bloqués

**3. Vérifier Pare-feu/Antivirus:**
Ajoutez une exception pour:
- Node.js (node.exe)
- Ports 3001 et 5173

**4. Utiliser des Ports Différents:**

Si les ports 3001/5173 causent problèmes:

Dans `server/index.js`, changez:
```javascript
const PORT = process.env.PORT || 3002; // au lieu de 3001
```

Dans `client/src/hooks/useSocket.js`, changez:
```javascript
const SOCKET_URL = 'http://localhost:3002'; // au lieu de 3001
```

Dans `client/vite.config.js`, changez:
```javascript
server: {
  port: 5174, // au lieu de 5173
},
```

## Support Supplémentaire

### Fichiers de Debug Utiles

**Logs Backend:**
Les logs apparaissent dans la fenêtre "Planning Poker - Backend"

**Logs Frontend:**
- Console navigateur (F12)
- Fenêtre "Planning Poker - Frontend"

### Informations à Collecter

Si vous devez demander de l'aide:

1. **Version Node.js:** `node --version`
2. **Version npm:** `npm --version`
3. **Système d'exploitation:** Windows 10/11
4. **Messages d'erreur complets** de la console
5. **Sortie de:** `diagnostic.bat`
6. **Ports utilisés:** `netstat -ano | findstr "3001 5173"`

## Fichiers Batch Disponibles

| Fichier | Utilité |
|---------|---------|
| `install.bat` | Installation initiale des dépendances |
| `start.bat` | Démarrage normal |
| `stop.bat` | Arrêt de tous les serveurs |
| `restart.bat` | Redémarrage simple |
| `clean-restart.bat` | ⭐ Redémarrage complet avec nettoyage |
| `diagnostic.bat` | Vérification de l'installation |

## Questions Fréquentes

**Q: Dois-je exécuter install.bat à chaque fois?**
R: Non, une seule fois suffit (sauf si vous supprimez node_modules)

**Q: Pourquoi deux fenêtres s'ouvrent?**
R: Une pour le backend, une pour le frontend. Les deux sont nécessaires.

**Q: Puis-je fermer les fenêtres noires?**
R: Non! Utilisez stop.bat ou clean-restart.bat

**Q: Le navigateur affiche une erreur 404**
R: Normal si vous allez sur http://localhost:3001. Allez sur http://localhost:5173

**Q: Combien de temps pour démarrer?**
R: 5-10 secondes normalement. Si plus long, vérifiez les erreurs.

---

**Si le problème persiste après avoir tout essayé, créez un issue avec toutes les informations de debug! 🐛**
