# 🚀 Guida al Deployment - Harvest Time Analyzer

Questa guida ti mostra **passo passo** come pubblicare il progetto online gratuitamente.

---

## 📋 **Prerequisiti**

- ✅ Account GitHub (gratuito)
- ✅ File del progetto sul tuo computer
- ✅ Browser web moderno

---

## 🎯 **Metodo 1: GitHub Pages (Consigliato)**

### **Step 1: Preparazione Account GitHub**

1. Vai su [github.com](https://github.com)
2. **Registrati** (se non hai un account) o **Login**
3. Verifica la tua email se richiesto

### **Step 2: Creazione Repository**

1. Clicca il pulsante **"New"** (o il + in alto a destra)
2. **Repository name**: `harvest-time-analyzer`
3. **Description**: `Analisi automatica file Excel Harvest con categorizzazione costi`
4. Seleziona **"Public"** (necessario per GitHub Pages gratuito)
5. Spunta **"Add a README file"**
6. Clicca **"Create repository"**

### **Step 3: Upload dei File**

#### Metodo A: Upload via Web (Più Semplice)

1. Nel repository appena creato, clicca **"uploading an existing file"**
2. **Trascina o seleziona** questi file:
   - `index.html`
   - `js/harvest-analyzer.js` (mantieni la cartella js/)
   - `README.md`
3. **Commit message**: `Initial commit - Harvest Time Analyzer v2.0`
4. Clicca **"Commit changes"**

#### Metodo B: Git Command Line (Per Esperti)

```bash
# Clone il repository
git clone https://github.com/[TUO-USERNAME]/harvest-time-analyzer.git
cd harvest-time-analyzer

# Copia i file del progetto nella cartella
# Poi:
git add .
git commit -m "Initial commit - Harvest Time Analyzer v2.0"
git push origin main
```

### **Step 4: Attivazione GitHub Pages**

1. Nel repository, vai su **"Settings"** (tab in alto)
2. Scorri nel menu laterale fino a **"Pages"** 
3. **Source**: seleziona **"Deploy from a branch"**
4. **Branch**: seleziona **"main"**
5. **Folder**: seleziona **"/ (root)"**
6. Clicca **"Save"**

### **Step 5: Verifica Deployment**

1. Attendi **2-5 minuti** per il primo deployment
2. Ricarica la pagina Settings → Pages
3. Vedrai il messaggio: **"Your site is published at"**
4. L'URL sarà: `https://[tuo-username].github.io/harvest-time-analyzer`

### **Step 6: Test dell'Applicazione**

1. Apri l'URL nel browser
2. Verifica che si carichi correttamente
3. Testa l'upload di un file Excel
4. Controlla che le categorizzazioni funzionino

---

## 🎯 **Metodo 2: Netlify (Alternativo)**

### **Vantaggi Netlify:**
- Deploy più veloce
- URL personalizzabile
- Anteprima deploy automatici

### **Steps:**

1. Vai su [netlify.com](https://netlify.com)
2. **Registrati** con il tuo account GitHub
3. Clicca **"New site from Git"**
4. Seleziona **"GitHub"**
5. Autorizza Netlify
6. Seleziona il repository `harvest-time-analyzer`
7. **Build settings**: lascia vuoto (è un sito statico)
8. Clicca **"Deploy site"**
9. Il sito sarà disponibile a un URL tipo: `https://amazing-name-123456.netlify.app`

### **Personalizzare URL Netlify:**
1. Nel dashboard Netlify, clicca **"Site settings"**
2. **"Change site name"** → inserisci nome custom
3. Nuovo URL: `https://[nome-scelto].netlify.app`

---

## 🎯 **Metodo 3: Vercel (Alternativo)**

1. Vai su [vercel.com](https://vercel.com)
2. Registrati con GitHub
3. **"Import Project"** → GitHub → Seleziona repository  
4. Deploy automatico
5. URL: `https://harvest-time-analyzer-[hash].vercel.app`

---

## 🔧 **Configurazioni Avanzate**

### **Custom Domain (Opzionale)**

Se hai un dominio personale:

#### GitHub Pages:
1. Settings → Pages → Custom domain
2. Inserisci: `harvest.tuodominio.com`
3. Configura DNS del dominio:
   - CNAME record: `harvest` → `[username].github.io`

#### Netlify:
1. Domain settings → Add custom domain
2. Segui le istruzioni DNS

### **HTTPS (Automatico)**

- **GitHub Pages**: HTTPS automatico per domini .github.io
- **Netlify**: HTTPS automatico con certificato SSL gratuito  
- **Vercel**: HTTPS automatico

---

## 📊 **Analytics (Opzionale)**

### **Google Analytics:**

1. Crea account su [analytics.google.com](https://analytics.google.com)
2. Ottieni Tracking ID (es. `G-XXXXXXXXXX`)
3. Aggiungi in `index.html` prima di `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🚀 **Deploy Updates**

Quando modifichi il codice:

### **GitHub Pages:**
1. Modifica i file nel repository (via web o git)
2. Commit delle modifiche  
3. GitHub Pages si aggiorna automaticamente in 2-3 minuti

### **Netlify/Vercel:**
- Deploy automatico ad ogni push su GitHub
- Anteprima per Pull Request

---

## ⚡ **Performance Tips**

### **Ottimizzazioni:**

1. **Cache busting**: Vercel e Netlify lo fanno automaticamente
2. **Minification**: Non necessario per questo progetto
3. **CDN**: Già inclusi (Tailwind, Chart.js da CDN)

### **Monitoraggio:**

- **GitHub Pages**: Statistiche di base in Insights
- **Netlify**: Analytics dettagliati nel dashboard
- **Google PageSpeed**: Testa performance su [pagespeed.web.dev](https://pagespeed.web.dev)

---

## 🎯 **URL Finali Esempio**

Dopo il deployment avrai:

- **GitHub Pages**: `https://[username].github.io/harvest-time-analyzer`
- **Netlify**: `https://harvest-analyzer.netlify.app` 
- **Vercel**: `https://harvest-time-analyzer.vercel.app`

## 🆘 **Troubleshooting**

### **Problemi Comuni:**

| Problema | Soluzione |
|----------|-----------|
| 404 Page Not Found | Verifica che `index.html` sia nella root |
| File JS non trovato | Controlla che la cartella `js/` sia caricata |
| Pagina bianca | Apri Console (F12) e controlla errori JavaScript |
| GitHub Pages non attivo | Repository deve essere Public |

### **Debug:**

1. **F12** → Console per errori JavaScript
2. **Network** tab per file non trovati
3. **GitHub Actions** tab per vedere build status

---

✅ **Deployment completato!** Il tuo Harvest Time Analyzer è ora online e utilizzabile da qualsiasi dispositivo! 🎉