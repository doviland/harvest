/**
 * Harvest Time Tracking Analyzer v2.0
 * Analisi e categorizzazione automatica dei costi Harvest
 * 
 * Created from scratch - Optimized for GitHub Pages
 * Author: Harvest Analyzer Team
 * License: MIT
 */

class HarvestTimeAnalyzer {
    constructor() {
        // State management
        this.rawData = [];
        this.processedData = [];
        this.currentFile = null;
        
        // Statistics
        this.stats = {
            totalHours: 0,
            clients: new Map(),
            categories: new Map([
                ['Costi Digital', { name: 'Costi Digital', hours: 0, entries: 0, percentage: 0, color: '#ef4444' }],
                ['Costi Operativi', { name: 'Costi Operativi', hours: 0, entries: 0, percentage: 0, color: '#f97316' }],
                ['Costi Generali', { name: 'Costi Generali', hours: 0, entries: 0, percentage: 0, color: '#6b7280' }],
                ['Clienti Fatturabili', { name: 'Clienti Fatturabili', hours: 0, entries: 0, percentage: 0, color: '#10b981' }]
            ])
        };
        
        // Chart instances
        this.charts = {
            cost: null,
            client: null
        };
        
        // Initialize
        this.initializeEventListeners();
        this.showInitialMessage();
    }
    
