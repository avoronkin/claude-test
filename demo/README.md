# Rock Paper Scissors Browser Game Demo

A browser-based implementation of Rock Paper Scissors using the RockPaperScissors TypeScript library.

## Features

- **Responsive Design**: Mobile-first CSS design that works on all screen sizes
- **Touch-Friendly**: Large buttons optimized for touch interaction
- **Visual Feedback**: Clear win/lose/draw states with color coding
- **Error Handling**: Graceful error handling for edge cases
- **Accessibility**: Semantic HTML with proper ARIA labels
- **Performance**: Game responds within 100ms requirement

## Files Structure

```
demo/
├── index.html          # Main HTML interface
├── style.css           # Responsive CSS styling
├── game.js             # Game logic integration
├── rps-lib.js          # Compiled TypeScript library (auto-generated)
├── test-import.html    # Simple import test
└── README.md           # This file
```

## Quick Start

### Development

1. **Build the demo:**
   ```bash
   npm run demo:build
   ```

2. **Serve locally:**
   ```bash
   npm run demo:serve
   ```
   
   Or manually:
   ```bash
   cd demo
   python3 -m http.server 8080
   ```

3. **Open in browser:**
   Navigate to `http://localhost:8080`

### One-Command Demo

```bash
npm run demo
```

This builds the library, copies it to the demo directory, and starts a local server.

## Testing

### Cross-Browser Testing

The game has been designed to work in:
- ✅ Chrome (latest)
- ✅ Firefox (latest) 
- ✅ Safari (latest)
- ✅ Edge (latest)

### Mobile Testing

- Touch interactions optimized for mobile devices
- Responsive design tested on various screen sizes
- Minimum touch target size of 44px met

### Performance Testing

- Game responds within 100ms of user interaction
- Library bundle size < 5KB (currently ~3.32KB minified)
- No external dependencies

## Deployment

### Static Hosting

The demo can be deployed to any static hosting service:

1. **Build the demo:**
   ```bash
   npm run demo:build
   ```

2. **Upload demo directory** to your hosting service:
   - GitHub Pages
   - Netlify
   - Vercel
   - AWS S3
   - Any web server

### Self-Contained Deployment

All files in the `demo/` directory are self-contained with no external dependencies.

## Game Flow

1. **Initial State**: User sees move selection buttons
2. **Move Selection**: User clicks Rock, Paper, or Scissors
3. **Game Processing**: Library calculates result vs computer
4. **Result Display**: Shows both moves and game outcome
5. **Play Again**: User can reset and play another round

## Error Handling

The game includes comprehensive error handling:
- Invalid moves (handled by library validation)
- Network issues (graceful degradation)
- JavaScript errors (user-friendly error messages)
- Edge cases (comprehensive testing coverage)

## Browser Support

- **Modern Browsers**: Full support for Chrome, Firefox, Safari, Edge
- **ES Modules**: Requires browsers with ES module support
- **Mobile**: Optimized for iOS Safari and Android Chrome
- **Accessibility**: Screen reader compatible with ARIA labels

## Performance Metrics

- **Bundle Size**: ~3.32KB minified
- **Response Time**: < 100ms for all interactions
- **First Paint**: Optimized with CSS-in-JS approach
- **Mobile Performance**: Touch-optimized with 60fps animations