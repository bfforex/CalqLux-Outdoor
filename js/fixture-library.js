/**
 * CalqLux Outdoor - Lighting Fixture Library
 * Comprehensive database of sports and industrial lighting fixtures
 */

class FixtureLibrary {
    constructor() {
        this.fixtures = {
            sports: this.getSportsFixtures(),
            industrial: this.getIndustrialFixtures(),
            custom: []
        };
        
        this.currentCategory = 'sports';
        this.eventEmitter = CalqLuxUtils.createEventEmitter();
    }
    
    getSportsFixtures() {
        return [
            {
                id: 'sp_flood_2000w',
                name: 'Sports Floodlight 2000W',
                category: 'sports',
                type: 'flood',
                specifications: {
                    power: 2000, // Watts
                    lumens: 280000, // Lumens
                    efficacy: 140, // lm/W
                    beamAngle: {
                        horizontal: 60,
                        vertical: 40
                    },
                    colorTemperature: 5700, // Kelvin
                    cri: 80,
                    mountingHeight: {
                        min: 15,
                        max: 50,
                        recommended: 25
                    },
                    dimensions: {
                        width: 800,
                        height: 600,
                        depth: 200
                    },
                    weight: 45 // kg
                },
                photometry: {
                    // Simplified photometric distribution
                    // In real application, this would be IES data
                    peakIntensity: 185000, // cd
                    distribution: 'type2', // IESNA distribution type
                    cutoffAngle: 80,
                    fieldAngle: 60
                },
                applications: ['football', 'soccer', 'athletics', 'general sports'],
                manufacturer: 'CalqLux Sports',
                model: 'CSF-2000-LED',
                price: 2500,
                icon: '💡'
            },
            {
                id: 'sp_flood_1000w',
                name: 'Sports Floodlight 1000W',
                category: 'sports',
                type: 'flood',
                specifications: {
                    power: 1000,
                    lumens: 140000,
                    efficacy: 140,
                    beamAngle: {
                        horizontal: 50,
                        vertical: 35
                    },
                    colorTemperature: 5700,
                    cri: 80,
                    mountingHeight: {
                        min: 12,
                        max: 35,
                        recommended: 20
                    },
                    dimensions: {
                        width: 600,
                        height: 450,
                        depth: 150
                    },
                    weight: 28
                },
                photometry: {
                    peakIntensity: 92500,
                    distribution: 'type2',
                    cutoffAngle: 75,
                    fieldAngle: 50
                },
                applications: ['tennis', 'basketball', 'volleyball', 'small fields'],
                manufacturer: 'CalqLux Sports',
                model: 'CSF-1000-LED',
                price: 1800,
                icon: '💡'
            },
            {
                id: 'sp_stadium_4000w',
                name: 'Stadium Light 4000W',
                category: 'sports',
                type: 'stadium',
                specifications: {
                    power: 4000,
                    lumens: 600000,
                    efficacy: 150,
                    beamAngle: {
                        horizontal: 80,
                        vertical: 50
                    },
                    colorTemperature: 5700,
                    cri: 85,
                    mountingHeight: {
                        min: 25,
                        max: 80,
                        recommended: 45
                    },
                    dimensions: {
                        width: 1200,
                        height: 800,
                        depth: 300
                    },
                    weight: 95
                },
                photometry: {
                    peakIntensity: 400000,
                    distribution: 'type3',
                    cutoffAngle: 85,
                    fieldAngle: 80
                },
                applications: ['football stadium', 'large athletics', 'cricket', 'baseball'],
                manufacturer: 'CalqLux Stadium',
                model: 'CSL-4000-PRO',
                price: 8500,
                icon: '🏟️'
            },
            {
                id: 'sp_area_500w',
                name: 'Area Light 500W',
                category: 'sports',
                type: 'area',
                specifications: {
                    power: 500,
                    lumens: 70000,
                    efficacy: 140,
                    beamAngle: {
                        horizontal: 120,
                        vertical: 90
                    },
                    colorTemperature: 4000,
                    cri: 80,
                    mountingHeight: {
                        min: 8,
                        max: 20,
                        recommended: 12
                    },
                    dimensions: {
                        width: 400,
                        height: 300,
                        depth: 100
                    },
                    weight: 15
                },
                photometry: {
                    peakIntensity: 25000,
                    distribution: 'type5',
                    cutoffAngle: 90,
                    fieldAngle: 120
                },
                applications: ['training areas', 'walkways', 'parking', 'general illumination'],
                manufacturer: 'CalqLux General',
                model: 'CGL-500-LED',
                price: 650,
                icon: '🔆'
            }
        ];
    }
    
