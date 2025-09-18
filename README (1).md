# 🕐 Harvest Time Tracking Analyzer

**Una webapp per l'analisi automatica dei file Excel di Harvest con categorizzazione intelligente dei costi.**

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://[TUO-USERNAME].github.io/harvest-time-analyzer)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)
[![Made with](https://img.shields.io/badge/Made%20with-Vanilla%20JS-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## 🎯 **Cosa Fa**

Questo strumento analizza i file Excel esportati da Harvest e **categorizza automaticamente** le ore lavorative in:

- 🔴 **Costi Digital** (gestione clienti, controllo mattutini, ecc.)
- 🟠 **Costi Operativi** (riunioni, comunicazioni, harvest)  
- ⚫ **Costi Generali** (formazione, amministrazione, pause)
- 🟢 **Clienti Fatturabili** (lavoro diretto per clienti)

## 🚀 **Usa Online**

### **👉 [APRI L'APPLICAZIONE](https://[TUO-USERNAME].github.io/harvest-time-analyzer)**

1. **Esporta** il tuo timesheet mensile da Harvest in formato Excel
2. **Trascina** il file nell'applicazione web  
3. **Visualizza** immediatamente la distribuzione dei costi
4. **Analizza** grafici e tabelle dettagliate

---

## 📊 **Screenshot**

### Dashboard Principale
![Dashboard](docs/dashboard-preview.png)

### Categorizzazione Automatica
- **GESTIONE HARVEST** → Costi Operativi ✅
- **GESTIONE CLIENTI** → Costi Digital ✅  
- **FORMAZIONE** → Costi Generali ✅
- **AZIENDA XYZ** → Clienti Fatturabili ✅

---

## 🔧 **Tecnologie**

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **UI**: Tailwind CSS
- **Grafici**: Chart.js  
- **Excel**: SheetJS
- **Hosting**: GitHub Pages

---

## 📁 **Struttura Progetto**

```
harvest-time-analyzer/
├── index.html              # App principale
├── js/
│   └── harvest-analyzer.js  # Logica applicazione  
├── README.md               # Documentazione
└── docs/                   # Screenshots e documentazione
```

---

## 🛠️ **Setup Locale**

Se vuoi modificare il codice:

```bash
# Clone repository
git clone https://github.com/[TUO-USERNAME]/harvest-time-analyzer.git

# Apri in browser
cd harvest-time-analyzer
open index.html  # Mac
start index.html # Windows
```

---

## 📝 **Formato File Excel**

Il file Excel deve avere questa struttura:

| Notes | Hours | Billable | Person |
|-------|-------|----------|--------|
| GESTIONE HARVEST: controllo ore | 2.5 | No | Nome |
| CLIENT XYZ: sviluppo sito | 4.0 | Yes | Nome |
| FORMAZIONE: corso online | 1.0 | No | Nome |

---

## 🎨 **Personalizzazione**

### Modificare le Categorie
Modifica l'array `costiOperativi`, `costiDigital`, `costiGenerali` in `js/harvest-analyzer.js`:

```javascript
const costiOperativi = [
    'GESTIONE HARVEST', 'HARVEST',
    'TUA CATEGORIA PERSONALIZZATA'  // Aggiungi qui
];
```

### Cambiare i Colori
Modifica i colori nel CSS o nelle configurazioni Chart.js.

---

## 🤝 **Contributi**

I contributi sono benvenuti! 

1. **Fork** il repository
2. **Crea** un branch per la tua feature (`git checkout -b feature/nuova-funzione`)
3. **Commit** le modifiche (`git commit -am 'Aggiungi nuova funzione'`)
4. **Push** al branch (`git push origin feature/nuova-funzione`)
5. **Apri** una Pull Request

---

## 📄 **Licenza**

Questo progetto è rilasciato sotto licenza MIT. Vedi [LICENSE](LICENSE) per i dettagli.

---

## 📞 **Supporto**

Per domande o problemi:
- 🐛 [Issues](https://github.com/[TUO-USERNAME]/harvest-time-analyzer/issues)
- 📧 Email: [tua-email@esempio.com]
- 💬 Discussions: [GitHub Discussions](https://github.com/[TUO-USERNAME]/harvest-time-analyzer/discussions)

---

⭐ **Se questo progetto ti è utile, lascia una stella!** ⭐