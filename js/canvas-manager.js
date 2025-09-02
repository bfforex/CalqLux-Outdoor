/**
 * CalqLux Outdoor - Canvas Manager
 * Handles 2D/3D canvas operations, drawing, and visualization
 */

class CanvasManager {
    constructor(canvasId, overlayCanvasId) {
        this.canvas = document.getElementById(canvasId);
        this.overlayCanvas = document.getElementById(overlayCanvasId);
        this.ctx = this.canvas.getContext('2d');
        this.overlayCtx = this.overlayCanvas.getContext('2d');
        
        this.view = {
            mode: '2d', // '2d' or '3d'
            zoom: 1,
            panX: 0,
            panY: 0,
            gridSize: 1,
            showGrid: true,
            snapToGrid: true
        };
        
        this.objects = {
            areas: [],
            fixtures: [],
            obstacles: [],
            measurements: []
        };
        
        this.tools = {
            current: 'select',
            drawing: false,
            startPoint: null,
            currentObject: null
        };
        
        this.selection = {
            objects: [],
            box: null
        };
        
        this.visualization = {
            mode: null, // 'isolux', '3d-intensity', 'glare', 'spillage'
            data: null
        };
        
        this.eventEmitter = CalqLuxUtils.createEventEmitter();
        this.setupEventHandlers();
        this.initializeCanvas();
    }
    
    initializeCanvas() {
        this.resizeCanvas();
        this.draw();
        
        // Set initial view to show a reasonable area
        this.view.panX = this.canvas.width / 2;
        this.view.panY = this.canvas.height / 2;
        this.view.zoom = 5; // 5 pixels per meter
    }
    
    setupEventHandlers() {
        // Mouse events
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Keyboard events
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
        
        // Window resize
        window.addEventListener('resize', CalqLuxUtils.debounce(() => {
            this.resizeCanvas();
            this.draw();
        }, 250));
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        const width = rect.width;
        const height = rect.height;
        
        CalqLuxUtils.setCanvasSize(this.canvas, width, height);
        CalqLuxUtils.setCanvasSize(this.overlayCanvas, width, height);
    }
    
    // Coordinate transformations
    worldToScreen(worldX, worldY) {
        return {
            x: (worldX * this.view.zoom) + this.view.panX,
            y: (worldY * this.view.zoom) + this.view.panY
        };
    }
    
    screenToWorld(screenX, screenY) {
        const worldX = (screenX - this.view.panX) / this.view.zoom;
        const worldY = (screenY - this.view.panY) / this.view.zoom;
        
        if (this.view.snapToGrid) {
            return CalqLuxUtils.snapPointToGrid({ x: worldX, y: worldY }, this.view.gridSize);
        }
        
        return { x: worldX, y: worldY };
    }
    
    // Drawing methods
    draw() {
        this.clearCanvas();
        
        // Save context
        this.ctx.save();
        
        // Apply transformations
        this.ctx.translate(this.view.panX, this.view.panY);
        this.ctx.scale(this.view.zoom, this.view.zoom);
        
        // Draw grid
        if (this.view.showGrid) {
            this.drawGrid();
        }
        
        // Draw objects in order
        this.drawAreas();
        this.drawObstacles();
        this.drawFixtures();
        this.drawMeasurements();
        
        // Draw visualization overlays
        this.drawVisualization();
        
        // Restore context
        this.ctx.restore();
        
        // Draw UI elements (in screen coordinates)
        this.drawSelection();
        this.drawToolPreview();
    }
    
    clearCanvas() {
        CalqLuxUtils.clearCanvas(this.canvas);
        CalqLuxUtils.clearCanvas(this.overlayCanvas);
    }
    
    drawGrid() {
        const gridSize = this.view.gridSize;
        const bounds = this.getVisibleBounds();
        
        this.ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
        this.ctx.lineWidth = 1 / this.view.zoom;
        
        // Vertical lines
        for (let x = Math.floor(bounds.left / gridSize) * gridSize; x <= bounds.right; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, bounds.top);
            this.ctx.lineTo(x, bounds.bottom);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = Math.floor(bounds.top / gridSize) * gridSize; y <= bounds.bottom; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(bounds.left, y);
            this.ctx.lineTo(bounds.right, y);
            this.ctx.stroke();
        }
        
        // Origin lines
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 2 / this.view.zoom;
        
        // X-axis
        this.ctx.beginPath();
        this.ctx.moveTo(bounds.left, 0);
        this.ctx.lineTo(bounds.right, 0);
        this.ctx.stroke();
        
