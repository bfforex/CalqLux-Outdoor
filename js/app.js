/**
 * CalqLux Outdoor - Main Application Logic
 * Coordinates all components and handles user interactions
 */

class CalqLuxApp {
    constructor() {
        this.fixtureLibrary = new FixtureLibrary();
        this.lightingCalculator = new LightingCalculator();
        this.canvasManager = null;
        this.currentProject = null;
        this.currentStandard = 'fifa';
        
        this.ui = {
            elements: {},
            modals: {}
        };
        
        this.setupUI();
        this.initializeComponents();
        this.bindEvents();
    }
    
    setupUI() {
        // Cache DOM elements
        this.ui.elements = {
            // Navigation
            newProjectBtn: document.querySelector('[data-action="new-project"]'),
            openProjectBtn: document.querySelector('[data-action="open-project"]'),
            saveProjectBtn: document.querySelector('[data-action="save-project"]'),
            exportBtn: document.querySelector('[data-action="export-report"]'),
            
            // View controls
            view2DBtn: document.querySelector('[data-view="2d"]'),
            view3DBtn: document.querySelector('[data-view="3d"]'),
            
            // Tools
            toolBtns: document.querySelectorAll('.tool-btn'),
            
            // Fixture library
            categoryBtns: document.querySelectorAll('.category-btn'),
            fixtureList: document.getElementById('fixture-list'),
            
            // Canvas controls
            zoomInBtn: document.querySelector('[data-action="zoom-in"]'),
            zoomOutBtn: document.querySelector('[data-action="zoom-out"]'),
            zoomFitBtn: document.querySelector('[data-action="zoom-fit"]'),
            zoomLevel: document.querySelector('.zoom-level'),
            gridSizeInput: document.getElementById('grid-size'),
            snapBtn: document.querySelector('[data-action="toggle-snap"]'),
            
            // Status
            cursorPosition: document.getElementById('cursor-position'),
            selectionInfo: document.getElementById('selection-info'),
            
            // Properties panel
            propertiesPanel: document.getElementById('properties-panel'),
            
            // Standards
            lightingStandard: document.getElementById('lighting-standard'),
            standardRequirements: document.getElementById('standard-requirements'),
            
            // Results
            avgIlluminance: document.getElementById('avg-illuminance'),
            minIlluminance: document.getElementById('min-illuminance'),
            maxIlluminance: document.getElementById('max-illuminance'),
            uniformityRatio: document.getElementById('uniformity-ratio'),
            complianceStatus: document.getElementById('compliance-status'),
            calculateBtn: document.getElementById('calculate-btn'),
            
            // Visualization
            vizBtns: document.querySelectorAll('.viz-btn')
        };
        
        // Cache modals
        this.ui.modals = {
            project: document.getElementById('project-modal'),
            export: document.getElementById('export-modal')
        };
    }
    
    initializeComponents() {
        // Initialize canvas manager
        this.canvasManager = new CanvasManager('main-canvas', 'overlay-canvas');
        
        // Load custom fixtures
        this.fixtureLibrary.loadCustomFixtures();
        
        // Initialize fixture library UI
        this.updateFixtureLibraryUI();
        
        // Initialize standards UI
        this.updateStandardsUI();
        
        // Load saved project if exists
        this.loadLastProject();
    }
    