    getIndustrialFixtures() {
        return [
            {
                id: 'in_flood_3000w',
                name: 'Industrial Floodlight 3000W',
                category: 'industrial',
                type: 'flood',
                specifications: {
                    power: 3000,
                    lumens: 420000,
                    efficacy: 140,
                    beamAngle: {
                        horizontal: 70,
                        vertical: 45
                    },
                    colorTemperature: 5000,
                    cri: 70,
                    mountingHeight: {
                        min: 20,
                        max: 60,
                        recommended: 35
                    },
                    dimensions: {
                        width: 1000,
                        height: 700,
                        depth: 250
                    },
                    weight: 65
                },
                photometry: {
                    peakIntensity: 280000,
                    distribution: 'type2',
                    cutoffAngle: 80,
                    fieldAngle: 70
                },
                applications: ['construction sites', 'industrial yards', 'cargo areas', 'mining'],
                manufacturer: 'CalqLux Industrial',
                model: 'CIF-3000-HD',
                price: 4200,
                icon: '🏗️'
            },
            {
                id: 'in_security_200w',
                name: 'Security Light 200W',
                category: 'industrial',
                type: 'security',
                specifications: {
                    power: 200,
                    lumens: 28000,
                    efficacy: 140,
                    beamAngle: {
                        horizontal: 110,
                        vertical: 80
                    },
                    colorTemperature: 6500,
                    cri: 70,
                    mountingHeight: {
                        min: 5,
                        max: 15,
                        recommended: 8
                    },
                    dimensions: {
                        width: 300,
                        height: 200,
                        depth: 80
                    },
                    weight: 8
                },
                photometry: {
                    peakIntensity: 12000,
                    distribution: 'type4',
                    cutoffAngle: 85,
                    fieldAngle: 110
                },
                applications: ['perimeter security', 'entrance lighting', 'surveillance areas'],
                manufacturer: 'CalqLux Security',
                model: 'CSL-200-SEC',
                price: 420,
                icon: '🔒'
            },
            {
                id: 'in_highbay_400w',
                name: 'High Bay 400W',
                category: 'industrial',
                type: 'highbay',
                specifications: {
                    power: 400,
                    lumens: 56000,
                    efficacy: 140,
                    beamAngle: {
                        horizontal: 90,
                        vertical: 90
                    },
                    colorTemperature: 5000,
                    cri: 80,
                    mountingHeight: {
                        min: 10,
                        max: 25,
                        recommended: 15
                    },
                    dimensions: {
                        width: 350,
                        height: 350,
                        depth: 200
                    },
                    weight: 18
                },
                photometry: {
                    peakIntensity: 28000,
                    distribution: 'type5',
                    cutoffAngle: 90,
                    fieldAngle: 90
                },
                applications: ['warehouses', 'industrial halls', 'manufacturing'],
                manufacturer: 'CalqLux Industrial',
                model: 'CIH-400-LED',
                price: 580,
                icon: '🏭'
            },
            {
                id: 'in_tower_1500w',
                name: 'Tower Light 1500W',
                category: 'industrial',
                type: 'tower',
                specifications: {
                    power: 1500,
                    lumens: 210000,
                    efficacy: 140,
                    beamAngle: {
                        horizontal: 360,
                        vertical: 60
                    },
                    colorTemperature: 5000,
                    cri: 70,
                    mountingHeight: {
                        min: 15,
                        max: 50,
                        recommended: 30
                    },
                    dimensions: {
                        width: 600,
                        height: 600,
                        depth: 400
                    },
                    weight: 55
                },
                photometry: {
                    peakIntensity: 140000,
                    distribution: 'type5',
                    cutoffAngle: 80,
                    fieldAngle: 360
                },
                applications: ['construction towers', 'emergency lighting', 'temporary installations'],
                manufacturer: 'CalqLux Tower',
                model: 'CTL-1500-360',
                price: 3200,
                icon: '📡'
            }
        ];
    }
    
    getFixturesByCategory(category) {
        return this.fixtures[category] || [];
    }
    
    getAllFixtures() {
        const allFixtures = [];
        Object.values(this.fixtures).forEach(categoryFixtures => {
            allFixtures.push(...categoryFixtures);
        });
        return allFixtures;
    }
    
    getFixtureById(id) {
        const allFixtures = this.getAllFixtures();
        return allFixtures.find(fixture => fixture.id === id);
    }
    
    addCustomFixture(fixture) {
        // Validate fixture data
        if (!this.validateFixture(fixture)) {
            throw new Error('Invalid fixture data');
        }
        
        // Generate unique ID if not provided
        if (!fixture.id) {
            fixture.id = 'custom_' + CalqLuxUtils.generateUUID();
        }
        
        fixture.category = 'custom';
        this.fixtures.custom.push(fixture);
        
        // Save to localStorage
        this.saveCustomFixtures();
        
        // Emit event
        this.eventEmitter.emit('fixtureAdded', fixture);
        
        return fixture.id;
    }
    
    removeCustomFixture(id) {
        const index = this.fixtures.custom.findIndex(fixture => fixture.id === id);
        if (index !== -1) {
            const removedFixture = this.fixtures.custom.splice(index, 1)[0];
            this.saveCustomFixtures();
            this.eventEmitter.emit('fixtureRemoved', removedFixture);
            return true;
        }
        return false;
    }
    
