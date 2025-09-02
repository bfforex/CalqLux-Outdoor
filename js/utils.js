/**
 * CalqLux Outdoor - Utility Functions
 * Provides common utility functions for measurements, conversions, and calculations
 */

class CalqLuxUtils {
    
    // Unit conversion functions
    static metersToFeet(meters) {
        return meters * 3.28084;
    }
    
    static feetToMeters(feet) {
        return feet / 3.28084;
    }
    
    static luxToFootCandles(lux) {
        return lux * 0.092903;
    }
    
    static footCandlesToLux(footCandles) {
        return footCandles / 0.092903;
    }
    
    static degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }
    
    static radiansToDegrees(radians) {
        return radians * (180 / Math.PI);
    }
    
    // Distance and geometric calculations
    static distance(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    }
    
    static angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    }
    
    static pointInPolygon(point, polygon) {
        let x = point.x, y = point.y;
        let inside = false;
        
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            if (((polygon[i].y > y) !== (polygon[j].y > y)) &&
                (x < (polygon[j].x - polygon[i].x) * (y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x)) {
                inside = !inside;
            }
        }
        
        return inside;
    }
    
    static pointInCircle(point, center, radius) {
        return this.distance(point.x, point.y, center.x, center.y) <= radius;
    }
    
    static pointInRectangle(point, rect) {
        return point.x >= rect.x && point.x <= rect.x + rect.width &&
               point.y >= rect.y && point.y <= rect.y + rect.height;
    }
    
    // Grid and snapping functions
    static snapToGrid(value, gridSize) {
        return Math.round(value / gridSize) * gridSize;
    }
    
    static snapPointToGrid(point, gridSize) {
        return {
            x: this.snapToGrid(point.x, gridSize),
            y: this.snapToGrid(point.y, gridSize)
        };
    }
    
    // Number formatting
    static formatNumber(number, decimals = 2) {
        return Number(number.toFixed(decimals));
    }
    
    static formatMeasurement(value, unit = 'm', decimals = 2) {
        return `${this.formatNumber(value, decimals)} ${unit}`;
    }
    
    static formatIlluminance(value, unit = 'lux', decimals = 1) {
        return `${this.formatNumber(value, decimals)} ${unit}`;
    }
    
    // Color utilities for visualization
    static interpolateColor(color1, color2, factor) {
        const result = color1.slice();
        for (let i = 0; i < 3; i++) {
            result[i] = Math.round(result[i] + factor * (color2[i] - result[i]));
        }
        return result;
    }
    
    static rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }
    
    // Generate isolux contour colors
    static getContourColor(value, minValue, maxValue) {
        const colorStops = [
            [0, 0, 128],     // Dark blue
            [0, 100, 255],   // Blue
            [0, 255, 255],   // Cyan
            [0, 255, 0],     // Green
            [255, 255, 0],   // Yellow
            [255, 100, 0],   // Orange
            [255, 0, 0]      // Red
        ];
        
        const normalized = (value - minValue) / (maxValue - minValue);
        const index = normalized * (colorStops.length - 1);
        const lowerIndex = Math.floor(index);
        const upperIndex = Math.ceil(index);
        const factor = index - lowerIndex;
        
        if (lowerIndex === upperIndex) {
            return colorStops[lowerIndex];
        }
        
        return this.interpolateColor(colorStops[lowerIndex], colorStops[upperIndex], factor);
    }
    
    // Local storage utilities
    static saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }
    
    static loadFromLocalStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }
    
    static removeFromLocalStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }
    
    // File handling utilities
    static downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    static loadJSONFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }
    
    // Canvas utilities
    static getCanvasCoordinates(canvas, event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }
    
    static clearCanvas(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    static setCanvasSize(canvas, width, height) {
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    }
    
    // Validation utilities
    static isNumber(value) {
        return typeof value === 'number' && !isNaN(value) && isFinite(value);
    }
    
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    
    static isValidRange(value, min, max) {
        return this.isNumber(value) && value >= min && value <= max;
    }
    
    // Array utilities
    static findMinMax(array) {
        if (array.length === 0) return { min: 0, max: 0 };
        return {
            min: Math.min(...array),
            max: Math.max(...array)
        };
    }
    
    static average(array) {
        if (array.length === 0) return 0;
        return array.reduce((sum, value) => sum + value, 0) / array.length;
    }
    
    static standardDeviation(array) {
        if (array.length === 0) return 0;
        const avg = this.average(array);
        const squaredDiffs = array.map(value => Math.pow(value - avg, 2));
        const avgSquaredDiff = this.average(squaredDiffs);
        return Math.sqrt(avgSquaredDiff);
    }
    
    // UUID generation for unique IDs
    static generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    
    // Deep clone objects
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    }
    
    // Debounce function for performance optimization
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Throttle function for performance optimization
    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Event emitter for custom events
    static createEventEmitter() {
        const events = {};
        
        return {
            on(event, callback) {
                if (!events[event]) events[event] = [];
                events[event].push(callback);
            },
            
            off(event, callback) {
                if (!events[event]) return;
                events[event] = events[event].filter(cb => cb !== callback);
            },
            
            emit(event, ...args) {
                if (!events[event]) return;
                events[event].forEach(callback => callback(...args));
            }
        };
    }
}

// Export for use in other modules
window.CalqLuxUtils = CalqLuxUtils;