        // Y-axis
        this.ctx.beginPath();
        this.ctx.moveTo(0, bounds.top);
        this.ctx.lineTo(0, bounds.bottom);
        this.ctx.stroke();
    }
    
    drawAreas() {
        this.objects.areas.forEach(area => {
            this.ctx.fillStyle = area.selected ? 'rgba(52, 152, 219, 0.3)' : 'rgba(46, 204, 113, 0.2)';
            this.ctx.strokeStyle = area.selected ? '#3498db' : '#2ecc71';
            this.ctx.lineWidth = 2 / this.view.zoom;
            
            if (area.type === 'rectangle') {
                this.ctx.fillRect(area.x, area.y, area.width, area.height);
                this.ctx.strokeRect(area.x, area.y, area.width, area.height);
            } else if (area.type === 'circle') {
                this.ctx.beginPath();
                this.ctx.arc(area.x, area.y, area.radius, 0, 2 * Math.PI);
                this.ctx.fill();
                this.ctx.stroke();
            } else if (area.type === 'polygon') {
                this.ctx.beginPath();
                area.points.forEach((point, index) => {
                    if (index === 0) {
                        this.ctx.moveTo(point.x, point.y);
                    } else {
                        this.ctx.lineTo(point.x, point.y);
                    }
                });
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
            }
            
            // Draw label
            this.drawLabel(area.name || 'Area', area.x, area.y);
        });
    }
    
    drawFixtures() {
        this.objects.fixtures.forEach(fixture => {
            const size = 2; // meters
            const halfSize = size / 2;
            
            this.ctx.fillStyle = fixture.selected ? '#f39c12' : '#e74c3c';
            this.ctx.strokeStyle = fixture.selected ? '#d68910' : '#c0392b';
            this.ctx.lineWidth = 2 / this.view.zoom;
            
            // Draw fixture body
            this.ctx.fillRect(
                fixture.position.x - halfSize,
                fixture.position.y - halfSize,
                size, size
            );
            this.ctx.strokeRect(
                fixture.position.x - halfSize,
                fixture.position.y - halfSize,
                size, size
            );
            
            // Draw beam indication
            if (fixture.specifications && fixture.specifications.beamAngle) {
                this.drawBeamIndicator(fixture);
            }
            
            // Draw label
            this.drawLabel(fixture.name || 'Fixture', 
                fixture.position.x, fixture.position.y - halfSize - 1);
        });
    }
    
    drawBeamIndicator(fixture) {
        const pos = fixture.position;
        const beamAngle = CalqLuxUtils.degreesToRadians(fixture.specifications.beamAngle.horizontal);
        const beamLength = 10; // meters
        const orientation = fixture.orientation || { rotation: 0 };
        
        this.ctx.strokeStyle = 'rgba(241, 196, 15, 0.6)';
        this.ctx.lineWidth = 1 / this.view.zoom;
        
        // Calculate beam edges
        const centerAngle = CalqLuxUtils.degreesToRadians(orientation.rotation);
        const leftAngle = centerAngle - beamAngle / 2;
        const rightAngle = centerAngle + beamAngle / 2;
        
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
        this.ctx.lineTo(
            pos.x + Math.cos(leftAngle) * beamLength,
            pos.y + Math.sin(leftAngle) * beamLength
        );
        this.ctx.moveTo(pos.x, pos.y);
        this.ctx.lineTo(
            pos.x + Math.cos(rightAngle) * beamLength,
            pos.y + Math.sin(rightAngle) * beamLength
        );
        this.ctx.stroke();
        
        // Draw beam arc
        this.ctx.beginPath();
        this.ctx.arc(pos.x, pos.y, beamLength, leftAngle, rightAngle);
        this.ctx.stroke();
    }
    
    drawObstacles() {
        this.objects.obstacles.forEach(obstacle => {
            this.ctx.fillStyle = obstacle.selected ? 'rgba(155, 89, 182, 0.8)' : 'rgba(127, 140, 141, 0.8)';
            this.ctx.strokeStyle = obstacle.selected ? '#9b59b6' : '#7f8c8d';
            this.ctx.lineWidth = 2 / this.view.zoom;
            
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            this.ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            
            // Draw label
            this.drawLabel(obstacle.name || 'Obstacle', obstacle.x, obstacle.y);
        });
    }
    
    drawMeasurements() {
        this.objects.measurements.forEach(measurement => {
            this.ctx.strokeStyle = '#f1c40f';
            this.ctx.lineWidth = 2 / this.view.zoom;
            
            // Draw measurement line
            this.ctx.beginPath();
            this.ctx.moveTo(measurement.start.x, measurement.start.y);
            this.ctx.lineTo(measurement.end.x, measurement.end.y);
            this.ctx.stroke();
            
            // Draw end markers
            const markerSize = 0.5; // meters
            this.drawMarker(measurement.start, markerSize);
            this.drawMarker(measurement.end, markerSize);
            
            // Draw distance label
            const midX = (measurement.start.x + measurement.end.x) / 2;
            const midY = (measurement.start.y + measurement.end.y) / 2;
            const distance = CalqLuxUtils.distance(
                measurement.start.x, measurement.start.y,
                measurement.end.x, measurement.end.y
            );
            
            this.drawLabel(CalqLuxUtils.formatMeasurement(distance), midX, midY);
        });
    }
    
    drawMarker(point, size) {
        this.ctx.fillStyle = '#f1c40f';
        this.ctx.fillRect(point.x - size/2, point.y - size/2, size, size);
    }
    
    drawLabel(text, x, y) {
        this.ctx.save();
        this.ctx.resetTransform();
        
        const screenPos = this.worldToScreen(x, y);
        
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.font = '12px Arial';
        
        const metrics = this.ctx.measureText(text);
        const padding = 4;
        
        this.ctx.fillRect(
            screenPos.x - metrics.width/2 - padding,
            screenPos.y - 8 - padding,
            metrics.width + padding * 2,
            16 + padding * 2
        );
        
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(text, screenPos.x, screenPos.y + 4);
        
        this.ctx.restore();
    }
    
    drawVisualization() {
        if (!this.visualization.mode || !this.visualization.data) return;
        
        switch (this.visualization.mode) {
            case 'isolux':
                this.drawIsoluxContours();
                break;
            case '3d-intensity':
                this.draw3DIntensity();
                break;
            case 'glare':
                this.drawGlareAnalysis();
                break;
            case 'spillage':
                this.drawSpillageAnalysis();
                break;
        }
    }
    
    drawIsoluxContours() {
        const contours = this.visualization.data.contours;
        
        contours.forEach(contour => {
            this.ctx.strokeStyle = CalqLuxUtils.rgbToHex(...contour.color);
            this.ctx.lineWidth = 2 / this.view.zoom;
            this.ctx.globalAlpha = 0.8;
            
            // Draw contour lines (simplified)
            contour.points.forEach((point, index) => {
                if (index === 0) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(point.x, point.y);
                } else {
                    this.ctx.lineTo(point.x, point.y);
                }
            });
            this.ctx.stroke();
        });
        
        this.ctx.globalAlpha = 1;
    }
    
    draw3DIntensity() {
        // Simplified 3D visualization
        const data = this.visualization.data;
        if (!data.points) return;
        
        data.points.forEach(point => {
            if (point.illuminance > 1) {
                const intensity = Math.min(point.illuminance / 100, 1);
                const color = CalqLuxUtils.getContourColor(point.illuminance, 0, 500);
                
                this.ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${intensity * 0.6})`;
                
                const size = intensity * 2; // meters
                this.ctx.fillRect(
                    point.x - size/2,
                    point.y - size/2,
                    size, size
                );
            }
        });
    }
    
    drawGlareAnalysis() {
        // Draw glare zones
        this.objects.fixtures.forEach(fixture => {
            const glareRadius = 20; // meters
            const gradient = this.ctx.createRadialGradient(
                fixture.position.x, fixture.position.y, 0,
                fixture.position.x, fixture.position.y, glareRadius
            );
            
            gradient.addColorStop(0, 'rgba(231, 76, 60, 0.6)');
            gradient.addColorStop(1, 'rgba(231, 76, 60, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(fixture.position.x, fixture.position.y, glareRadius, 0, 2 * Math.PI);
            this.ctx.fill();
        });
    }
    
    drawSpillageAnalysis() {
        const spillage = this.visualization.data;
        if (!spillage.spillagePoints) return;
        
        spillage.spillagePoints.forEach(spill => {
            const intensity = Math.min(spill.illuminance / 50, 1);
            this.ctx.fillStyle = `rgba(231, 76, 60, ${intensity * 0.8})`;
            
            const size = 1; // meters
            this.ctx.fillRect(
                spill.point.x - size/2,
                spill.point.y - size/2,
                size, size
            );
        });
    }
    
    drawSelection() {
        if (!this.selection.box) return;
        
        this.overlayCtx.strokeStyle = '#3498db';
        this.overlayCtx.lineWidth = 1;
        this.overlayCtx.setLineDash([5, 5]);
        
        this.overlayCtx.strokeRect(
            this.selection.box.x,
            this.selection.box.y,
            this.selection.box.width,
            this.selection.box.height
        );
        
        this.overlayCtx.setLineDash([]);
    }
    
    drawToolPreview() {
        if (!this.tools.drawing || !this.tools.startPoint) return;
        
        const currentPos = this.lastMousePosition;
        if (!currentPos) return;
        
        this.overlayCtx.strokeStyle = '#ffffff';
        this.overlayCtx.lineWidth = 2;
        this.overlayCtx.setLineDash([3, 3]);
        
        switch (this.tools.current) {
            case 'area':
                this.overlayCtx.strokeRect(
                    this.tools.startPoint.x,
                    this.tools.startPoint.y,
                    currentPos.x - this.tools.startPoint.x,
                    currentPos.y - this.tools.startPoint.y
                );
                break;
                
            case 'measure':
                this.overlayCtx.beginPath();
                this.overlayCtx.moveTo(this.tools.startPoint.x, this.tools.startPoint.y);
                this.overlayCtx.lineTo(currentPos.x, currentPos.y);
                this.overlayCtx.stroke();
                break;
        }
        
        this.overlayCtx.setLineDash([]);
    }
    
    // Event handlers
    handleMouseDown(event) {
        const pos = CalqLuxUtils.getCanvasCoordinates(this.canvas, event);
        const worldPos = this.screenToWorld(pos.x, pos.y);
        
        this.lastMousePosition = pos;
        
        switch (this.tools.current) {
            case 'select':
                this.handleSelection(worldPos, event.shiftKey);
                break;
                
            case 'area':
            case 'obstacle':
            case 'measure':
                this.tools.drawing = true;
                this.tools.startPoint = pos;
                break;
                
            case 'fixture':
                this.addFixture(worldPos);
                break;
        }
        
        // Pan start
        if (event.button === 1 || (event.button === 0 && event.ctrlKey)) {
            this.panStart = { x: pos.x - this.view.panX, y: pos.y - this.view.panY };
        }
    }
    
    handleMouseMove(event) {
        const pos = CalqLuxUtils.getCanvasCoordinates(this.canvas, event);
        const worldPos = this.screenToWorld(pos.x, pos.y);
        
        this.lastMousePosition = pos;
        
        // Update cursor position display
        this.eventEmitter.emit('cursorMove', worldPos);
        
        // Handle panning
        if (this.panStart) {
            this.view.panX = pos.x - this.panStart.x;
            this.view.panY = pos.y - this.panStart.y;
            this.draw();
            return;
        }
        
        // Handle tool preview
        if (this.tools.drawing) {
            CalqLuxUtils.clearCanvas(this.overlayCanvas);
            this.drawToolPreview();
        }
    }
    
    handleMouseUp(event) {
        const pos = CalqLuxUtils.getCanvasCoordinates(this.canvas, event);
        const worldPos = this.screenToWorld(pos.x, pos.y);
        
        // Handle drawing completion
        if (this.tools.drawing) {
            this.completeDrawing(worldPos);
            this.tools.drawing = false;
            this.tools.startPoint = null;
            CalqLuxUtils.clearCanvas(this.overlayCanvas);
        }
        
        // Reset pan
        this.panStart = null;
    }
    
    handleWheel(event) {
        event.preventDefault();
        
        const pos = CalqLuxUtils.getCanvasCoordinates(this.canvas, event);
        const delta = event.deltaY > 0 ? 0.9 : 1.1;
        
        // Zoom towards cursor position
        const worldBefore = this.screenToWorld(pos.x, pos.y);
        this.view.zoom *= delta;
        this.view.zoom = CalqLuxUtils.clamp(this.view.zoom, 0.1, 50);
        const worldAfter = this.screenToWorld(pos.x, pos.y);
        
        this.view.panX += (worldAfter.x - worldBefore.x) * this.view.zoom;
        this.view.panY += (worldAfter.y - worldBefore.y) * this.view.zoom;
        
        this.draw();
        this.eventEmitter.emit('zoomChanged', this.view.zoom);
    }
    
    handleKeyDown(event) {
        switch (event.key) {
            case 'Delete':
                this.deleteSelected();
                break;
            case 'Escape':
                this.clearSelection();
                break;
            case 'a':
                if (event.ctrlKey) {
                    event.preventDefault();
                    this.selectAll();
                }
                break;
        }
    }
    
    handleKeyUp(event) {
        // Handle key releases if needed
    }
    
    // Object management
    addArea(area) {
        area.id = CalqLuxUtils.generateUUID();
        area.type = area.type || 'rectangle';
        this.objects.areas.push(area);
        this.draw();
        this.eventEmitter.emit('objectAdded', { type: 'area', object: area });
    }
    
    addFixture(position) {
        const fixture = {
            id: CalqLuxUtils.generateUUID(),
            name: 'New Fixture',
            position: { x: position.x, y: position.y, z: 20 },
            orientation: { tilt: 0, rotation: 0 },
            specifications: {
                power: 1000,
                lumens: 140000,
                beamAngle: { horizontal: 60, vertical: 40 }
            }
        };
        
        this.objects.fixtures.push(fixture);
        this.draw();
        this.eventEmitter.emit('objectAdded', { type: 'fixture', object: fixture });
    }
    
    addObstacle(obstacle) {
        obstacle.id = CalqLuxUtils.generateUUID();
        this.objects.obstacles.push(obstacle);
        this.draw();
        this.eventEmitter.emit('objectAdded', { type: 'obstacle', object: obstacle });
    }
    
    addMeasurement(start, end) {
        const measurement = {
            id: CalqLuxUtils.generateUUID(),
            start: start,
            end: end
        };
        
        this.objects.measurements.push(measurement);
        this.draw();
        this.eventEmitter.emit('objectAdded', { type: 'measurement', object: measurement });
    }
    
    completeDrawing(endPos) {
        const startWorld = this.screenToWorld(this.tools.startPoint.x, this.tools.startPoint.y);
        const endWorld = endPos;
        
        switch (this.tools.current) {
            case 'area':
                this.addArea({
                    name: 'New Area',
                    x: Math.min(startWorld.x, endWorld.x),
                    y: Math.min(startWorld.y, endWorld.y),
                    width: Math.abs(endWorld.x - startWorld.x),
                    height: Math.abs(endWorld.y - startWorld.y),
                    type: 'rectangle'
                });
                break;
                
            case 'obstacle':
                this.addObstacle({
                    name: 'New Obstacle',
                    x: Math.min(startWorld.x, endWorld.x),
                    y: Math.min(startWorld.y, endWorld.y),
                    width: Math.abs(endWorld.x - startWorld.x),
                    height: Math.abs(endWorld.y - startWorld.y)
                });
                break;
                
            case 'measure':
                this.addMeasurement(startWorld, endWorld);
                break;
        }
    }
    
    // Selection management
    handleSelection(worldPos, multiSelect = false) {
        const clickedObject = this.getObjectAtPosition(worldPos);
        
        if (!multiSelect) {
            this.clearSelection();
        }
        
        if (clickedObject) {
            clickedObject.selected = true;
            this.selection.objects.push(clickedObject);
            this.eventEmitter.emit('objectSelected', clickedObject);
        }
        
        this.draw();
    }
    
    getObjectAtPosition(worldPos) {
        // Check fixtures first (smallest objects)
        for (const fixture of this.objects.fixtures) {
            const size = 2;
            if (CalqLuxUtils.pointInRectangle(worldPos, {
                x: fixture.position.x - size/2,
                y: fixture.position.y - size/2,
                width: size,
                height: size
            })) {
                return fixture;
            }
        }
        
        // Check obstacles
        for (const obstacle of this.objects.obstacles) {
            if (CalqLuxUtils.pointInRectangle(worldPos, obstacle)) {
                return obstacle;
            }
        }
        
        // Check areas
        for (const area of this.objects.areas) {
            if (area.type === 'rectangle') {
                if (CalqLuxUtils.pointInRectangle(worldPos, area)) {
                    return area;
                }
            } else if (area.type === 'circle') {
                if (CalqLuxUtils.pointInCircle(worldPos, area, area.radius)) {
                    return area;
                }
            }
        }
        
        return null;
    }
    
    clearSelection() {
        this.selection.objects.forEach(obj => obj.selected = false);
        this.selection.objects = [];
        this.draw();
        this.eventEmitter.emit('selectionCleared');
    }
    
    selectAll() {
        const allObjects = [
            ...this.objects.areas,
            ...this.objects.fixtures,
            ...this.objects.obstacles
        ];
        
        allObjects.forEach(obj => {
            obj.selected = true;
            this.selection.objects.push(obj);
        });
        
        this.draw();
        this.eventEmitter.emit('allSelected', this.selection.objects);
    }
    
    deleteSelected() {
        this.selection.objects.forEach(obj => {
            if (obj.position) { // fixture
                const index = this.objects.fixtures.indexOf(obj);
                if (index > -1) this.objects.fixtures.splice(index, 1);
            } else if (obj.radius !== undefined) { // circle area
                const index = this.objects.areas.indexOf(obj);
                if (index > -1) this.objects.areas.splice(index, 1);
            } else if (obj.width !== undefined) { // rectangle (area or obstacle)
                let index = this.objects.areas.indexOf(obj);
                if (index > -1) {
                    this.objects.areas.splice(index, 1);
                } else {
                    index = this.objects.obstacles.indexOf(obj);
                    if (index > -1) this.objects.obstacles.splice(index, 1);
                }
            }
        });
        
        this.clearSelection();
        this.eventEmitter.emit('objectsDeleted');
    }
    
    // View management
    setTool(tool) {
        this.tools.current = tool;
        this.clearSelection();
        this.eventEmitter.emit('toolChanged', tool);
    }
    
    setZoom(zoom) {
        this.view.zoom = CalqLuxUtils.clamp(zoom, 0.1, 50);
        this.draw();
        this.eventEmitter.emit('zoomChanged', this.view.zoom);
    }
    
    zoomToFit() {
        const allObjects = [
            ...this.objects.areas,
            ...this.objects.fixtures,
            ...this.objects.obstacles
        ];
        
        if (allObjects.length === 0) {
            this.view.zoom = 5;
            this.view.panX = this.canvas.width / 2;
            this.view.panY = this.canvas.height / 2;
            this.draw();
            return;
        }
        
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        allObjects.forEach(obj => {
            if (obj.position) { // fixture
                minX = Math.min(minX, obj.position.x - 2);
                minY = Math.min(minY, obj.position.y - 2);
                maxX = Math.max(maxX, obj.position.x + 2);
                maxY = Math.max(maxY, obj.position.y + 2);
            } else { // area or obstacle
                minX = Math.min(minX, obj.x);
                minY = Math.min(minY, obj.y);
                maxX = Math.max(maxX, obj.x + (obj.width || obj.radius * 2));
                maxY = Math.max(maxY, obj.y + (obj.height || obj.radius * 2));
            }
        });
        
        const objectWidth = maxX - minX;
        const objectHeight = maxY - minY;
        const padding = 50; // pixels
        
        const zoomX = (this.canvas.width - padding * 2) / objectWidth;
        const zoomY = (this.canvas.height - padding * 2) / objectHeight;
        
        this.view.zoom = Math.min(zoomX, zoomY);
        this.view.panX = this.canvas.width / 2 - (minX + objectWidth / 2) * this.view.zoom;
        this.view.panY = this.canvas.height / 2 - (minY + objectHeight / 2) * this.view.zoom;
        
        this.draw();
        this.eventEmitter.emit('zoomChanged', this.view.zoom);
    }
    
    setVisualization(mode, data) {
        this.visualization.mode = mode;
        this.visualization.data = data;
        this.draw();
    }
    
    clearVisualization() {
        this.visualization.mode = null;
        this.visualization.data = null;
        this.draw();
    }
    
    getVisibleBounds() {
        const topLeft = this.screenToWorld(0, 0);
        const bottomRight = this.screenToWorld(this.canvas.width, this.canvas.height);
        
        return {
            left: topLeft.x,
            top: topLeft.y,
            right: bottomRight.x,
            bottom: bottomRight.y
        };
    }
    
    // Data export/import
    exportData() {
        return {
            view: { ...this.view },
            objects: CalqLuxUtils.deepClone(this.objects)
        };
    }
    
    importData(data) {
        if (data.view) {
            this.view = { ...this.view, ...data.view };
        }
        
        if (data.objects) {
            this.objects = CalqLuxUtils.deepClone(data.objects);
        }
        
        this.clearSelection();
        this.draw();
        this.eventEmitter.emit('dataImported');
    }
    
    // Event handling
    on(event, callback) {
        this.eventEmitter.on(event, callback);
    }
    
    off(event, callback) {
        this.eventEmitter.off(event, callback);
    }
}

// Export for use in other modules
window.CanvasManager = CanvasManager;