    validateFixture(fixture) {
        const required = ['name', 'specifications'];
        const specRequired = ['power', 'lumens', 'beamAngle', 'mountingHeight'];
        
        // Check required top-level properties
        for (const prop of required) {
            if (!fixture[prop]) {
                console.error(`Missing required property: ${prop}`);
                return false;
            }
        }
        
        // Check required specification properties
        for (const prop of specRequired) {
            if (!fixture.specifications[prop]) {
                console.error(`Missing required specification: ${prop}`);
                return false;
            }
        }
        
        // Validate numeric values
        if (!CalqLuxUtils.isNumber(fixture.specifications.power) || fixture.specifications.power <= 0) {
            console.error('Invalid power specification');
            return false;
        }
        
        if (!CalqLuxUtils.isNumber(fixture.specifications.lumens) || fixture.specifications.lumens <= 0) {
            console.error('Invalid lumens specification');
            return false;
        }
        
        return true;
    }
    
    searchFixtures(query, category = null) {
        let fixtures = category ? this.getFixturesByCategory(category) : this.getAllFixtures();
        
        if (!query) return fixtures;
        
        query = query.toLowerCase();
        return fixtures.filter(fixture => {
            return fixture.name.toLowerCase().includes(query) ||
                   fixture.model?.toLowerCase().includes(query) ||
                   fixture.manufacturer?.toLowerCase().includes(query) ||
                   fixture.applications?.some(app => app.toLowerCase().includes(query));
        });
    }
    
    getFixtureRecommendations(application, area, mountingHeight) {
        const allFixtures = this.getAllFixtures();
        
        return allFixtures.filter(fixture => {
            // Check application match
            const appMatch = fixture.applications?.some(app => 
                app.toLowerCase().includes(application.toLowerCase())
            );
            
            // Check mounting height compatibility
            const heightMatch = mountingHeight >= fixture.specifications.mountingHeight.min &&
                              mountingHeight <= fixture.specifications.mountingHeight.max;
            
            // Calculate if power is appropriate for area
            const powerDensity = fixture.specifications.power / area;
            const appropriatePower = powerDensity >= 0.5 && powerDensity <= 50; // W/m²
            
            return appMatch && heightMatch && appropriatePower;
        }).sort((a, b) => {
            // Sort by efficacy (higher is better)
            return b.specifications.efficacy - a.specifications.efficacy;
        });
    }
    
    calculateFixtureSpacing(fixture, targetIlluminance, mountingHeight) {
        // Simplified spacing calculation
        // In real application, this would use proper photometric calculations
        
        const lumens = fixture.specifications.lumens;
        const efficiency = 0.7; // Typical light loss factor
        const usableLumens = lumens * efficiency;
        
        // Calculate area that can be illuminated
        const illuminatedArea = usableLumens / targetIlluminance;
        
        // Estimate spacing based on mounting height and beam angle
        const beamAngle = CalqLuxUtils.degreesToRadians(fixture.specifications.beamAngle.horizontal);
        const lightCircleDiameter = 2 * mountingHeight * Math.tan(beamAngle / 2);
        
        // Conservative spacing (70% of light circle diameter)
        const spacing = lightCircleDiameter * 0.7;
        
        return {
            spacing: spacing,
            area: illuminatedArea,
            lightCircleDiameter: lightCircleDiameter
        };
    }
    
    saveCustomFixtures() {
        CalqLuxUtils.saveToLocalStorage('calqlux_custom_fixtures', this.fixtures.custom);
    }
    
    loadCustomFixtures() {
        const saved = CalqLuxUtils.loadFromLocalStorage('calqlux_custom_fixtures');
        if (saved && Array.isArray(saved)) {
            this.fixtures.custom = saved;
        }
    }
    
    exportFixtures(category = null) {
        const fixtures = category ? this.getFixturesByCategory(category) : this.getAllFixtures();
        const exportData = {
            exportDate: new Date().toISOString(),
            application: 'CalqLux Outdoor',
            version: '1.0.0',
            fixtures: fixtures
        };
        
        CalqLuxUtils.downloadJSON(exportData, `calqlux_fixtures_${category || 'all'}.json`);
    }
    
    importFixtures(file) {
        return CalqLuxUtils.loadJSONFile(file).then(data => {
            if (!data.fixtures || !Array.isArray(data.fixtures)) {
                throw new Error('Invalid fixture file format');
            }
            
            let importCount = 0;
            data.fixtures.forEach(fixture => {
                try {
                    if (this.validateFixture(fixture)) {
                        this.addCustomFixture(fixture);
                        importCount++;
                    }
                } catch (error) {
                    console.warn('Failed to import fixture:', fixture.name, error);
                }
            });
            
            return importCount;
        });
    }
    
    // Event handling
    on(event, callback) {
        this.eventEmitter.on(event, callback);
    }
    
    off(event, callback) {
        this.eventEmitter.off(event, callback);
    }
}

// Initialize and export
window.FixtureLibrary = FixtureLibrary;