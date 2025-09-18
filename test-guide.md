# 🧪 Guida per Testare la Piattaforma

## 📋 **Come Testare l'Analizzatore Harvest**

### **1. File di Test Excel** 
Per testare la piattaforma, crea un file Excel con questa struttura:

| A (Notes) | B (Hours) | C (Billable?) | D (First Name) |
|-----------|-----------|---------------|----------------|
| Notes | Hours | Billable? | First Name |
| COLOROSA: gestione amazon | 2.5 | Yes | Enzo |
| DIANA: sviluppo sito | 1.75 | Yes | Enzo |
| SFS: analisi dati | 3.25 | No | Enzo |
| SAVIO: meeting settimanale | 1.0 | Yes | Enzo |
| CERTIGEM: supporto tecnico | 2.0 | Yes | Enzo |
| VAULTINN: gestione hosting | 1.5 | Yes | Enzo |
| COLOROSA: call cliente | 0.75 | Yes | Enzo |
| DIANA: testing | 2.25 | Yes | Enzo |

### **2. Debugging Console**
La piattaforma ora include logging dettagliato. Apri la **Console del Browser** (F12) per vedere:

- ✅ Caricamento del workbook Excel
- ✅ Identificazione delle colonne
- ✅ Parsing di ogni riga
- ✅ Statistiche elaborate
- ❌ Eventuali errori con dettagli

### **3. Formati Supportati**
La piattaforma riconosce questi formati nelle note:

#### **Formato Standard:**
- `CLIENTE: attività` → Cliente = "CLIENTE", Attività = "attività"
- `COLOROSA: gestione amazon` → Cliente = "COLOROSA", Attività = "gestione amazon"

#### **Formato Solo Cliente:**
- `CLIENTE` → Cliente = "CLIENTE", Attività = "Attività generica"
- `COLOROSA` → Cliente = "COLOROSA", Attività = "Attività generica"

### **4. Controlli di Validazione**

#### **✅ File Validi:**
- Formato .xlsx o .xls
- Dimensione max 10MB
- Almeno una colonna numerica (ore)
- Almeno una colonna testuale (note)

#### **❌ Errori Comuni:**
- File troppo grande (>10MB)
- File corrotti o protetti da password
- Nessuna colonna "ore" valida
- File completamente vuoto

### **5. Messaggi di Debug**

#### **Console Logs Attesi:**
```
Harvest Analyzer inizializzato
Inizio parsing Excel...
Workbook caricato. Fogli disponibili: ["Foglio1"]
Dati JSON estratti: 9 righe
Ricerca header nelle prime 10 righe...
Header trovato alla riga 0: ["Notes", "Hours", "Billable?", "First Name"]
Column mapping: {notes: 0, hours: 1, billable: 2, person: 3}
Elaborate 8 righe, saltate 1
```

#### **Alert di Successo:**
- 🟢 "File elaborato con successo! Trovate X attività valide per un totale di Y ore."

#### **Alert di Errore:**
- 🔴 "File non supportato. Usa un file Excel (.xlsx o .xls) valido."
- 🔴 "Nessun dato valido trovato nel file."
- 🔴 "Il file non sembra essere un export di Harvest."

### **6. Nuova Analisi per Tipologia di Costo**\n\nLa piattaforma ora categorizza automaticamente le attività in:\n\n#### **🔴 Costi Digital (non fatturabili):**\n- GESTIONE CLIENTI, CONTROLLO MATTUTINI, GESTIONE DIGITAL\n- GESTIONE ATTIVITÀ, GESTIONE SPONSORIZZATE, GESTIONE VIDEO, GESTIONE BLOG\n\n#### **🟠 Costi Operativi:**\n- RIUNIONE DIGITAL/BLOG/VIDEO, ASANA DIGITAL/BLOG\n- GESTIONE HARVEST, COMUNICAZIONE CON TEAM/NICO/FABIO/etc.\n\n#### **⚫ Costi Generali:**\n- FORMAZIONE, COLLOQUI, AMMINISTRAZIONE, PAUSA\n- Voci senza nome specifico\n\n#### **🟢 Clienti Fatturabili:**\n- Tutti gli altri clienti reali (COLOROSA, DIANA, SFS, etc.)\n\n### **7. Risultati Attesi**

Con il file di test sopra, dovresti vedere:

#### **Statistiche:**
- Ore Totali: ~15.0
- Clienti Attivi: 6
- Attività: 8
- Media Giornaliera: ~0.5h

#### **Top Clienti:**
1. COLOROSA (3.25 ore)
2. DIANA (4.0 ore)  
3. SFS (3.25 ore)

#### **Specchietto Progressivo:**
- Tabella con tutti i clienti ordinati per ore
- Percentuali cumulative
- Barre di progresso

### **7. Troubleshooting**

#### **Se il parsing fallisce:**
1. ✅ Controlla la console per errori dettagliati
2. ✅ Verifica che il file sia un vero Excel (.xlsx/.xls)
3. ✅ Assicurati che ci siano dati nelle celle
4. ✅ Controlla che la colonna ore contenga numeri validi

#### **Se non vedi grafici:**
1. ✅ Verifica che Chart.js sia caricato (no errori console)
2. ✅ Controlla che ci siano dati processati
3. ✅ Ricarica la pagina e riprova

#### **Se l'export non funziona:**
1. ✅ Assicurati che il file sia stato processato prima
2. ✅ Controlla che il browser supporti il download
3. ✅ Verifica la console per errori JavaScript

---

## 🔍 **Debug Mode**

Per debugging avanzato, apri la console e digita:
```javascript
// Vedi tutti i dati processati
console.log(window.harvestAnalyzer.processedData);

// Vedi le statistiche clienti
console.log(window.harvestAnalyzer.clientStats);

// Vedi i dati raw dall'Excel
console.log(window.harvestAnalyzer.rawData);
```

Questo ti aiuterà a capire esattamente cosa sta succedendo durante il parsing! 🚀