    /**
     * Initialize all event listeners
     */
    initializeEventListeners() {
        const dropZone = document.getElementById('dropZone');
        const fileInput = document.getElementById('fileInput');
        const removeFileBtn = document.getElementById('removeFile');
        const shareBtn = document.getElementById('shareBtn');
        
        // File upload events
        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
        dropZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
        dropZone.addEventListener('drop', this.handleFileDrop.bind(this));
        
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelect(e.target.files[0]);
            }
        });
        
        // Remove file
        if (removeFileBtn) {
            removeFileBtn.addEventListener('click', this.resetUpload.bind(this));
        }
        
        // Share functionality
        if (shareBtn) {
            shareBtn.addEventListener('click', this.shareResults.bind(this));
        }
        
        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            document.addEventListener(eventName, this.preventDefaults, false);
        });
    }
    
    /**
     * Prevent default drag behaviors
     */
    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    /**
     * Handle drag over
     */
    handleDragOver(e) {
        e.preventDefault();
        const dropZone = document.getElementById('dropZone');
        dropZone.classList.add('border-blue-500', 'bg-blue-50', 'scale-105');
    }
    
    /**
     * Handle drag leave
     */
    handleDragLeave(e) {
        e.preventDefault();
        const dropZone = document.getElementById('dropZone');
        dropZone.classList.remove('border-blue-500', 'bg-blue-50', 'scale-105');
    }
    
    /**
     * Handle file drop
     */
    handleFileDrop(e) {
        e.preventDefault();
        const dropZone = document.getElementById('dropZone');
        dropZone.classList.remove('border-blue-500', 'bg-blue-50', 'scale-105');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.handleFileSelect(files[0]);
        }
    }
    
    /**
     * Handle file selection
     */
    handleFileSelect(file) {
        if (!this.validateFile(file)) return;
        
        this.currentFile = file;
        this.showFileInfo(file);
        this.processExcelFile(file);
    }
    
    /**
     * Validate uploaded file
     */
    validateFile(file) {
        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.showAlert('File troppo grande. Dimensione massima: 10MB', 'error');
            return false;
        }
        
        // Check file type
        const validExtensions = ['.xlsx', '.xls'];
        const fileName = file.name.toLowerCase();
        const isValid = validExtensions.some(ext => fileName.endsWith(ext));
        
        if (!isValid) {
            this.showAlert('Formato file non supportato. Usa file .xlsx o .xls', 'error');
            return false;
        }
        
        return true;
    }
    
    /**
     * Show file information
     */
    showFileInfo(file) {
        const fileInfo = document.getElementById('fileInfo');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        
        if (fileInfo && fileName && fileSize) {
            fileName.textContent = file.name;
            fileSize.textContent = this.formatFileSize(file.size);
            fileInfo.classList.remove('hidden');
        }
    }
    
    /**
     * Format file size in human readable format
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    /**
     * Process Excel file
     */
    async processExcelFile(file) {
        try {
            this.showLoading(true);
            
            const arrayBuffer = await this.readFileAsArrayBuffer(file);
            const workbook = XLSX.read(arrayBuffer, { type: 'array' });
            
            // Get first sheet
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
                defval: '',
                raw: false,
                blankrows: false
            });
            
            if (!jsonData || jsonData.length === 0) {
                throw new Error('Il file Excel è vuoto o non contiene dati validi');
            }
            
            this.rawData = jsonData;
            await this.processHarvestData();
            
        } catch (error) {
            console.error('Errore elaborazione file:', error);
            this.showAlert(`Errore nell'elaborazione del file: ${error.message}`, 'error');
            this.showLoading(false);
        }
    }
    
    /**
     * Read file as array buffer
     */
    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Errore nella lettura del file'));
            reader.readAsArrayBuffer(file);
        });
    }
    
    /**
     * Process Harvest data and categorize
     */
    async processHarvestData() {
        try {
            // Reset stats
            this.resetStats();
            
            // Find header row
            const headerRowIndex = this.findHeaderRow();
            
            // Process each data row
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
            this.calculatePercentages();
            
            if (this.processedData.length === 0) {
                throw new Error('Nessun dato valido trovato nel file');
            }
            
            // Show results
            await this.displayResults();
            
        } catch (error) {
            console.error('Errore processamento dati:', error);
            this.showAlert(`Errore nell'analisi dei dati: ${error.message}`, 'error');
            this.showLoading(false);
        }
    }
    
    /**
     * Find header row in Excel data
     */
    findHeaderRow() {
        for (let i = 0; i < Math.min(5, this.rawData.length); i++) {
            const row = this.rawData[i];
            if (row && row.some(cell => 
                cell && typeof cell === 'string' && 
                (cell.toLowerCase().includes('note') || 
                 cell.toLowerCase().includes('hour') ||
                 cell.toLowerCase().includes('task') ||
                 cell.toLowerCase().includes('client'))
            )) {
                return i;
            }
        }
        return 0; // Default to first row
    }
    
    /**
     * Parse individual data row
     */
    parseDataRow(row, rowIndex) {
        try {
            // Extract notes and hours (assuming Notes in col A, Hours in col B)
            const notes = row[0] || '';
            const hoursValue = row[1];
            
            if (!notes && !hoursValue) return null;
            
            // Parse hours
            let hours = 0;
            if (hoursValue !== undefined && hoursValue !== null && hoursValue !== '') {
                if (typeof hoursValue === 'number') {
                    hours = hoursValue;
                } else {
                    const parsed = parseFloat(String(hoursValue).replace(',', '.'));
                    if (!isNaN(parsed) && parsed > 0) {
                        hours = parsed;
                    }
                }
            }
            
            if (hours <= 0 && !notes) return null;
            
            // Parse client and activity
            const { client, activity } = this.parseClientActivity(notes);
            
            // Categorize
            const category = this.categorizeEntry(client, activity);
            
            return {
                rowIndex: rowIndex + 1,
                originalNotes: notes,
                client: client,
                activity: activity,
                hours: hours,
                category: category,
                billable: row[2] || '', // Optional billable column
                person: row[3] || ''     // Optional person column
            };
            
        } catch (error) {
            console.warn(`Errore parsing riga ${rowIndex + 1}:`, error);
            return null;
        }
    }
    
    /**
     * Parse client and activity from notes
     */
    parseClientActivity(notes) {
        if (!notes || (typeof notes !== 'string' && typeof notes !== 'number')) {
            return {
                client: 'NON SPECIFICATO',
                activity: 'Attività non specificata'
            };
        }
        
        const notesStr = String(notes).trim();
        const colonIndex = notesStr.indexOf(':');
        
        if (colonIndex > 0) {
            const client = notesStr.substring(0, colonIndex).trim().toUpperCase();
            const activity = notesStr.substring(colonIndex + 1).trim();
            
            return {
                client: client || 'NON SPECIFICATO',
                activity: activity || 'Attività non specificata'
            };
        } else {
            return {
                client: notesStr.toUpperCase(),
                activity: 'Attività generica'
            };
        }
    }
    
    /**
     * Categorize entry based on client and activity
     */
    categorizeEntry(client, activity) {
        const clientUpper = client ? client.toUpperCase().trim() : '';
        const activityUpper = activity ? activity.toUpperCase().trim() : '';
        const fullText = `${clientUpper}: ${activityUpper}`.toUpperCase();
        
        // PRIORITY 1: COSTI OPERATIVI (to avoid conflicts with "GESTIONE")
        const operationalCosts = [
            'GESTIONE HARVEST', 'HARVEST',
            'RIUNIONE DIGITAL', 'RIUNIONE BLOG', 'RIUNIONE VIDEO',
            'ASANA DIGITAL', 'ASANA BLOG', 'ASANA',
            'COMUNICAZIONE CON TEAM', 'COMUNICAZIONE CON NICO', 'COMUNICAZIONE CON FABIO',
            'COMUNICAZIONE CON FILIPPO', 'COMUNICAZIONE CON COMMERCIALI', 
            'COMUNICAZIONE CON CRISTINA', 'COMUNICAZIONE'
        ];
        
        for (const cost of operationalCosts) {
            if (clientUpper === cost || fullText.includes(cost)) {
                return 'Costi Operativi';
            }
        }
        
        // PRIORITY 2: COSTI DIGITAL
        const digitalCosts = [
            'GESTIONE CLIENTI', 'CONTROLLO MATTUTINI', 'GESTIONE DIGITAL',
            'GESTIONE ATTIVITA', 'GESTIONE ATTIVITÀ', 'GESTIONE SPONSORIZZATE',
            'GESTIONE VIDEO', 'GESTIONE BLOG'
        ];
        
        for (const cost of digitalCosts) {
            if (clientUpper === cost || fullText.includes(cost)) {
                return 'Costi Digital';
            }
        }
        
        // PRIORITY 3: COSTI GENERALI
        const generalCosts = ['FORMAZIONE', 'COLLOQUI', 'AMMINISTRAZIONE', 'PAUSA'];
        
        for (const cost of generalCosts) {
            if (clientUpper === cost || fullText.includes(cost) || 
                activityUpper.includes(cost) ||
                (cost === 'PAUSA' && clientUpper.toLowerCase() === 'pausa')) {
                return 'Costi Generali';
            }
        }
        
        // Handle unspecified entries
        if (clientUpper === 'NON SPECIFICATO' || clientUpper === '' || 
            clientUpper === 'UNDEFINED' || clientUpper === 'NULL') {
            return 'Costi Generali';
        }
        
        // DEFAULT: CLIENTI FATTURABILI
        return 'Clienti Fatturabili';
    }
    
    /**
     * Reset statistics
     */
    resetStats() {
        this.processedData = [];
        this.stats.totalHours = 0;
        this.stats.clients.clear();
        
        // Reset category stats
        this.stats.categories.forEach(category => {
            category.hours = 0;
            category.entries = 0;
            category.percentage = 0;
        });
    }
    
    /**
     * Update statistics with processed row
     */
    updateStats(row) {
        // Update total hours
        this.stats.totalHours += row.hours;
        
        // Update category stats
        const categoryStat = this.stats.categories.get(row.category);
        if (categoryStat) {
            categoryStat.hours += row.hours;
            categoryStat.entries += 1;
        }
        
        // Update client stats
        if (!this.stats.clients.has(row.client)) {
            this.stats.clients.set(row.client, {
                name: row.client,
                hours: 0,
                entries: 0,
                activities: new Set(),
                category: row.category
            });
        }
        
        const clientStat = this.stats.clients.get(row.client);
        clientStat.hours += row.hours;
        clientStat.entries += 1;
        clientStat.activities.add(row.activity);
    }
    
    /**
     * Calculate percentages
     */
    calculatePercentages() {
        if (this.stats.totalHours > 0) {
            this.stats.categories.forEach(category => {
                category.percentage = (category.hours / this.stats.totalHours) * 100;
            });
        }
    }
    
    /**
     * Display results
     */
    async displayResults() {
        this.showLoading(false);
        
        // Update UI elements
        this.updateOverviewCards();
        this.updateSummaryStats();
        this.populateClientTable();
        
        // Create charts
        await this.createCharts();
        
        // Show results section
        this.showResults(true);
        
        // Show success message
        this.showAlert(
            `✅ Analisi completata! Processate ${this.processedData.length} attività per un totale di ${this.stats.totalHours.toFixed(1)} ore.`, 
            'success'
        );
    }
    
    /**
     * Update overview cards
     */
    updateOverviewCards() {
        const elements = {
            'Costi Digital': { hours: 'digitalHours', perc: 'digitalPerc' },
            'Costi Operativi': { hours: 'operationalHours', perc: 'operationalPerc' },
            'Costi Generali': { hours: 'generalHours', perc: 'generalPerc' },
            'Clienti Fatturabili': { hours: 'billableHours', perc: 'billablePerc' }
        };
        
        this.stats.categories.forEach((categoryData, categoryName) => {
            const elementIds = elements[categoryName];
            if (elementIds) {
                const hoursElement = document.getElementById(elementIds.hours);
                const percElement = document.getElementById(elementIds.perc);
                
                if (hoursElement) hoursElement.textContent = `${categoryData.hours.toFixed(1)}h`;
                if (percElement) percElement.textContent = `${categoryData.percentage.toFixed(1)}%`;
            }
        });
    }
    
    /**
     * Update summary statistics
     */
    updateSummaryStats() {
        const totalHoursEl = document.getElementById('totalHours');
        const totalClientsEl = document.getElementById('totalClients');
        const totalActivitiesEl = document.getElementById('totalActivities');
        const dailyAverageEl = document.getElementById('dailyAverage');
        
        if (totalHoursEl) totalHoursEl.textContent = `${this.stats.totalHours.toFixed(1)}h`;
        if (totalClientsEl) totalClientsEl.textContent = this.stats.clients.size;
        if (totalActivitiesEl) totalActivitiesEl.textContent = this.processedData.length;
        if (dailyAverageEl) dailyAverageEl.textContent = `${(this.stats.totalHours / 30).toFixed(1)}h`;
    }
    
    /**
     * Populate client details table
     */
    populateClientTable() {
        const tbody = document.getElementById('clientTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        // Sort clients by hours (descending)
        const sortedClients = Array.from(this.stats.clients.values())
            .sort((a, b) => b.hours - a.hours);
        
        sortedClients.forEach((client, index) => {
            const percentage = (client.hours / this.stats.totalHours * 100).toFixed(1);
            
            // Get category badge color
            const badgeColors = {
                'Costi Digital': 'bg-red-100 text-red-800 border-red-200',
                'Costi Operativi': 'bg-orange-100 text-orange-800 border-orange-200',
                'Costi Generali': 'bg-gray-100 text-gray-800 border-gray-200',
                'Clienti Fatturabili': 'bg-green-100 text-green-800 border-green-200'
            };
            
            const badgeClass = badgeColors[client.category] || 'bg-gray-100 text-gray-800 border-gray-200';
            
            const row = document.createElement('tr');
            row.className = index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100';
            
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">${this.escapeHtml(client.name)}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeClass}">
                        ${client.category}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    ${client.hours.toFixed(2)}h
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    ${percentage}%
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    ${client.activities.size}
                </td>
            `;
            
            tbody.appendChild(row);
        });
    }
    
    /**
     * Create interactive charts
     */
    async createCharts() {
        await this.createCostChart();
        await this.createClientChart();
    }
    
    /**
     * Create cost distribution chart
     */
    async createCostChart() {
        const ctx = document.getElementById('costChart');
        if (!ctx) return;
        
        // Destroy existing chart
        if (this.charts.cost) {
            this.charts.cost.destroy();
        }
        
        const data = Array.from(this.stats.categories.values()).filter(cat => cat.hours > 0);
        
        this.charts.cost = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map(cat => cat.name),
                datasets: [{
                    data: data.map(cat => cat.hours),
                    backgroundColor: data.map(cat => cat.color),
                    borderWidth: 3,
                    borderColor: '#ffffff',
                    hoverBorderWidth: 4
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
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((context.raw / total) * 100).toFixed(1);
                                return `${context.label}: ${context.raw.toFixed(1)}h (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 1000
                }
            }
        });
    }
    
    /**
     * Create top clients chart
     */
    async createClientChart() {
        const ctx = document.getElementById('clientChart');
        if (!ctx) return;
        
        // Destroy existing chart
        if (this.charts.client) {
            this.charts.client.destroy();
        }
        
        const sortedClients = Array.from(this.stats.clients.values())
            .sort((a, b) => b.hours - a.hours)
            .slice(0, 10);
        
        if (sortedClients.length === 0) return;
        
        this.charts.client = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: sortedClients.map(c => 
                    c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name
                ),
                datasets: [{
                    label: 'Ore',
                    data: sortedClients.map(c => c.hours),
                    backgroundColor: '#3b82f6',
                    borderColor: '#2563eb',
                    borderWidth: 1,
                    borderRadius: 6
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
                            text: 'Ore Lavorate'
                        },
                        grid: {
                            display: true
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const percentage = ((context.raw / this.stats.totalHours) * 100).toFixed(1);
                                return `${context.raw.toFixed(2)} ore (${percentage}% del totale)`;
                            }
                        }
                    }
                },
                animation: {
                    duration: 1500,
                    easing: 'easeOutQuart'
                }
            }
        });
    }
    
    /**
     * Show/hide loading state
     */
    showLoading(show) {
        const uploadContent = document.querySelector('.upload-content');
        const loadingState = document.getElementById('loadingState');
        
        if (show) {
            if (uploadContent) uploadContent.classList.add('hidden');
            if (loadingState) loadingState.classList.remove('hidden');
        } else {
            if (uploadContent) uploadContent.classList.remove('hidden');
            if (loadingState) loadingState.classList.add('hidden');
        }
    }
    
    /**
     * Show/hide results section
     */
    showResults(show) {
        const resultsSection = document.getElementById('resultsSection');
        if (resultsSection) {
            if (show) {
                resultsSection.classList.remove('hidden');
                // Scroll to results
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                resultsSection.classList.add('hidden');
            }
        }
    }
    
    /**
     * Reset upload state
     */
    resetUpload() {
        this.currentFile = null;
        this.rawData = [];
        this.processedData = [];
        this.resetStats();
        
        // Reset UI
        const fileInput = document.getElementById('fileInput');
        const fileInfo = document.getElementById('fileInfo');
        
        if (fileInput) fileInput.value = '';
        if (fileInfo) fileInfo.classList.add('hidden');
        
        this.showResults(false);
        this.showLoading(false);
        
        // Destroy charts
        if (this.charts.cost) {
            this.charts.cost.destroy();
            this.charts.cost = null;
        }
        if (this.charts.client) {
            this.charts.client.destroy();
            this.charts.client = null;
        }
    }
    
    /**
     * Share results functionality
     */
    shareResults() {
        if (navigator.share && this.stats.totalHours > 0) {
            navigator.share({
                title: 'Harvest Time Tracking Analysis',
                text: `Analisi completata: ${this.stats.totalHours.toFixed(1)} ore elaborate per ${this.stats.clients.size} clienti`,
                url: window.location.href
            });
        } else {
            // Fallback: copy URL to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showAlert('URL copiato negli appunti!', 'success');
            }).catch(() => {
                this.showAlert('Impossibile copiare il link', 'error');
            });
        }
    }
    
    /**
     * Show alert message
     */
    showAlert(message, type = 'info') {
        const container = document.getElementById('alertContainer');
        if (!container) return;
        
        const alertId = 'alert-' + Date.now();
        const alertColors = {
            success: 'bg-green-50 border-green-200 text-green-800',
            error: 'bg-red-50 border-red-200 text-red-800',
            warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
            info: 'bg-blue-50 border-blue-200 text-blue-800'
        };
        
        const alertIcons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-triangle',
            warning: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };
        
        const alertDiv = document.createElement('div');
        alertDiv.id = alertId;
        alertDiv.className = `${alertColors[type]} border rounded-lg p-4 shadow-lg transform transition-all duration-300 translate-x-full`;
        
        alertDiv.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <i class="${alertIcons[type]} mr-3"></i>
                    <span class="text-sm font-medium">${this.escapeHtml(message)}</span>
                </div>
                <button onclick="document.getElementById('${alertId}').remove()" class="ml-4 text-gray-400 hover:text-gray-600">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        container.appendChild(alertDiv);
        
        // Trigger animation
        setTimeout(() => {
            alertDiv.classList.remove('translate-x-full');
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            if (document.getElementById(alertId)) {
                alertDiv.classList.add('translate-x-full');
                setTimeout(() => alertDiv.remove(), 300);
            }
        }, type === 'error' ? 8000 : 5000);
    }
    
    /**
     * Show initial welcome message
     */
    showInitialMessage() {
        setTimeout(() => {
            this.showAlert('👋 Benvenuto! Carica un file Excel di Harvest per iniziare l\'analisi automatica dei costi.', 'info');
        }, 1000);
    }
    
    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check for required libraries
    if (typeof XLSX === 'undefined') {
        console.error('XLSX library not loaded');
        return;
    }
    
    if (typeof Chart === 'undefined') {
        console.error('Chart.js library not loaded');
        return;
    }
    
    // Initialize the analyzer
    window.harvestAnalyzer = new HarvestTimeAnalyzer();
    
    console.log('✅ Harvest Time Analyzer v2.0 initialized successfully');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible' && window.harvestAnalyzer) {
        // Refresh charts if they exist
        if (window.harvestAnalyzer.charts.cost) {
            window.harvestAnalyzer.charts.cost.resize();
        }
        if (window.harvestAnalyzer.charts.client) {
            window.harvestAnalyzer.charts.client.resize();
        }
    }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HarvestTimeAnalyzer;
}