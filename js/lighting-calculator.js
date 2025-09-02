/**
 * CalqLux Outdoor - Lighting Calculator
 * Advanced lighting calculations for outdoor illumination design
 */

class LightingCalculator {
    constructor() {
        this.standards = this.getLightingStandards();
        this.calculationGrid = {
            spacing: 1, // meters
            points: []
        };
        this.eventEmitter = CalqLuxUtils.createEventEmitter();
    }
    
    getLightingStandards() {
        return {
            fifa: {
                name: 'FIFA Football Standards',
                requirements: {
                    averageIlluminance: { min: 200, recommended: 500, unit: 'lux' },
                    uniformityRatio: { min: 0.5, recommended: 0.7 },
                    verticalIlluminance: { min: 150, recommended: 200, unit: 'lux' },
                    colorTemperature: { min: 5000, max: 6500, unit: 'K' },
                    cri: { min: 65, recommended: 80 },
                    glareRating: { max: 50, unit: 'GR' }
                },
                areas: {
                    playingField: { width: 105, height: 68 }, // meters
                    totalArea: { width: 125, height: 88 }
                }
            },
            uefa: {
                name: 'UEFA Standards',
                requirements: {
                    averageIlluminance: { min: 500, recommended: 800, unit: 'lux' },
                    uniformityRatio: { min: 0.7, recommended: 0.8 },
                    verticalIlluminance: { min: 400, recommended: 600, unit: 'lux' },
                    colorTemperature: { min: 5000, max: 6500, unit: 'K' },
                    cri: { min: 80, recommended: 90 },
                    glareRating: { max: 50, unit: 'GR' }
                },
                areas: {
                    playingField: { width: 105, height: 68 },
                    totalArea: { width: 125, height: 88 }
                }
            },
            ies: {
                name: 'IES Industrial Standards',
                requirements: {
                    averageIlluminance: { min: 50, recommended: 200, unit: 'lux' },
                    uniformityRatio: { min: 0.25, recommended: 0.4 },
                    verticalIlluminance: { min: 25, recommended: 100, unit: 'lux' },
                    colorTemperature: { min: 3000, max: 6500, unit: 'K' },
                    cri: { min: 65, recommended: 80 },
                    glareRating: { max: 55, unit: 'GR' }
                }
            },
            custom: {
                name: 'Custom Requirements',
                requirements: {
                    averageIlluminance: { min: 100, recommended: 300, unit: 'lux' },
                    uniformityRatio: { min: 0.4, recommended: 0.6 },
                    verticalIlluminance: { min: 50, recommended: 150, unit: 'lux' },
                    colorTemperature: { min: 3000, max: 6500, unit: 'K' },
                    cri: { min: 70, recommended: 80 },
                    glareRating: { max: 50, unit: 'GR' }
                }
            }
        };
    }
    
    calculatePointIlluminance(fixtures, point, surfaceReflectance = 0.2) {
        let totalIlluminance = 0;
        
        fixtures.forEach(fixture => {
            const illuminance = this.calculateFixtureContribution(fixture, point);
            totalIlluminance += illuminance;
        });
        
        // Add contribution from reflected light (simplified)
        const reflectedLight = totalIlluminance * surfaceReflectance * 0.1;
        totalIlluminance += reflectedLight;
        
        return Math.max(0, totalIlluminance);
    }
    
