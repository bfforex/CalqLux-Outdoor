# CalqLux Outdoor - Professional Lighting Design Application

A comprehensive HTML-based web application for outdoor lighting design, specifically targeting sports facilities and industrial sites. CalqLux Outdoor provides functionality similar to DIALux for lighting calculations and visualization.

![CalqLux Outdoor](https://img.shields.io/badge/CalqLux-Outdoor-blue?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

## ✨ Features

### Core Functionality
- **Interactive 2D Canvas** - Drawing tools for site layout design with zoom, pan, and rotate controls
- **Comprehensive Fixture Library** - Pre-defined lighting fixtures for sports and industrial applications
- **Advanced Site Design Tools** - Area definition, obstacle placement, and surface material selection
- **Professional Lighting Calculations** - Illuminance, uniformity ratio, glare analysis, and light spillage calculations
- **Standards Compliance** - Support for FIFA, UEFA, IES, and custom lighting standards
- **Real-time Visualization** - Iso-lux contours, 3D light distribution, and glare analysis

### User Interface
- **Modern Design** - Professional dark theme with responsive layout
- **Tool Panels** - Fixture library browser, properties panel, calculation results display
- **Layer Management** - Control visibility of fixtures, areas, obstacles, and grid
- **Project Management** - Save/load projects with local storage support
- **Export Capabilities** - Project files and lighting analysis reports

### Technical Specifications
- **Pure Web Technologies** - HTML5, CSS3, and JavaScript (no external dependencies)
- **Canvas API** - 2D drawing with WebGL foundation for 3D visualization
- **Responsive Design** - Desktop and tablet compatibility
- **Local Storage** - Project persistence and custom fixture library
- **Modern Browser Support** - Compatible with all modern browsers

## 🚀 Quick Start

1. **Clone or download the repository**
   ```bash
   git clone https://github.com/bfforex/CalqLux-Outdoor.git
   cd CalqLux-Outdoor
   ```

2. **Open the application**
   - Simply open `index.html` in a modern web browser
   - No server or build process required

3. **Start designing**
   - Create a new project
   - Define your site area using the area tool
   - Place lighting fixtures from the library
   - Calculate lighting performance
   - Visualize results with iso-lux contours

## 📖 User Guide

### Getting Started

#### Creating Your First Project
1. Click "New" in the header to create a new project
2. Use the area tool (▢) to draw your site boundaries
3. Select fixtures from the library and place them using the fixture tool (💡)
4. Click "Calculate Lighting" to analyze performance
5. Use visualization tools to see light distribution

#### Navigation Controls
- **Mouse wheel** - Zoom in/out
- **Middle click + drag** - Pan the view
- **Ctrl + left click + drag** - Pan the view
- **Left click** - Select objects
- **Shift + click** - Multi-select objects

#### Keyboard Shortcuts
- **Ctrl + S** - Save project
- **Ctrl + N** - New project
- **Ctrl + A** - Select all objects
- **Delete** - Delete selected objects
- **Escape** - Clear selection
- **1-5** - Switch between tools

### Drawing Tools

#### Area Tool (▢)
Define calculation areas for your lighting design:
- Click and drag to create rectangular areas
- Areas represent the zones where lighting calculations will be performed
- Multiple areas can be defined for complex sites

#### Fixture Tool (💡)
Place lighting fixtures on your design:
- Select a fixture type from the library first
- Click to place fixtures at desired locations
- Adjust position, orientation, and mounting height in properties panel

#### Obstacle Tool (🏗)
Add obstructions that affect light distribution:
- Buildings, structures, or other obstacles
- Obstacles block light and create shadows in calculations

#### Measure Tool (📏)
Measure distances on your design:
- Click and drag to measure distances
- Helpful for verifying fixture spacing and dimensions

### Fixture Library

#### Sports Fixtures
- **Stadium Lights** - High-power fixtures for large sports venues
- **Sports Floodlights** - Medium to high-power general sports lighting
- **Area Lights** - Lower-power fixtures for training areas and general illumination

#### Industrial Fixtures
- **Industrial Floodlights** - Heavy-duty fixtures for construction and industrial sites
- **Security Lights** - Perimeter and surveillance lighting
- **High Bay Lights** - Warehouse and industrial hall lighting
- **Tower Lights** - Temporary and emergency lighting solutions

#### Custom Fixtures
- Create your own fixture definitions
- Import fixture libraries from manufacturers
- Export custom fixture collections

### Lighting Standards

#### FIFA Football Standards
- Minimum 200 lux average illuminance
- Uniformity ratio ≥ 0.5
- Vertical illuminance ≥ 150 lux
- Optimized for professional football venues

#### UEFA Standards
- Minimum 500 lux average illuminance
- Uniformity ratio ≥ 0.7
- Enhanced requirements for broadcast venues
- Premium color rendering specifications

#### IES Industrial Standards
- Minimum 50 lux average illuminance
- Uniformity ratio ≥ 0.25
- Safety and security focused requirements
- Energy efficiency considerations

#### Custom Requirements
- Define your own lighting criteria
- Adjustable illuminance and uniformity targets
- Project-specific compliance checking

### Calculations and Analysis

#### Illuminance Calculations
- Point-by-point illuminance calculation using inverse square law
- Accounts for fixture photometry, mounting height, and orientation
- Considers beam angles and light distribution patterns

#### Uniformity Analysis
- Min/average uniformity ratio calculation
- Distribution analysis across calculation grid
- Identifies areas with inadequate lighting

#### Compliance Checking
- Automatic verification against selected standards
- Clear indication of compliant/non-compliant areas
- Detailed reporting of requirement violations

#### Power and Energy Analysis
- Total power consumption calculation
- Estimated annual energy consumption
- Operating cost projections
- CO₂ emissions estimates

### Visualization Tools

#### Iso-lux Contours
- Color-coded illuminance level visualization
- Contour lines showing equal illuminance zones
- Customizable illuminance level ranges

#### 3D Light Distribution
- Three-dimensional representation of light intensity
- Height-based visualization of illuminance values
- Interactive 3D viewing (coming soon)

#### Glare Analysis
- Unified Glare Rating (UGR) calculation
- Visual representation of glare zones
- Observer position and viewing direction considerations

#### Light Spillage Analysis
- Identification of unwanted light beyond boundaries
- Environmental impact assessment
- Light pollution compliance checking

## 🔧 Technical Documentation

### Architecture

#### Component Structure
```
CalqLux Outdoor/
├── index.html              # Main application interface
├── css/
│   └── styles.css          # Responsive styling and themes
├── js/
│   ├── app.js              # Main application controller
│   ├── canvas-manager.js   # 2D/3D canvas operations
│   ├── lighting-calculator.js # Lighting calculation engine
│   ├── fixture-library.js  # Fixture database and management
│   └── utils.js            # Utility functions and helpers
└── README.md               # Documentation
```

#### Core Classes

**CalqLuxApp**
- Main application controller
- Coordinates all components and handles user interactions
- Manages project state and UI updates

**CanvasManager**
- Handles all canvas operations and rendering
- Manages drawing tools and object manipulation
- Provides coordinate transformations and event handling

**LightingCalculator**
- Performs all lighting calculations and analysis
- Implements photometric calculations using inverse square law
- Provides standards compliance checking

**FixtureLibrary**
- Manages the database of lighting fixtures
- Supports custom fixture creation and import/export
- Provides fixture search and recommendation features

**CalqLuxUtils**
- Utility functions for common operations
- Unit conversions, mathematical functions
- File handling and local storage operations

### Data Formats

#### Project File Format
```json
{
  "id": "uuid",
  "name": "Project Name",
  "created": "ISO timestamp",
  "modified": "ISO timestamp",
  "settings": {
    "units": "metric",
    "standard": "fifa"
  },
  "data": {
    "areas": [...],
    "fixtures": [...],
    "obstacles": [...],
    "measurements": [...]
  }
}
```

#### Fixture Definition Format
```json
{
  "id": "unique_id",
  "name": "Fixture Name",
  "category": "sports|industrial|custom",
  "specifications": {
    "power": 1000,
    "lumens": 140000,
    "efficacy": 140,
    "beamAngle": {
      "horizontal": 60,
      "vertical": 40
    },
    "colorTemperature": 5700,
    "cri": 80,
    "mountingHeight": {
      "min": 12,
      "max": 35,
      "recommended": 20
    }
  },
  "photometry": {
    "peakIntensity": 92500,
    "distribution": "type2",
    "cutoffAngle": 75,
    "fieldAngle": 50
  }
}
```

### Browser Compatibility

#### Supported Browsers
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

#### Required Features
- HTML5 Canvas API
- ES6 JavaScript features
- CSS Grid and Flexbox
- Local Storage API
- File API for project import/export

### Performance Considerations

#### Optimization Strategies
- Debounced and throttled event handlers
- Efficient canvas rendering with layer management
- Grid-based calculation optimization
- Local storage for data persistence

#### Memory Management
- Object pooling for frequent calculations
- Cleanup of event listeners and timers
- Efficient data structures for large datasets

## 🛠️ Development

### Extending the Application

#### Adding New Fixture Types
1. Define fixture specification in `fixture-library.js`
2. Add photometric data and distribution patterns
3. Include fixture in appropriate category
4. Update fixture rendering in `canvas-manager.js`

#### Custom Calculation Methods
1. Extend `LightingCalculator` class
2. Implement new calculation algorithms
3. Add visualization support in `CanvasManager`
4. Update UI controls in `app.js`

#### New Lighting Standards
1. Add standard definition to `getLightingStandards()`
2. Define requirements and compliance rules
3. Update standards selection UI
4. Implement compliance checking logic

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

### Code Style

- Use ES6+ JavaScript features
- Follow consistent naming conventions
- Document all public methods and classes
- Maintain responsive design principles
- Test across supported browsers

## 📊 Use Cases

### Sports Facilities
- **Football Stadiums** - Professional and amateur football field lighting
- **Tennis Courts** - Multi-court facility design and analysis
- **Athletics Tracks** - Track and field event lighting
- **Multi-sport Complexes** - Comprehensive facility lighting design

### Industrial Applications
- **Construction Sites** - Temporary lighting for construction projects
- **Cargo Areas** - Port and logistics facility lighting
- **Manufacturing** - Industrial hall and warehouse lighting
- **Security Perimeters** - Surveillance and security lighting

### Design Validation
- **Standards Compliance** - Verify designs meet industry requirements
- **Energy Efficiency** - Optimize power consumption and operating costs
- **Environmental Impact** - Minimize light pollution and spillage
- **Cost Analysis** - Equipment and operational cost estimation

## 🔮 Roadmap

### Version 1.1 (Coming Soon)
- [ ] Full 3D visualization with WebGL
- [ ] IES photometric file import
- [ ] Advanced glare analysis (UGR calculations)
- [ ] PDF report generation
- [ ] Fixture manufacturer integration

### Version 1.2 (Future)
- [ ] Daylight integration analysis
- [ ] Advanced optimization algorithms
- [ ] Cloud project storage
- [ ] Collaborative design features
- [ ] Mobile app version

### Version 2.0 (Long-term)
- [ ] AR/VR visualization
- [ ] IoT integration for smart lighting
- [ ] AI-powered design recommendations
- [ ] Energy simulation and modeling
- [ ] Integration with CAD systems

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, feature requests, or bug reports:

- Create an issue on GitHub
- Contact the development team
- Check the documentation and examples

## 🙏 Acknowledgments

- Lighting calculation algorithms based on IES standards
- UI design inspired by professional CAD applications
- Photometric data courtesy of industry standards
- Icons and graphics from open source libraries

---

**CalqLux Outdoor** - Professional outdoor lighting design made simple and accessible.
