/**
 * Harvest Time Tracking Analyzer - Versione Pulita
 * Analizza file Excel di Harvest e categorizza per tipo di costo
 */

class HarvestAnalyzer {
    constructor() {
        this.rawData = [];
        this.processedData = [];
        this.stats = {
            totalHours: 0,
            clients: new Map(),
            costTypes: new Map(['Costi Digital', 'Costi Operativi', 'Costi Generali', 'Clienti Fatturabili'].map(type => [type, {
                name: type,
                hours: 0,
                entries: 0,
                percentage: 0
            }]))
        };
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');

        // Upload handlers
        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
        dropZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
        dropZone.addEventListener('drop', this.handleFileDrop.bind(this));
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.processFile(e.target.files[0]);
            }
        });
    }

    handleDragOver(e) {
        e.preventDefault();
        e.currentTarget.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
    }

    handleFileDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.processFile(files[0]);
        }
    }

    processFile(file) {
        // Validate file
        if (!this.validateFile(file)) return;
        
        this.showLoading(true);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                this.parseExcelData(e.target.result);
            } catch (error) {
                console.error('Errore processing file:', error);
                this.showError('Errore nel parsing del file Excel: ' + error.message);
                this.showLoading(false);
            }
        };
        reader.readAsArrayBuffer(file);
    }

    validateFile(file) {
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.showError('File troppo grande. Dimensione massima: 10MB');
            return false;
        }

        // Check file type
        const validExtensions = ['.xlsx', '.xls'];
        const fileName = file.name.toLowerCase();
        const isValid = validExtensions.some(ext => fileName.endsWith(ext));
        
        if (!isValid) {
            this.showError('Formato file non supportato. Usa file .xlsx o .xls');
            return false;
        }

        return true;
    }

    parseExcelData(arrayBuffer) {
        try {
            // Parse Excel file
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            // Convert to JSON with headers
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
                header: 1,
                defval: '',
                raw: false,
                blankrows: false
            });

            if (!jsonData || jsonData.length === 0) {
                throw new Error('File Excel vuoto o non valido');
            }

            this.rawData = jsonData;
            this.processHarvestData();
            
        } catch (error) {
            console.error('Errore parsing Excel:', error);
            this.showError('Errore nel parsing del file Excel: ' + error.message);
            this.showLoading(false);
        }
    }

    processHarvestData() {
        // Reset data
        this.processedData = [];
        this.stats.totalHours = 0;
        this.stats.clients.clear();
        this.stats.costTypes.forEach(costType => {
            costType.hours = 0;
            costType.entries = 0;
            costType.percentage = 0;
        });

        // Find header row (look for 'Notes' or 'Hours')
        let headerRowIndex = -1;
        for (let i = 0; i < Math.min(5, this.rawData.length); i++) {
            const row = this.rawData[i];
            if (row && row.some(cell => 
                cell && typeof cell === 'string' && 
                (cell.toLowerCase().includes('note') || 
                 cell.toLowerCase().includes('hour') ||
                 cell.toLowerCase().includes('task'))
            )) {
                headerRowIndex = i;
                break;
            }
        }

        if (headerRowIndex === -1) headerRowIndex = 0;

        // Process data rows
        for (let i = headerRowIndex + 1; i < this.rawData.length; i++) {
            const row = this.rawData[i];
            if (!row || row.length === 0) continue;
            
            const processedRow = this.parseDataRow(row, i);
            if (processedRow) {
                this.processedData.push(processedRow);
                this.updateStats(processedRow);
            }
        }

        // Calculate percentages
        this.stats.costTypes.forEach(costType => {
            costType.percentage = this.stats.totalHours > 0 ? 
                (costType.hours / this.stats.totalHours * 100) : 0;
        });

        if (this.processedData.length === 0) {
            this.showError('Nessun dato valido trovato nel file');
            this.showLoading(false);
            return;
        }

        this.displayResults();
    }

    parseDataRow(row, rowIndex) {
        try {
            // Extract data from row (assuming Notes in col 0, Hours in col 1)
            const notes = row[0] || '';
            const hoursValue = row[1];
            
            if (!notes && !hoursValue) return null;

            // Parse hours
            let hours = 0;
            if (hoursValue !== undefined && hoursValue !== null && hoursValue !== '') {
                if (typeof hoursValue === 'number') {
                    hours = hoursValue;
                } else {
                    const parsed = parseFloat(hoursValue.toString().replace(',', '.'));
                    if (!isNaN(parsed) && parsed > 0) {
                        hours = parsed;
                    }
                }
            }

            if (hours <= 0 && !notes) return null;

            // Parse client and activity from notes
            const { client, activity } = this.parseClientActivity(notes);
            
            // Categorize by cost type
            const costType = this.categorizeByCostType(client, activity);

            return {
                rowIndex: rowIndex + 1,
                originalNotes: notes,
                client: client,
                activity: activity,
                hours: hours,
                costType: costType
            };

        } catch (error) {
            console.warn(`Errore parsing riga ${rowIndex + 1}:`, error);
            return null;
        }
    }

    parseClientActivity(notes) {
        if (!notes || (typeof notes !== 'string' && typeof notes !== 'number')) {
            return {
                client: 'NON SPECIFICATO',
                activity: 'Attività generica'
            };
        }

        const notesStr = String(notes).trim();
        const colonIndex = notesStr.indexOf(':');
        
        if (colonIndex > 0) {
            const client = notesStr.substring(0, colonIndex).trim().toUpperCase();
            const activity = notesStr.substring(colonIndex + 1).trim();
            
            return {
                client: client || 'NON SPECIFICATO',
                activity: activity || 'Attività generica'
            };
        } else {
            return {
                client: notesStr.toUpperCase(),
                activity: 'Attività generica'
            };
        }
    }

    categorizeByCostType(client, activity) {
        const clientUpper = client ? client.toUpperCase().trim() : '';
        const activityUpper = activity ? activity.toUpperCase().trim() : '';
        const fullActivity = `${clientUpper}: ${activityUpper}`.toUpperCase();
        
        // COSTI OPERATIVI (controlla prima per evitare conflitti con "GESTIONE")
        const costiOperativi = [
            'GESTIONE HARVEST', 'HARVEST',
            'RIUNIONE DIGITAL', 'RIUNIONE BLOG', 'RIUNIONE VIDEO',
            'ASANA DIGITAL', 'ASANA BLOG',
            'COMUNICAZIONE CON TEAM', 'COMUNICAZIONE CON NICO', 'COMUNICAZIONE CON FABIO',
            'COMUNICAZIONE CON FILIPPO', 'COMUNICAZIONE CON COMMERCIALI', 
            'COMUNICAZIONE CON CRISTINA', 'COMUNICAZIONE'
        ];
        
        for (let cost of costiOperativi) {
            if (clientUpper === cost || fullActivity.includes(cost)) {
                return 'Costi Operativi';
            }
        }
        
        // COSTI DIGITAL
        const costiDigital = [
            'GESTIONE CLIENTI', 'CONTROLLO MATTUTINI', 'GESTIONE DIGITAL',
            'GESTIONE ATTIVITA', 'GESTIONE ATTIVITÀ', 'GESTIONE SPONSORIZZATE', 
            'GESTIONE VIDEO', 'GESTIONE BLOG'
        ];
        
        for (let cost of costiDigital) {
            if (clientUpper === cost || fullActivity.includes(cost)) {
                return 'Costi Digital';
            }
        }
        
        // COSTI GENERALI
        const costiGenerali = ['FORMAZIONE', 'COLLOQUI', 'AMMINISTRAZIONE', 'PAUSA'];
        
        for (let cost of costiGenerali) {
            if (clientUpper === cost || fullActivity.includes(cost) || activityUpper.includes(cost) ||
                (cost === 'PAUSA' && clientUpper.toLowerCase() === 'pausa')) {
                return 'Costi Generali';
            }
        }
        
        // NON SPECIFICATO -> Costi Generali
        if (clientUpper === 'NON SPECIFICATO' || clientUpper === '' || clientUpper === 'UNDEFINED') {
            return 'Costi Generali';
        }
        
        // Default: Clienti Fatturabili
        return 'Clienti Fatturabili';
    }

    updateStats(row) {
        // Update total hours
        this.stats.totalHours += row.hours;
        
        // Update cost type stats
        const costTypeStat = this.stats.costTypes.get(row.costType);
        if (costTypeStat) {
            costTypeStat.hours += row.hours;
            costTypeStat.entries += 1;
        }
        
        // Update client stats
        if (!this.stats.clients.has(row.client)) {
            this.stats.clients.set(row.client, {
                name: row.client,
                hours: 0,
                entries: 0,
                activities: new Set(),
                costType: row.costType
            });
        }
        
        const clientStat = this.stats.clients.get(row.client);
        clientStat.hours += row.hours;
        clientStat.entries += 1;
        clientStat.activities.add(row.activity);
    }

    displayResults() {
        this.showLoading(false);
        this.showResults(true);
        this.updateUI();
        this.createCharts();
        this.populateTables();
        this.showSuccess(`File elaborato! ${this.processedData.length} attività per ${this.stats.totalHours.toFixed(2)} ore totali.`);
    }

    updateUI() {
        // Update cost type cards
        this.stats.costTypes.forEach((costType, typeName) => {
            const elementMap = {
                'Costi Digital': 'costiDigitalOre',
                'Costi Operativi': 'costiOperativiOre',
                'Costi Generali': 'costiGeneraliOre',
                'Clienti Fatturabili': 'clientiFatturabiliOre'
            };
            
            const percMap = {
                'Costi Digital': 'costiDigitalPerc',
                'Costi Operativi': 'costiOperativiPerc',
                'Costi Generali': 'costiGeneraliPerc',
                'Clienti Fatturabili': 'clientiFatturabiliPerc'
            };
            
            const oreElement = document.getElementById(elementMap[typeName]);
            const percElement = document.getElementById(percMap[typeName]);
            
            if (oreElement) oreElement.textContent = costType.hours.toFixed(1) + 'h';
            if (percElement) percElement.textContent = costType.percentage.toFixed(1) + '%';
        });

        // Update general stats
        document.getElementById('totalHours').textContent = this.stats.totalHours.toFixed(1) + 'h';
        document.getElementById('totalClients').textContent = this.stats.clients.size;
        document.getElementById('totalActivities').textContent = this.processedData.length;
        document.getElementById('dailyAverage').textContent = (this.stats.totalHours / 30).toFixed(1) + 'h';
    }

    createCharts() {
        this.createCostChart();
        this.createClientChart();
    }

    createCostChart() {
        const ctx = document.getElementById('costChart').getContext('2d');
        
        const data = Array.from(this.stats.costTypes.values()).filter(ct => ct.hours > 0);
        
        if (window.costChartInstance) {
            window.costChartInstance.destroy();
        }

        window.costChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map(ct => ct.name),
                datasets: [{
                    data: data.map(ct => ct.hours),
                    backgroundColor: [
                        '#ef4444', // Rosso Digital
                        '#f97316', // Arancione Operativi
                        '#6b7280', // Grigio Generali
                        '#10b981'  // Verde Fatturabili
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const percentage = context.parsed.toFixed(1);
                                return `${context.label}: ${percentage} ore (${((context.parsed / context.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    createClientChart() {
        const ctx = document.getElementById('clientChart').getContext('2d');
        
        const sortedClients = Array.from(this.stats.clients.values())
            .sort((a, b) => b.hours - a.hours)
            .slice(0, 10);

        if (window.clientChartInstance) {
            window.clientChartInstance.destroy();
        }

        window.clientChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedClients.map(c => c.name.length > 20 ? c.name.substring(0, 20) + '...' : c.name),
                datasets: [{
                    label: 'Ore',
                    data: sortedClients.map(c => c.hours),
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Ore'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const percentage = ((context.raw / window.harvestAnalyzer.stats.totalHours) * 100).toFixed(1);
                                return `${context.raw.toFixed(2)} ore (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    populateTables() {
        const tbody = document.getElementById('clientTableBody');
        tbody.innerHTML = '';

        const sortedClients = Array.from(this.stats.clients.values())
            .sort((a, b) => b.hours - a.hours);

        sortedClients.forEach((client, index) => {
            const percentage = (client.hours / this.stats.totalHours * 100).toFixed(1);
            
            // Get cost type color
            const costTypeColors = {
                'Costi Digital': 'bg-red-100 text-red-800',
                'Costi Operativi': 'bg-orange-100 text-orange-800',
                'Costi Generali': 'bg-gray-100 text-gray-800',
                'Clienti Fatturabili': 'bg-green-100 text-green-800'
            };
            
            const colorClass = costTypeColors[client.costType] || 'bg-gray-100 text-gray-800';
            
            const row = document.createElement('tr');
            row.className = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${client.name}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 py-1 text-xs font-medium rounded-full ${colorClass}">
                        ${client.costType}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    ${client.hours.toFixed(2)}h
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    ${percentage}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    ${client.activities.size}
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }

    // UI Helper Methods
    showLoading(show) {
        const loadingEl = document.querySelector('.loading');
        if (loadingEl) {
            loadingEl.style.display = show ? 'block' : 'none';
        }
    }

    showResults(show) {
        const resultsEl = document.querySelector('.results-section');
        if (resultsEl) {
            resultsEl.style.display = show ? 'block' : 'none';
            if (show) resultsEl.classList.add('fade-in');
        }
    }

    showError(message) {
        this.showAlert(message, 'error');
    }

    showSuccess(message) {
        this.showAlert(message, 'success');
    }

    showAlert(message, type = 'info') {
        // Remove existing alerts
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) existingAlert.remove();

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert mb-4 p-4 rounded-lg ${type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`;
        
        alertDiv.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${type === 'error' ? 'fa-exclamation-triangle' : 'fa-check-circle'} mr-3"></i>
                <div class="flex-1">
                    <strong>${type === 'error' ? 'Errore:' : 'Successo:'}</strong> ${message}
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        const uploadSection = document.querySelector('.upload-section');
        uploadSection.parentNode.insertBefore(alertDiv, uploadSection.nextSibling);

        // Auto-remove after 5 seconds for success, 10 for errors
        setTimeout(() => {
            if (document.body.contains(alertDiv)) alertDiv.remove();
        }, type === 'error' ? 10000 : 5000);
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    window.harvestAnalyzer = new HarvestAnalyzer();
    console.log('✅ Harvest Analyzer inizializzato');
});