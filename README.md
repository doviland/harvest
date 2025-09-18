# 🕐 Harvest Time Tracking Analyzer - Versione Pulita

Una piattaforma web completa per l'analisi dei file Excel di Harvest Time Tracking con categorizzazione automatica dei costi per tipologia.

![Status](https://img.shields.io/badge/Status-Ready-green) ![Version](https://img.shields.io/badge/Version-2.0.0-blue)

## 🎯 **Obiettivo Principale**

Questo strumento serve per **suddividere automaticamente i costi** che non sono attribuibili ai singoli clienti, fornendo una visione chiara della distribuzione delle ore lavorative per tipologia di attività.

---

## 🚀 **Funzionalità Principali**

### ✅ **Categorizzazione Automatica dei Costi**

Il sistema categorizza automaticamente le attività in **4 tipologie**:

#### 🔴 **Costi Digital** *(Non fatturabili a clienti)*
- GESTIONE CLIENTI
- CONTROLLO MATTUTINI  
- GESTIONE DIGITAL
- GESTIONE ATTIVITÀ
- GESTIONE SPONSORIZZATE
- GESTIONE VIDEO
- GESTIONE BLOG

#### 🟠 **Costi Operativi** 
- RIUNIONE DIGITAL, RIUNIONE BLOG, RIUNIONE VIDEO
- ASANA DIGITAL, ASANA BLOG  
- GESTIONE HARVEST, HARVEST
- COMUNICAZIONE CON TEAM/NICO/FABIO/FILIPPO/COMMERCIALI/CRISTINA
- COMUNICAZIONE (generico)

#### ⚫ **Costi Generali**
- FORMAZIONE
- COLLOQUI
- AMMINISTRAZIONE  
- PAUSA (maiuscola e minuscola)
- Voci non specificate/vuote

#### 🟢 **Clienti Fatturabili**
- **Tutti gli altri clienti reali** (non inclusi nelle categorie sopra)

### 📊 **Dashboard Interattivi**

- **Card Overview**: 4 card colorate con ore e percentuali per categoria
- **Grafico Distribuzione Costi**: Torta interattiva con le 4 categorie  
- **Grafico Top 10 Clienti**: Barra orizzontale dei clienti principali
- **Statistiche Generali**: Ore totali, numero clienti, attività, media giornaliera

### 📋 **Analisi Dettagliate**

- **Tabella Clienti Completa**: Ogni cliente con categoria, ore, percentuale e numero attività
- **Ordinamento Automatico**: Clienti ordinati per ore decrescenti
- **Badge Colorati**: Ogni categoria ha il suo colore distintivo

### 📤 **Upload e Processing**

- **Drag & Drop**: Trascina il file Excel direttamente nella pagina
- **Parsing Intelligente**: Riconosce automaticamente colonne Notes e Hours
- **Validazione**: Controllo formato (.xlsx, .xls) e dimensione (max 10MB)
- **Processing Client-side**: Tutto avviene nel browser per privacy

---

## 📁 **Formato File Excel Richiesto**

### **Struttura Attesa:**
```
Colonna A: Notes (formato "CLIENTE: attività" o solo "CLIENTE")
Colonna B: Hours (numero decimale, es. 2.5)
Colonna C: Billable (opzionale)
Colonna D: Person (opzionale)
```

### **Esempi di Righe:**
```
GESTIONE HARVEST: controllo ore          | 2.5
GESTIONE CLIENTI: social media check     | 1.5  
CLIENT XYZ: sviluppo website             | 4.0
FORMAZIONE: corso online                 | 1.0
AZIENDA ABC: campagna marketing          | 3.2
```

---

## 🔧 **Tecnologie Utilizzate**

- **Frontend**: HTML5, CSS3, JavaScript ES6+ 
- **UI Framework**: Tailwind CSS v3
- **Grafici**: Chart.js v3
- **Excel Processing**: SheetJS (XLSX.js)
- **Icone**: Font Awesome 6
- **Font**: Inter (Google Fonts)

---

## 📂 **Struttura Progetto**

```
harvest-analyzer/
├── index.html              # Interfaccia principale
├── js/
│   └── harvest-analyzer.js  # Logica applicazione
├── css/
│   └── styles.css          # Stili personalizzati (se necessari)
└── README.md               # Documentazione
```

---

## 🚀 **Come Usare**

1. **Apri** `index.html` nel browser
2. **Trascina** il file Excel di Harvest nella zona di upload  
3. **Attendi** l'elaborazione (pochi secondi)
4. **Visualizza** i risultati:
   - Card con distribuzione ore per categoria
   - Grafici interattivi 
   - Tabella dettagliata clienti
5. **Analizza** la suddivisione dei costi non fatturabili

---

## 💡 **Casi d'Uso Principali**

### **Analisi Mensile**
- Carica il file Excel mensile di Harvest
- Vedi immediatamente quanto tempo è dedicato a:
  - Gestione digital e operativa
  - Formazione e amministrazione  
  - Clienti fatturabili vs costi interni

### **Ottimizzazione Tempo**
- Identifica le categorie che assorbono più tempo
- Bilancia ore fatturabili vs costi operativi
- Pianifica meglio la distribuzione delle attività

### **Reporting**  
- Presenta ai clienti/management la distribuzione del tempo
- Giustifica i costi operativi e di gestione
- Mostra l'efficienza del lavoro fatturabile

---

## 🔍 **Logica di Categorizzazione**

Il sistema utilizza **matching esatto** e **ricerca per contenuto**:

1. **Prima** controlla i **Costi Operativi** (per evitare conflitti con "GESTIONE")
2. **Poi** controlla i **Costi Digital** 
3. **Quindi** i **Costi Generali**
4. **Infine** tutto il resto va in **Clienti Fatturabili**

**Priorità**: Operativi → Digital → Generali → Fatturabili

---

## ⚡ **Caratteristiche Tecniche**

- **Performance**: Processing rapido anche con file grandi
- **Responsive**: Funziona su desktop, tablet e mobile
- **Cross-browser**: Compatibile con Chrome, Firefox, Safari, Edge
- **Privacy**: Nessun dato viene inviato a server esterni
- **Affidabile**: Gestione errori e validazione completa

---

## 🎨 **Design**

- **Interfaccia Moderna**: Design pulito e professionale
- **Colori Significativi**: Ogni categoria ha il suo colore distintivo
- **Grafici Interattivi**: Tooltip e animazioni per migliore UX
- **Feedback Visivo**: Loading, successo ed errori ben evidenziati

---

## 📈 **Metriche Fornite**

### **Per Categoria di Costo:**
- Ore totali
- Percentuale sul totale
- Numero di entry

### **Per Cliente:**
- Ore dedicate  
- Categoria di appartenenza
- Numero di attività diverse
- Percentuale sul totale

### **Generali:**
- Ore totali elaborate
- Numero clienti distinti  
- Numero attività totali
- Media ore giornaliere (su base 30 giorni)

---

## 🔄 **Prossimi Miglioramenti**

- **Export Results**: Esportazione risultati in Excel/PDF
- **Filtri Temporali**: Analisi per periodo specifico  
- **Comparazioni**: Confronto tra mesi diversi
- **Template Custom**: Categorie personalizzabili
- **Harvest API**: Integrazione diretta (senza file Excel)

---

*Creato per ottimizzare l'analisi dei tempi di lavoro e la categorizzazione dei costi operativi* ⏰✨