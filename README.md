# ScanMarket 🛒

**Smart Receipt Scanner & Product Analyzer**

ScanMarket is a React Native/Expo application that allows users to scan supermarket receipts using OCR technology and get detailed product information.

## ✨ Features

### 📱 Mobile App (Android/iOS)
- **Receipt Scanning**: Take photos of receipts or select from gallery
- **OCR Processing**: Extract text from receipt images using OCR.space API
- **Product Analysis**: Get detailed product information from OpenFoodFacts API
- **Offline Support**: Works with cached data when offline
- **Material Design**: Beautiful UI using React Native Paper

### 🌐 Web App
- **Camera Support**: Direct camera access for web users
- **Responsive Design**: Works on desktop and mobile browsers
- **Progressive Web App**: Can be installed as PWA
- **Cross-platform**: Same codebase for mobile and web

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, Mac only)

### Installation

```bash
# Clone the repository
git clone https://github.com/mobinalkhn/last.git
cd last

# Install dependencies
npm install

# Start development server
npm start
```

### Build Commands

```bash
# Web development
npm run web

# Android development
npm run android

# iOS development  
npm run ios

# Build for web deployment
npm run build:web

# Deploy to GitHub Pages
npm run deploy:gh
```

## 📱 Mobile App Build

### Android APK
```bash
# Build preview APK
npx eas build --platform android --profile preview

# Build production APK
npx eas build --platform android --profile production
```

### iOS Build
```bash
# Build for iOS
npx eas build --platform ios
```

## 🌐 Web Deployment

The web version is automatically deployed to:
- **GitHub Pages**: https://mobinalkhn.github.io/last
- **Netlify**: Can be deployed via drag-and-drop

### Manual Deployment
1. Run `npm run build:web`
2. Upload contents of `dist/` folder to your hosting provider
3. Ensure `.htaccess` file is included for proper routing

## 🛠️ Technology Stack

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **React Native Paper**: Material Design components
- **Expo Router**: File-based navigation system
- **TypeScript**: Type-safe development

### APIs & Services
- **OCR.space API**: Optical Character Recognition
- **OpenFoodFacts API**: Product information database
- **Expo Camera**: Camera functionality
- **Expo Image Picker**: Image selection

### Build & Deployment
- **Metro Bundler**: JavaScript bundler
- **EAS Build**: Cloud build service
- **GitHub Pages**: Web hosting
- **Netlify**: Alternative web hosting

## 📁 Project Structure

```
├── app/                    # Expo Router pages
│   ├── index.tsx          # Main scanner screen
│   ├── modal.tsx          # Modal screen
│   └── (tabs)/            # Tab navigation
├── components/            # Reusable components
│   ├── ReceiptScanner.tsx # Main scanner component
│   ├── ProductDetails.tsx # Product information display
│   └── ui/                # UI components
├── assets/               # Images and icons
├── constants/            # App constants and themes
├── hooks/                # Custom React hooks
├── scripts/              # Build and utility scripts
├── app.json              # Expo configuration
├── package.json          # Dependencies and scripts
├── metro.config.js       # Metro bundler configuration
├── netlify.toml          # Netlify deployment config
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables
- `OCR_SPACE_API_KEY`: Your OCR.space API key
- `GOOGLE_VISION_API_KEY`: Google Vision API key (optional)

### API Keys Setup
1. Get free API key from [OCR.space](https://ocr.space/ocrapi)
2. Add to `app.json` in the `extra` section
3. Use in components via `Constants.expoConfig.extra`

## 📱 App Features Explained

### Receipt Scanning Process
1. **Image Capture**: User takes photo or selects from gallery
2. **OCR Processing**: Image sent to OCR.space API for text extraction
3. **Text Analysis**: Extracted text parsed to identify products
4. **Product Lookup**: Products searched in OpenFoodFacts database
5. **Results Display**: Product information shown with images and details

### Web-Specific Features
- **Camera Integration**: Direct camera access via web APIs
- **File Upload**: Drag-and-drop image upload
- **Responsive Layout**: Adapts to different screen sizes
- **PWA Features**: Can be installed as standalone app

## 🎨 UI/UX Design

### Design System
- **Material Design 3**: Modern Google design language
- **Color Scheme**: Purple primary with complementary colors
- **Typography**: Roboto font family
- **Icons**: Material Design icons via Expo Vector Icons

### Accessibility
- **Screen Reader Support**: Proper ARIA labels
- **High Contrast**: Sufficient color contrast ratios
- **Touch Targets**: Minimum 44px touch targets
- **Keyboard Navigation**: Full keyboard support

## 🔒 Security & Privacy

### Data Handling
- **No Data Storage**: Images processed in memory only
- **API Security**: Secure HTTPS connections
- **Privacy First**: No personal data collection
- **Open Source**: Full transparency

## 🚀 Deployment Guide

### GitHub Pages (Current)
1. Automatic deployment via GitHub Actions
2. Available at: https://mobinalkhn.github.io/last
3. Updates automatically on main branch push

### Netlify (Alternative)
1. Connect GitHub repository to Netlify
2. Build command: `npm run build:web`
3. Publish directory: `dist`
4. Automatic SSL and CDN

### Custom Hosting
1. Build with `npm run build:web`
2. Upload `dist/` contents to web server
3. Configure web server for SPA routing
4. Ensure `.htaccess` or equivalent is set up

## 📧 Support & Contact

- **GitHub Issues**: Report bugs and feature requests
- **Developer**: mobinalkhn
- **License**: MIT

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using React Native & Expo**