    calculateFixtureContribution(fixture, point) {
        // Get fixture specifications
        const specs = fixture.specifications;
        const position = fixture.position;
        const orientation = fixture.orientation || { tilt: 0, rotation: 0 };
        
        // Calculate distance from fixture to point
        const distance = CalqLuxUtils.distance(
            position.x, position.y,
            point.x, point.y
        );
        
        // Calculate height difference
        const heightDiff = position.z - (point.z || 0);
        const actualDistance = Math.sqrt(distance * distance + heightDiff * heightDiff);
        
        if (actualDistance === 0) return 0;
        
        // Calculate angle from fixture to point
        const horizontalAngle = CalqLuxUtils.angle(position.x, position.y, point.x, point.y);
        const verticalAngle = Math.atan2(heightDiff, distance);
        
        // Apply fixture orientation
        const relativeHorizontalAngle = horizontalAngle - CalqLuxUtils.degreesToRadians(orientation.rotation);
        const relativeVerticalAngle = verticalAngle + CalqLuxUtils.degreesToRadians(orientation.tilt);
        
        // Check if point is within beam angle
        const beamHalfAngle = CalqLuxUtils.degreesToRadians(specs.beamAngle.horizontal / 2);
        const verticalBeamHalfAngle = CalqLuxUtils.degreesToRadians(specs.beamAngle.vertical / 2);
        
        if (Math.abs(relativeHorizontalAngle) > beamHalfAngle ||
            Math.abs(relativeVerticalAngle) > verticalBeamHalfAngle) {
            return 0;
        }
        
        // Calculate luminous intensity in direction of point
        const intensity = this.getLuminousIntensity(fixture, relativeHorizontalAngle, relativeVerticalAngle);
        
        // Calculate illuminance using inverse square law
        // E = I * cos(θ) / d²
        const cosTheta = Math.cos(verticalAngle);
        const illuminance = (intensity * cosTheta) / (actualDistance * actualDistance);
        
        return Math.max(0, illuminance);
    }
    
    getLuminousIntensity(fixture, horizontalAngle, verticalAngle) {
        // Simplified photometric distribution
        // In real application, this would use IES photometric data
        
        const specs = fixture.specifications;
        const photometry = fixture.photometry || {};
        const peakIntensity = photometry.peakIntensity || (specs.lumens / 3.14159); // Simplified
        
        // Calculate intensity distribution factors
        const horizontalFactor = this.getDistributionFactor(
            horizontalAngle,
            CalqLuxUtils.degreesToRadians(specs.beamAngle.horizontal / 2)
        );
        
        const verticalFactor = this.getDistributionFactor(
            verticalAngle,
            CalqLuxUtils.degreesToRadians(specs.beamAngle.vertical / 2)
        );
        
        return peakIntensity * horizontalFactor * verticalFactor;
    }
    
    getDistributionFactor(angle, beamHalfAngle) {
        // Simplified cosine distribution
        const normalizedAngle = Math.abs(angle) / beamHalfAngle;
        
        if (normalizedAngle > 1) return 0;
        
        // Cosine distribution with field angle consideration
        return Math.pow(Math.cos(angle), 2);
    }
    
    calculateAreaIlluminance(fixtures, area, gridSpacing = 1) {
        const points = this.generateCalculationGrid(area, gridSpacing);
        const illuminanceValues = [];
        
        points.forEach(point => {
            const illuminance = this.calculatePointIlluminance(fixtures, point);
            illuminanceValues.push(illuminance);
            point.illuminance = illuminance;
        });
        
        const results = this.analyzeIlluminanceValues(illuminanceValues);
        results.points = points;
        results.area = area;
        
        return results;
    }
    
    generateCalculationGrid(area, spacing) {
        const points = [];
        const startX = area.x || 0;
        const startY = area.y || 0;
        const width = area.width;
        const height = area.height;
        
        for (let x = startX; x <= startX + width; x += spacing) {
            for (let y = startY; y <= startY + height; y += spacing) {
                points.push({
                    x: x,
                    y: y,
                    z: area.z || 0
                });
            }
        }
        
        return points;
    }
    
    analyzeIlluminanceValues(values) {
        if (values.length === 0) {
            return {
                average: 0,
                minimum: 0,
                maximum: 0,
                uniformityRatio: 0,
                standardDeviation: 0
            };
        }
        
        const average = CalqLuxUtils.average(values);
        const minimum = Math.min(...values);
        const maximum = Math.max(...values);
        const uniformityRatio = minimum / average;
        const standardDeviation = CalqLuxUtils.standardDeviation(values);
        
        return {
            average: CalqLuxUtils.formatNumber(average, 1),
            minimum: CalqLuxUtils.formatNumber(minimum, 1),
            maximum: CalqLuxUtils.formatNumber(maximum, 1),
            uniformityRatio: CalqLuxUtils.formatNumber(uniformityRatio, 3),
            standardDeviation: CalqLuxUtils.formatNumber(standardDeviation, 1),
            count: values.length
        };
    }
    
