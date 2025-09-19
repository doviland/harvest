# 🚀 Deployment Guide - Harvest Time Tracking Analyzer

Guida completa per deployare l'Harvest Time Tracking Analyzer su tutte le principali piattaforme di hosting statico.

## 📋 Indice

- [⚡ Quick Deploy (5 minuti)](#-quick-deploy-5-minuti)
- [🐙 GitHub Pages (Raccomandato)](#-github-pages-raccomandato)
- [🌐 Altri Provider](#-altri-provider)
- [🔧 Configurazione Custom](#-configurazione-custom)
- [🐛 Troubleshooting](#-troubleshooting)
- [🔄 Aggiornamenti](#-aggiornamenti)

---

## ⚡ Quick Deploy (5 minuti)

### 🎯 Metodo più veloce - GitHub Pages

```bash
# 1. Fork questo repository su GitHub
# 2. Vai su Settings → Pages  
# 3. Source: "Deploy from a branch"
# 4. Branch: main / root
# 5. Save → La tua app è live!

URL: https://TUOUSERNAME.github.io/harvest-analyzer/
```

**✅ Vantaggi GitHub Pages:**
- Deploy automatico ad ogni commit
- HTTPS gratuito con certificato
- Custom domain supportato
- CDN globale incluso
- Zero costi di hosting

---

## 🐙 GitHub Pages (Raccomandato)

### Configurazione Iniziale

#### Metodo 1: Fork Repository

1. **Fork questo repository**
   - Clicca "Fork" in alto a destra
   - Scegli il tuo username
   - Mantieni il nome "harvest-analyzer" o personalizza

2. **Attiva GitHub Pages**
   ```
   Repository → Settings → Pages
   Source: Deploy from a branch
   Branch: main
   Folder: / (root)
   Save
   ```

3. **Verifica Deployment**
   ```
   Actions tab → Pages build and deployment
   Stato: ✅ (circa 2-3 minuti)
   ```

4. **Accedi alla tua app**
   ```
   https://TUOUSERNAME.github.io/REPOSITORY-NAME/
   ```

#### Metodo 2: Clone e Push

```bash
# Clone repository
git clone https://github.com/tuousername/harvest-analyzer.git
cd harvest-analyzer

# Personalizza (opzionale)
# - Modifica titolo in index.html
# - Cambia colori in css/styles.css
# - Aggiungi logo aziendale

# Push le modifiche
git add .
git commit -m "🚀 Deploy personalized Harvest Analyzer"
git push origin main

# Attiva Pages nelle Settings
```

### Custom Domain Setup

1. **Configura DNS nel tuo provider**
   ```
   Type: CNAME
   Host: harvest (o subdomain desiderato)
   Value: tuousername.github.io
   TTL: 3600
   ```

2. **Aggiungi CNAME file**
   ```bash
   echo "harvest.tuodominio.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```

3. **Configura in GitHub**
   ```
   Settings → Pages → Custom domain
   Inserisci: harvest.tuodominio.com
   ✅ Enforce HTTPS (dopo propagazione DNS)
   ```

### GitHub Actions (Opzionale)

Automatizza il deployment con Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        # Nessuna dipendenza richiesta per questo progetto
        echo "Static files ready for deployment"
        
    - name: Build (se necessario)
      run: |
        # Nessun build process richiesto
        echo "No build process needed"
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

---

## 🌐 Altri Provider

### 🌍 Netlify

**Deployment Drag & Drop (30 secondi):**

1. Vai su [netlify.com](https://netlify.com)
2. Trascina la cartella del progetto nell'area di deploy
3. Il sito è live immediatamente!

**Git Integration:**

```bash
# 1. Connetti repository GitHub
# 2. Build settings:
Build command: (lascia vuoto)
Publish directory: .
Branch: main

# 3. Deploy automatico ad ogni push
```

**Configurazioni Netlify:**

```toml
# netlify.toml
[build]
  publish = "."
  command = "echo 'Static site - no build needed'"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### ⚡ Vercel

**CLI Deployment:**

```bash
# Installa Vercel CLI
npm i -g vercel

# Deploy
cd harvest-analyzer
vercel --prod

# Follow prompts:
# ? Set up and deploy? Y
# ? Which scope? [your-username]  
# ? Found project? Y
# ? Want to override settings? N
```

**Git Integration:**

```bash
# 1. Importa da GitHub su vercel.com
# 2. Framework Preset: Other
# 3. Root Directory: ./
# 4. Deploy automatico configurato
```

**Configurazione Vercel:**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options", 
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### 🏃‍♂️ Surge.sh

**Deployment rapido:**

```bash
# Installa Surge
npm install -g surge

# Deploy
cd harvest-analyzer
surge

# First time setup:
# Email: your-email@domain.com
# Password: [create password]
# Domain: harvest-analyzer-yourname.surge.sh
```

**Custom Domain:**

```bash
# Deploy con dominio custom
surge --domain harvest.yourdomain.com
```

### 🔥 Firebase Hosting

```bash
# Installa Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inizializza progetto
firebase init hosting

# ? What do you want to use as your public directory? .
# ? Configure as a single-page app? N
# ? Set up automatic builds? N

# Deploy
firebase deploy
```

**Configurazione Firebase:**

```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "headers": [
      {
        "source": "**/*",
        "headers": [
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-Content-Type-Options",
            "value": "nosniff"
          }
        ]
      }
    ]
  }
}
```

### ☁️ AWS S3 + CloudFront

**Setup S3 Bucket:**

```bash
# Crea bucket S3
aws s3 mb s3://harvest-analyzer-yourdomain

# Configura static website
aws s3 website s3://harvest-analyzer-yourdomain \
  --index-document index.html \
  --error-document index.html

# Upload files
aws s3 sync . s3://harvest-analyzer-yourdomain \
  --exclude ".*" \
  --exclude "*.md" \
  --cache-control "public, max-age=31536000"

# Bucket policy per accesso pubblico
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow", 
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::harvest-analyzer-yourdomain/*"
    }
  ]
}
```

---

## 🔧 Configurazione Custom

### 🎨 Branding Personalizzato

**1. Logo e Favicon:**

```html
<!-- Sostituisci in index.html -->
<link rel="icon" href="data:image/svg+xml,INSERISCI_TUO_SVG">

<!-- Header logo -->
<div class="bg-harvest-primary text-white rounded-lg p-2">
    <img src="logo.png" alt="Your Logo" class="w-6 h-6">
</div>
```

**2. Colori Aziendali:**

```css
/* In css/styles.css */
:root {
    --color-primary: #your-brand-color;
    --color-digital: #custom-red;
    --color-operational: #custom-orange; 
    --color-general: #custom-gray;
    --color-billable: #custom-green;
}
```

**3. Testi e Messaggi:**

```html
<!-- Personalizza titoli in index.html -->
<title>Your Company - Harvest Time Analyzer</title>
<h1>Your Company Time Analyzer</h1>
```

### 🔧 Analytics e Monitoring

**Google Analytics 4:**

```html
<!-- Prima del </head> in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

**Plausible Analytics (Privacy-friendly):**

```html
<script defer data-domain="harvest.yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

### 🔒 Security Headers

**Netlify (_headers file):**

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:
```

---

## 🐛 Troubleshooting

### ❌ Problemi Comuni

#### 1. **Pagina 404 Not Found**

**Causa**: GitHub Pages non attivato o configurato male

**Soluzione**:
```bash
1. Repository → Settings → Pages
2. Verifica Branch: main
3. Verifica Folder: / (root)  
4. Attendi 5-10 minuti per propagazione
5. Controlla Actions tab per errori build
```

#### 2. **App carica ma rimane bianca**

**Causa**: Errori JavaScript o CDN bloccate

**Soluzione**:
```bash
1. F12 → Console → Controlla errori
2. Disattiva AdBlocker temporaneamente
3. Verifica connessione internet
4. Prova in modalità incognito
5. Testa su browser diverso
```

#### 3. **File Excel non viene processato**

**Causa**: Formato file non supportato o corrupted

**Soluzione**:
```bash
1. Verifica formato: solo .xlsx e .xls
2. Controlla dimensione: max 10MB
3. Prova con file Excel semplice
4. Verifica struttura colonne:
   - Colonna A: Notes  
   - Colonna B: Hours
```

#### 4. **Grafici non si visualizzano**

**Causa**: Chart.js non caricato o errori rendering

**Soluzione**:
```bash
1. Controlla console per errori Chart.js
2. Verifica che ci siano dati da visualizzare
3. Prova refresh pagina (Ctrl+F5)
4. Testa dimensioni container chart
```

#### 5. **Performance lente**

**Causa**: File Excel troppo grande o troppi dati

**Soluzione**:
```bash
1. Dividi file Excel in periodi più piccoli
2. Rimuovi colonne non necessarie
3. Testa con file Excel ridotto
4. Verifica RAM disponibile browser
```

### 🔧 Debug Mode

**Attiva debug console:**

```javascript
// Aggiungi in console browser per debug dettagliato
localStorage.setItem('harvest-debug', 'true');
location.reload();

// Visualizza statistiche processing
console.log('Harvest Analyzer Debug:', window.harvestAnalyzer);
```

### 📊 Monitoring Health

**Checklist post-deployment:**

- [ ] ✅ App carica senza errori console
- [ ] ✅ Upload area funzionante
- [ ] ✅ Processing Excel completo
- [ ] ✅ Grafici renderizzano correttamente  
- [ ] ✅ Tabella popola con dati
- [ ] ✅ Responsive su mobile
- [ ] ✅ Print CSS funzionante
- [ ] ✅ Performance < 3s load time

---

## 🔄 Aggiornamenti

### 🔄 Aggiornamento Automatico (GitHub Pages)

```bash
# Il tuo fork si aggiorna automaticamente quando fai push
# Per sincronizzare con upstream (updates del progetto principale):

# 1. Aggiungi upstream remote
git remote add upstream https://github.com/original-repo/harvest-analyzer.git

# 2. Fetch updates  
git fetch upstream

# 3. Merge updates nel tuo main branch
git checkout main
git merge upstream/main

# 4. Push updates
git push origin main
```

### 📦 Deployment Rollback

**GitHub Pages:**

```bash
# Rollback a commit precedente
git log --oneline  # trova commit hash
git revert COMMIT_HASH
git push origin main
```

**Netlify:**

```bash
# Via dashboard
1. Deploys → Production deploys
2. Seleziona deploy funzionante  
3. "Publish deploy"
```

### 🔄 Continuous Deployment

**GitHub Actions per auto-sync:**

```yaml
name: Sync with Upstream
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Sync upstream
        run: |
          git remote add upstream https://github.com/original-repo/harvest-analyzer.git
          git fetch upstream
          git checkout main
          git merge upstream/main
          git push origin main
```

---

## 🎯 Best Practices

### 🚀 Performance Optimization

1. **Enable Compression** (se server personalizzato)
   ```nginx
   gzip on;
   gzip_types text/html text/css application/javascript;
   ```

2. **Cache Headers**
   ```
   Cache-Control: public, max-age=31536000  # CSS/JS
   Cache-Control: public, max-age=86400     # HTML
   ```

3. **CDN Configuration**
   - Usa CDN geograficamente distribuite
   - Configura cache policies appropriate
   - Monitor performance con Lighthouse

### 🔒 Security Checklist

- [ ] **HTTPS enabled** su production
- [ ] **Security headers** configurati
- [ ] **No sensitive data** in repository  
- [ ] **Dependencies** aggiornate
- [ ] **CSP policy** configurata
- [ ] **Regular backups** dei settings

### 📊 Monitoring Setup

**Uptime Monitoring:**
- UptimeRobot: ping ogni 5 minuti
- Pingdom: monitoring globale
- StatusCake: alerts avanzati

**Error Tracking:**
- Sentry: error reporting
- LogRocket: user session replay
- Google Analytics: user behavior

---

## 📞 Support Deployment

### 🆘 Need Help?

**Community Support:**
- 🐙 **GitHub Issues**: Problemi tecnici specifici
- 💬 **Discussions**: Domande deployment generali
- 📧 **Email**: deployment@harvestanalyzer.com

**Professional Support:**
- 🎯 **Setup consulenza**: 1-on-1 deployment assistance
- 🏢 **Enterprise setup**: White-label e custom domain
- 🔧 **Maintenance**: Updates e monitoring gestiti

---

## ✅ Deployment Success!

Quando vedi questo, il deployment è riuscito:

```
✅ App carica rapidamente (< 3 secondi)
✅ Header con logo e titolo visibili
✅ Area upload funzionante
✅ No errori in console browser
✅ Responsive design su mobile
✅ HTTPS attivo e sicuro
```

**🎉 Congratulazioni! Il tuo Harvest Time Analyzer è live e pronto per l'uso!**

---

*Deployment guide per Harvest Time Analyzer v2.0 • [← Back to README](README.md)*