    bindEvents() {
        // Navigation events
        this.ui.elements.newProjectBtn.addEventListener('click', () => this.newProject());
        this.ui.elements.openProjectBtn.addEventListener('click', () => this.showProjectModal());
        this.ui.elements.saveProjectBtn.addEventListener('click', () => this.saveProject());
        this.ui.elements.exportBtn.addEventListener('click', () => this.showExportModal());
        
        // View control events
        this.ui.elements.view2DBtn.addEventListener('click', () => this.setView('2d'));
        this.ui.elements.view3DBtn.addEventListener('click', () => this.setView('3d'));
        
        // Tool events
        this.ui.elements.toolBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tool = btn.dataset.tool;
                this.setTool(tool);
            });
        });
        
        // Category events
        this.ui.elements.categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                this.setFixtureCategory(category);
            });
        });
        
        // Canvas control events
        this.ui.elements.zoomInBtn.addEventListener('click', () => this.zoomIn());
        this.ui.elements.zoomOutBtn.addEventListener('click', () => this.zoomOut());
        this.ui.elements.zoomFitBtn.addEventListener('click', () => this.zoomToFit());
        this.ui.elements.gridSizeInput.addEventListener('change', (e) => this.setGridSize(e.target.value));
        this.ui.elements.snapBtn.addEventListener('click', () => this.toggleSnap());
        
        // Standards events
        this.ui.elements.lightingStandard.addEventListener('change', (e) => {
            this.setStandard(e.target.value);
        });
        
        // Calculate button
        this.ui.elements.calculateBtn.addEventListener('click', () => this.calculateLighting());
        
        // Visualization events
        this.ui.elements.vizBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const viz = btn.dataset.viz;
                this.setVisualization(viz);
            });
        });
        
        // Canvas events
        this.canvasManager.on('cursorMove', (worldPos) => {
            this.updateCursorPosition(worldPos);
        });
        
        this.canvasManager.on('objectSelected', (object) => {
            this.updatePropertiesPanel(object);
            this.updateSelectionInfo([object]);
        });
        
        this.canvasManager.on('selectionCleared', () => {
            this.updatePropertiesPanel(null);
            this.updateSelectionInfo([]);
        });
        
        this.canvasManager.on('allSelected', (objects) => {
            this.updateSelectionInfo(objects);
        });
        
        this.canvasManager.on('zoomChanged', (zoom) => {
            this.updateZoomDisplay(zoom);
        });
        
        this.canvasManager.on('toolChanged', (tool) => {
            this.updateToolUI(tool);
        });
        
        // Modal events
        this.setupModalEvents();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Auto-save
        setInterval(() => this.autoSave(), 30000); // Every 30 seconds
    }
    
    setupModalEvents() {
        // Close modal buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.hideModal(modal);
            });
        });
        
        // Click outside to close
        Object.values(this.ui.modals).forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal);
                }
            });
        });
        
        // Project file input
        const projectFileInput = document.getElementById('project-file-input');
        projectFileInput.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.loadProject(e.target.files[0]);
            }
        });
        
        // Download project button
        const downloadBtn = document.getElementById('download-project');
        downloadBtn.addEventListener('click', () => this.downloadProject());
        
        // Generate report button
        const generateReportBtn = document.getElementById('generate-report');
        generateReportBtn.addEventListener('click', () => this.generateReport());
    }
    
    // Project management
    newProject() {
        if (this.hasUnsavedChanges()) {
            if (!confirm('You have unsaved changes. Create new project anyway?')) {
                return;
            }
        }
        
        this.currentProject = {
            id: CalqLuxUtils.generateUUID(),
            name: 'Untitled Project',
            created: new Date().toISOString(),
            modified: new Date().toISOString(),
            settings: {
                units: 'metric',
                standard: 'fifa'
            },
            data: {
                areas: [],
                fixtures: [],
                obstacles: [],
                measurements: []
            }
        };
        
        // Clear canvas
        this.canvasManager.importData({ objects: this.currentProject.data });
        
        // Reset UI
        this.setStandard(this.currentProject.settings.standard);
        this.clearResults();
        
        console.log('New project created');
    }
    
    saveProject() {
        if (!this.currentProject) {
            this.newProject();
        }
        
        // Update project data
        this.currentProject.data = this.canvasManager.exportData().objects;
        this.currentProject.modified = new Date().toISOString();
        
        // Save to localStorage
        CalqLuxUtils.saveToLocalStorage('calqlux_current_project', this.currentProject);
        CalqLuxUtils.saveToLocalStorage('calqlux_last_save', Date.now());
        
        console.log('Project saved');
        this.showNotification('Project saved successfully', 'success');
    }
    
    loadProject(file) {
        CalqLuxUtils.loadJSONFile(file)
            .then(data => {
                if (this.validateProjectData(data)) {
                    this.currentProject = data;
                    this.canvasManager.importData({ objects: data.data });
                    this.setStandard(data.settings?.standard || 'fifa');
                    this.hideModal(this.ui.modals.project);
                    console.log('Project loaded:', data.name);
                    this.showNotification('Project loaded successfully', 'success');
                } else {
                    throw new Error('Invalid project file format');
                }
            })
            .catch(error => {
                console.error('Error loading project:', error);
                this.showNotification('Error loading project: ' + error.message, 'error');
            });
    }
    
    downloadProject() {
        if (!this.currentProject) {
            this.newProject();
        }
        
        this.currentProject.data = this.canvasManager.exportData().objects;
        this.currentProject.modified = new Date().toISOString();
        
        const filename = `${this.currentProject.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.json`;
        CalqLuxUtils.downloadJSON(this.currentProject, filename);
        
        this.hideModal(this.ui.modals.project);
    }
    
    loadLastProject() {
        const saved = CalqLuxUtils.loadFromLocalStorage('calqlux_current_project');
        if (saved && this.validateProjectData(saved)) {
            this.currentProject = saved;
            this.canvasManager.importData({ objects: saved.data });
            this.setStandard(saved.settings?.standard || 'fifa');
            console.log('Last project loaded');
        } else {
            this.newProject();
        }
    }
    
    validateProjectData(data) {
        return data && 
               typeof data.id === 'string' &&
               typeof data.name === 'string' &&
               data.data &&
               typeof data.data === 'object';
    }
    
    autoSave() {
        if (this.currentProject && this.hasUnsavedChanges()) {
            this.saveProject();
        }
    }
    
    hasUnsavedChanges() {
        const lastSave = CalqLuxUtils.loadFromLocalStorage('calqlux_last_save');
        const lastModified = this.currentProject?.modified ? new Date(this.currentProject.modified).getTime() : 0;
        return !lastSave || lastModified > lastSave;
    }
    
    // UI Updates
    updateFixtureLibraryUI(category = 'sports') {
        const fixtures = this.fixtureLibrary.getFixturesByCategory(category);
        const container = this.ui.elements.fixtureList;
        
        container.innerHTML = '';
        
        fixtures.forEach(fixture => {
            const element = document.createElement('div');
            element.className = 'fixture-item';
            element.dataset.fixtureId = fixture.id;
            
            element.innerHTML = `
                <div class="fixture-name">${fixture.name}</div>
                <div class="fixture-specs">
                    ${fixture.specifications.power}W, ${fixture.specifications.lumens.toLocaleString()} lm
                </div>
            `;
            
            element.addEventListener('click', () => {
                this.selectFixtureType(fixture);
            });
            
            container.appendChild(element);
        });
    }
    
    updateStandardsUI() {
        const standard = this.lightingCalculator.standards[this.currentStandard];
        const container = this.ui.elements.standardRequirements;
        
        if (!standard) return;
        
        container.innerHTML = '';
        
        Object.entries(standard.requirements).forEach(([key, requirement]) => {
            const element = document.createElement('div');
            element.className = 'requirement-item';
            
            let label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            let value = '';
            
            if (requirement.min !== undefined) {
                value = `≥ ${requirement.min}`;
                if (requirement.recommended !== undefined) {
                    value += ` (rec: ${requirement.recommended})`;
                }
                if (requirement.unit) {
                    value += ` ${requirement.unit}`;
                }
            }
            
            element.innerHTML = `
                <span>${label}:</span>
                <span class="requirement-value">${value}</span>
            `;
            
            container.appendChild(element);
        });
    }
    
    updatePropertiesPanel(object) {
        const panel = this.ui.elements.propertiesPanel;
        
        if (!object) {
            panel.innerHTML = '<p class="no-selection">Select an object to view properties</p>';
            return;
        }
        
        let html = '';
        
        if (object.position) { // Fixture
            html = `
                <div class="property-group">
                    <label>Name</label>
                    <input type="text" value="${object.name || 'Fixture'}" data-property="name">
                </div>
                <div class="property-group">
                    <label>X Position (m)</label>
                    <input type="number" value="${CalqLuxUtils.formatNumber(object.position.x)}" data-property="position.x" step="0.1">
                </div>
                <div class="property-group">
                    <label>Y Position (m)</label>
                    <input type="number" value="${CalqLuxUtils.formatNumber(object.position.y)}" data-property="position.y" step="0.1">
                </div>
                <div class="property-group">
                    <label>Height (m)</label>
                    <input type="number" value="${CalqLuxUtils.formatNumber(object.position.z || 20)}" data-property="position.z" step="0.1">
                </div>
                <div class="property-group">
                    <label>Rotation (°)</label>
                    <input type="number" value="${object.orientation?.rotation || 0}" data-property="orientation.rotation" step="1">
                </div>
                <div class="property-group">
                    <label>Tilt (°)</label>
                    <input type="number" value="${object.orientation?.tilt || 0}" data-property="orientation.tilt" step="1">
                </div>
                <div class="property-group">
                    <label>Power (W)</label>
                    <input type="number" value="${object.specifications?.power || 1000}" data-property="specifications.power" step="100">
                </div>
            `;
        } else if (object.width !== undefined) { // Rectangle (area or obstacle)
            const type = object.height !== undefined ? (object.name?.includes('Area') ? 'Area' : 'Obstacle') : 'Object';
            html = `
                <div class="property-group">
                    <label>Name</label>
                    <input type="text" value="${object.name || type}" data-property="name">
                </div>
                <div class="property-group">
                    <label>X Position (m)</label>
                    <input type="number" value="${CalqLuxUtils.formatNumber(object.x)}" data-property="x" step="0.1">
                </div>
                <div class="property-group">
                    <label>Y Position (m)</label>
                    <input type="number" value="${CalqLuxUtils.formatNumber(object.y)}" data-property="y" step="0.1">
                </div>
                <div class="property-group">
                    <label>Width (m)</label>
                    <input type="number" value="${CalqLuxUtils.formatNumber(object.width)}" data-property="width" step="0.1">
                </div>
                <div class="property-group">
                    <label>Height (m)</label>
                    <input type="number" value="${CalqLuxUtils.formatNumber(object.height)}" data-property="height" step="0.1">
                </div>
            `;
        }
        
        panel.innerHTML = html;
        
        // Bind property change events
        panel.querySelectorAll('input').forEach(input => {
            input.addEventListener('change', (e) => {
                this.updateObjectProperty(object, e.target.dataset.property, e.target.value);
            });
        });
    }
    
    updateObjectProperty(object, propertyPath, value) {
        const parts = propertyPath.split('.');
        let current = object;
        
        // Navigate to the parent object
        for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) {
                current[parts[i]] = {};
            }
            current = current[parts[i]];
        }
        
        // Set the final property
        const finalProp = parts[parts.length - 1];
        const numValue = parseFloat(value);
        current[finalProp] = isNaN(numValue) ? value : numValue;
        
        // Redraw canvas
        this.canvasManager.draw();
        
        // Mark project as modified
        if (this.currentProject) {
            this.currentProject.modified = new Date().toISOString();
        }
    }
    
    updateCursorPosition(worldPos) {
        this.ui.elements.cursorPosition.textContent = 
            `X: ${CalqLuxUtils.formatNumber(worldPos.x, 2)}m, Y: ${CalqLuxUtils.formatNumber(worldPos.y, 2)}m`;
    }
    
    updateSelectionInfo(objects) {
        const count = objects.length;
        let text = '';
        
        if (count === 0) {
            text = '';
        } else if (count === 1) {
            const obj = objects[0];
            if (obj.position) {
                text = `Selected: Fixture (${obj.name || 'Unnamed'})`;
            } else if (obj.width !== undefined) {
                text = `Selected: ${obj.name || 'Object'}`;
            }
        } else {
            text = `Selected: ${count} objects`;
        }
        
        this.ui.elements.selectionInfo.textContent = text;
    }
    
    updateZoomDisplay(zoom) {
        const percentage = Math.round(zoom * 20); // Approximate percentage
        this.ui.elements.zoomLevel.textContent = `${percentage}%`;
    }
    
    updateToolUI(tool) {
        this.ui.elements.toolBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tool === tool);
        });
    }
    
    clearResults() {
        this.ui.elements.avgIlluminance.textContent = '-- lux';
        this.ui.elements.minIlluminance.textContent = '-- lux';
        this.ui.elements.maxIlluminance.textContent = '-- lux';
        this.ui.elements.uniformityRatio.textContent = '-- : 1';
        this.ui.elements.complianceStatus.textContent = 'Not Calculated';
        this.ui.elements.complianceStatus.className = 'status-unknown';
    }
    
    // Action handlers
    setView(view) {
        this.canvasManager.view.mode = view;
        
        this.ui.elements.view2DBtn.classList.toggle('active', view === '2d');
        this.ui.elements.view3DBtn.classList.toggle('active', view === '3d');
        
        // Note: 3D view would require additional WebGL implementation
        if (view === '3d') {
            this.showNotification('3D view coming soon!', 'info');
        }
    }
    
    setTool(tool) {
        this.canvasManager.setTool(tool);
    }
    
    setFixtureCategory(category) {
        this.ui.elements.categoryBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        
        this.updateFixtureLibraryUI(category);
    }
    
    selectFixtureType(fixture) {
        // Remove previous selections
        this.ui.elements.fixtureList.querySelectorAll('.fixture-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Select current fixture
        const element = this.ui.elements.fixtureList.querySelector(`[data-fixture-id="${fixture.id}"]`);
        if (element) {
            element.classList.add('selected');
        }
        
        // Set as current fixture template
        this.currentFixtureTemplate = fixture;
        
        // Switch to fixture tool
        this.setTool('fixture');
    }
    
    setStandard(standardId) {
        this.currentStandard = standardId;
        this.ui.elements.lightingStandard.value = standardId;
        this.updateStandardsUI();
        
        // Update project settings
        if (this.currentProject) {
            this.currentProject.settings = this.currentProject.settings || {};
            this.currentProject.settings.standard = standardId;
        }
    }
    
    zoomIn() {
        this.canvasManager.setZoom(this.canvasManager.view.zoom * 1.2);
    }
    
    zoomOut() {
        this.canvasManager.setZoom(this.canvasManager.view.zoom / 1.2);
    }
    
    zoomToFit() {
        this.canvasManager.zoomToFit();
    }
    
    setGridSize(size) {
        const gridSize = parseFloat(size);
        if (gridSize > 0) {
            this.canvasManager.view.gridSize = gridSize;
            this.canvasManager.draw();
        }
    }
    
    toggleSnap() {
        this.canvasManager.view.snapToGrid = !this.canvasManager.view.snapToGrid;
        this.ui.elements.snapBtn.classList.toggle('active', this.canvasManager.view.snapToGrid);
    }
    
    setVisualization(type) {
        // Clear previous visualization
        this.canvasManager.clearVisualization();
        
        // Remove active state from all buttons
        this.ui.elements.vizBtns.forEach(btn => btn.classList.remove('active'));
        
        // If clicking the same button, just clear
        const btn = document.querySelector(`[data-viz="${type}"]`);
        if (btn.classList.contains('active')) {
            return;
        }
        
        // Set active state
        btn.classList.add('active');
        
        // Calculate and show visualization
        this.calculateVisualization(type);
    }
    
    calculateLighting() {
        const fixtures = this.canvasManager.objects.fixtures.map(f => ({
            ...f,
            specifications: f.specifications || {
                power: 1000,
                lumens: 140000,
                beamAngle: { horizontal: 60, vertical: 40 }
            }
        }));
        
        const areas = this.canvasManager.objects.areas;
        
        if (fixtures.length === 0) {
            this.showNotification('Add some fixtures first', 'warning');
            return;
        }
        
        if (areas.length === 0) {
            this.showNotification('Define an area to calculate', 'warning');
            return;
        }
        
        // Use the first area for calculation
        const area = areas[0];
        
        this.ui.elements.calculateBtn.textContent = 'Calculating...';
        this.ui.elements.calculateBtn.disabled = true;
        
        // Perform calculation (async to allow UI update)
        setTimeout(() => {
            try {
                const results = this.lightingCalculator.calculateAreaIlluminance(fixtures, area, 2);
                
                // Update results display
                this.ui.elements.avgIlluminance.textContent = CalqLuxUtils.formatIlluminance(results.average);
                this.ui.elements.minIlluminance.textContent = CalqLuxUtils.formatIlluminance(results.minimum);
                this.ui.elements.maxIlluminance.textContent = CalqLuxUtils.formatIlluminance(results.maximum);
                this.ui.elements.uniformityRatio.textContent = `${results.uniformityRatio} : 1`;
                
                // Check compliance
                const compliance = this.lightingCalculator.checkCompliance(results, this.currentStandard);
                this.ui.elements.complianceStatus.textContent = compliance.compliant ? 'Compliant' : 'Non-compliant';
                this.ui.elements.complianceStatus.className = compliance.compliant ? 'status-compliant' : 'status-non-compliant';
                
                // Store results for visualization
                this.lastResults = results;
                
                this.showNotification('Lighting calculation completed', 'success');
                
            } catch (error) {
                console.error('Calculation error:', error);
                this.showNotification('Error during calculation: ' + error.message, 'error');
            } finally {
                this.ui.elements.calculateBtn.textContent = 'Calculate Lighting';
                this.ui.elements.calculateBtn.disabled = false;
            }
        }, 100);
    }
    
    calculateVisualization(type) {
        if (!this.lastResults) {
            this.showNotification('Run lighting calculation first', 'warning');
            return;
        }
        
        let data = null;
        
        switch (type) {
            case 'isolux':
                data = {
                    contours: this.lightingCalculator.generateIsoluxContours(this.lastResults)
                };
                break;
                
            case '3d-intensity':
                data = this.lastResults;
                break;
                
            case 'glare':
                // Simplified glare analysis
                data = { glareRating: 45 }; // Placeholder
                break;
                
            case 'spillage':
                // Simplified spillage analysis
                const fixtures = this.canvasManager.objects.fixtures;
                const boundaryPoints = []; // Would be calculated from area boundaries
                data = this.lightingCalculator.calculateLightSpillage(fixtures, boundaryPoints);
                break;
        }
        
        if (data) {
            this.canvasManager.setVisualization(type, data);
        }
    }
    
    // Modal management
    showModal(modal) {
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
    }
    
    hideModal(modal) {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }
    
    showProjectModal() {
        this.showModal(this.ui.modals.project);
    }
    
    showExportModal() {
        this.showModal(this.ui.modals.export);
    }
    
    generateReport() {
        this.showNotification('Report generation coming soon!', 'info');
        this.hideModal(this.ui.modals.export);
    }
    
    // Notifications
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '4px',
            color: '#ffffff',
            fontWeight: '600',
            zIndex: '10000',
            maxWidth: '300px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        });
        
        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#27ae60';
                break;
            case 'error':
                notification.style.backgroundColor = '#e74c3c';
                break;
            case 'warning':
                notification.style.backgroundColor = '#f39c12';
                break;
            default:
                notification.style.backgroundColor = '#3498db';
        }
        
        document.body.appendChild(notification);
        
        // Animate in
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.style.transition = 'transform 0.3s ease';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Keyboard shortcuts
    handleKeyboard(event) {
        if (event.target.tagName === 'INPUT') return;
        
        switch (event.key) {
            case 's':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.saveProject();
                }
                break;
            case 'n':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.newProject();
                }
                break;
            case '1':
                this.setTool('select');
                break;
            case '2':
                this.setTool('area');
                break;
            case '3':
                this.setTool('fixture');
                break;
            case '4':
                this.setTool('obstacle');
                break;
            case '5':
                this.setTool('measure');
                break;
        }
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.calqLuxApp = new CalqLuxApp();
    console.log('CalqLux Outdoor application initialized');
});