    calculateGlareRating(fixtures, observerPosition, viewDirection) {
        // Simplified glare calculation
        // Real implementation would use UGR (Unified Glare Rating) formula
        
        let totalGlareRating = 0;
        
        fixtures.forEach(fixture => {
            const position = fixture.position;
            const specs = fixture.specifications;
            
            // Calculate angle between view direction and fixture
            const fixtureAngle = CalqLuxUtils.angle(
                observerPosition.x, observerPosition.y,
                position.x, position.y
            );
            const angleDiff = Math.abs(fixtureAngle - viewDirection);
            
            // Distance to fixture
            const distance = CalqLuxUtils.distance(
                observerPosition.x, observerPosition.y,
                position.x, position.y
            );
            
            // Luminance of fixture (simplified)
            const luminance = specs.lumens / (specs.dimensions?.width * specs.dimensions?.height / 1000000) || 10000;
            
            // Position index (considers viewing angle)
            const positionIndex = Math.pow(Math.sin(angleDiff), 2);
            
            // Glare contribution
            const glareContribution = (luminance * positionIndex) / (distance * distance);
            totalGlareRating += glareContribution;
        });
        
        // Convert to GR scale (simplified)
        const glareRating = Math.log10(totalGlareRating) * 10;
        
        return CalqLuxUtils.formatNumber(Math.max(0, glareRating), 1);
    }
    
    calculateLightSpillage(fixtures, boundaryPoints) {
        // Calculate light spillage beyond defined boundaries
        const spillagePoints = [];
        
        boundaryPoints.forEach(point => {
            const illuminance = this.calculatePointIlluminance(fixtures, point);
            if (illuminance > 1) { // Threshold for significant spillage
                spillagePoints.push({
                    point: point,
                    illuminance: illuminance
                });
            }
        });
        
        return {
            spillagePoints: spillagePoints,
            maxSpillage: spillagePoints.length > 0 ? Math.max(...spillagePoints.map(p => p.illuminance)) : 0,
            averageSpillage: spillagePoints.length > 0 ? CalqLuxUtils.average(spillagePoints.map(p => p.illuminance)) : 0
        };
    }
    
    checkCompliance(results, standardId) {
        const standard = this.standards[standardId];
        if (!standard) return { compliant: false, issues: ['Unknown standard'] };
        
        const requirements = standard.requirements;
        const issues = [];
        let compliant = true;
        
        // Check average illuminance
        if (results.average < requirements.averageIlluminance.min) {
            issues.push(`Average illuminance ${results.average} lux is below minimum ${requirements.averageIlluminance.min} lux`);
            compliant = false;
        }
        
        // Check uniformity ratio
        if (results.uniformityRatio < requirements.uniformityRatio.min) {
            issues.push(`Uniformity ratio ${results.uniformityRatio} is below minimum ${requirements.uniformityRatio.min}`);
            compliant = false;
        }
        
        return {
            compliant: compliant,
            issues: issues,
            standard: standard.name
        };
    }
    
    generateIsoluxContours(results, contourLevels = [1, 5, 10, 20, 50, 100, 200, 500]) {
        // Generate isolux contour data for visualization
        const points = results.points;
        const contours = [];
        
        contourLevels.forEach(level => {
            const contourPoints = [];
            
            // Find points at or above this illuminance level
            points.forEach(point => {
                if (point.illuminance >= level) {
                    contourPoints.push({
                        x: point.x,
                        y: point.y,
                        value: point.illuminance
                    });
                }
            });
            
            if (contourPoints.length > 0) {
                contours.push({
                    level: level,
                    points: contourPoints,
                    color: CalqLuxUtils.getContourColor(level, contourLevels[0], contourLevels[contourLevels.length - 1])
                });
            }
        });
        
        return contours;
    }
    
