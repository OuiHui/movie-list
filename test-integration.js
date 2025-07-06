#!/usr/bin/env node

// Simple test to verify the integration
const fs = require('fs');
const path = require('path');

console.log('🎬 Testing Movie Search Integration...\n');

// Check if files exist
const filesToCheck = [
  'frontend/src/App.jsx',
  'frontend/src/components/MovieSearchModal.jsx',
  'frontend/src/services/movieApi.js',
  'frontend/src/components/Header.jsx'
];

let allFilesExist = true;

filesToCheck.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${filePath} - exists`);
  } else {
    console.log(`❌ ${filePath} - missing`);
    allFilesExist = false;
  }
});

// Check if MovieSearchModal is imported in App.jsx
const appPath = path.join(__dirname, 'frontend/src/App.jsx');
if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, 'utf8');
  if (appContent.includes('MovieSearchModal')) {
    console.log('✅ MovieSearchModal imported in App.jsx');
  } else {
    console.log('❌ MovieSearchModal not imported in App.jsx');
    allFilesExist = false;
  }
  
  if (appContent.includes('handleSearchMovies')) {
    console.log('✅ handleSearchMovies function exists');
  } else {
    console.log('❌ handleSearchMovies function missing');
    allFilesExist = false;
  }
  
  if (appContent.includes('isSearchModalOpen')) {
    console.log('✅ isSearchModalOpen state exists');
  } else {
    console.log('❌ isSearchModalOpen state missing');
    allFilesExist = false;
  }
}

// Check if Header has onSearchMovies prop
const headerPath = path.join(__dirname, 'frontend/src/components/Header.jsx');
if (fs.existsSync(headerPath)) {
  const headerContent = fs.readFileSync(headerPath, 'utf8');
  if (headerContent.includes('onSearchMovies')) {
    console.log('✅ onSearchMovies prop exists in Header');
  } else {
    console.log('❌ onSearchMovies prop missing in Header');
    allFilesExist = false;
  }
}

console.log('\n📋 Integration Summary:');
if (allFilesExist) {
  console.log('🎉 All components are properly integrated!');
  console.log('\n📌 Next steps:');
  console.log('1. Add your TMDb API key to .env file');
  console.log('2. Start the development server: npm run dev');
  console.log('3. Test the "Search Movies" button');
} else {
  console.log('⚠️  Some components need attention');
}

console.log('\n🔧 To get a TMDb API key:');
console.log('1. Visit https://www.themoviedb.org/');
console.log('2. Create an account');
console.log('3. Go to Settings > API');
console.log('4. Generate an API key');
console.log('5. Add VITE_TMDB_API_KEY=your_key_here to your .env file');