    calculatePowerConsumption(fixtures) {
        const totalPower = fixtures.reduce((sum, fixture) => {
            return sum + fixture.specifications.power;
        }, 0);
        
        const operatingHours = 8; // Default 8 hours per day
        const energyPerDay = totalPower * operatingHours / 1000; // kWh
        const energyPerYear = energyPerDay * 365;
        
        // Estimated costs (can be configured)
        const electricityRate = 0.15; // $/kWh
        const operatingCostPerYear = energyPerYear * electricityRate;
        
        return {
            totalPower: CalqLuxUtils.formatNumber(totalPower, 0),
            energyPerDay: CalqLuxUtils.formatNumber(energyPerDay, 1),
            energyPerYear: CalqLuxUtils.formatNumber(energyPerYear, 0),
            operatingCostPerYear: CalqLuxUtils.formatNumber(operatingCostPerYear, 0),
            co2EmissionsPerYear: CalqLuxUtils.formatNumber(energyPerYear * 0.5, 0) // kg CO2 (average grid factor)
        };
    }
    
    optimizeFixtureLayout(area, requirements, availableFixtures) {
        // Simplified optimization algorithm
        // Real implementation would use genetic algorithms or other optimization methods
        
        const targetIlluminance = requirements.averageIlluminance || 200;
        const maxUniformityRatio = requirements.uniformityRatio || 0.4;
        
        // Calculate required total lumens
        const areaSize = area.width * area.height;
        const efficiency = 0.7; // Light loss factor
        const requiredLumens = targetIlluminance * areaSize / efficiency;
        
        // Select fixture type
        const suitableFixtures = availableFixtures.filter(fixture => {
            const mountingHeight = requirements.mountingHeight || 20;
            return mountingHeight >= fixture.specifications.mountingHeight.min &&
                   mountingHeight <= fixture.specifications.mountingHeight.max;
        });
        
        if (suitableFixtures.length === 0) {
            throw new Error('No suitable fixtures found for the requirements');
        }
        
        // Sort by efficacy
        suitableFixtures.sort((a, b) => b.specifications.efficacy - a.specifications.efficacy);
        const selectedFixture = suitableFixtures[0];
        
        // Calculate number of fixtures needed
        const fixtureCount = Math.ceil(requiredLumens / selectedFixture.specifications.lumens);
        
        // Calculate spacing
        const spacingInfo = FixtureLibrary.prototype.calculateFixtureSpacing(
            selectedFixture, targetIlluminance, requirements.mountingHeight || 20
        );
        
        // Generate layout
        const layout = this.generateFixtureGrid(area, fixtureCount, spacingInfo.spacing);
        
        return {
            fixture: selectedFixture,
            count: fixtureCount,
            layout: layout,
            spacing: spacingInfo.spacing,
            estimatedIlluminance: targetIlluminance,
            efficiency: selectedFixture.specifications.efficacy
        };
    }
    
    generateFixtureGrid(area, count, spacing) {
        const positions = [];
        const cols = Math.ceil(Math.sqrt(count * area.width / area.height));
        const rows = Math.ceil(count / cols);
        
        const spacingX = area.width / (cols + 1);
        const spacingY = area.height / (rows + 1);
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (positions.length >= count) break;
                
                positions.push({
                    x: area.x + spacingX * (col + 1),
                    y: area.y + spacingY * (row + 1),
                    z: area.mountingHeight || 20
                });
            }
        }
        
        return positions;
    }
    
    // Event handling
    on(event, callback) {
        this.eventEmitter.on(event, callback);
    }
    
    off(event, callback) {
        this.eventEmitter.off(event, callback);
    }
    
    emit(event, ...args) {
        this.eventEmitter.emit(event, ...args);
    }
}

// Export for use in other modules
window.LightingCalculator = LightingCalculator;