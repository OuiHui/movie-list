// Quick test script to verify TMDb API integration
const TMDB_API_KEY = '16a1f45ab9ea8e2b2cb99e622966f8dc';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function testTMDbAPI() {
  console.log('Testing TMDb API integration...');
  
  try {
    // Test search movies endpoint
    const searchResponse = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=inception&page=1`
    );
    
    if (!searchResponse.ok) {
      throw new Error(`HTTP error! status: ${searchResponse.status}`);
    }
    
    const searchData = await searchResponse.json();
    console.log('✅ Search API working!');
    console.log(`Found ${searchData.results.length} movies for "inception"`);
    
    if (searchData.results.length > 0) {
      console.log('Sample movie:', {
        title: searchData.results[0].title,
        year: searchData.results[0].release_date?.slice(0, 4),
        rating: searchData.results[0].vote_average
      });
    }
    
    // Test popular movies endpoint
    const popularResponse = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=1`
    );
    
    if (!popularResponse.ok) {
      throw new Error(`HTTP error! status: ${popularResponse.status}`);
    }
    
    const popularData = await popularResponse.json();
    console.log('✅ Popular movies API working!');
    console.log(`Found ${popularData.results.length} popular movies`);
    
    console.log('\n🎉 TMDb API integration is working correctly!');
    console.log('You can now use the movie search feature in your app.');
    
  } catch (error) {
    console.error('❌ Error testing TMDb API:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check your API key is valid');
    console.log('2. Verify your internet connection');
    console.log('3. Check TMDb API status at https://status.themoviedb.org/');
  }
}

// Run if this file is executed directly
if (typeof window === 'undefined') {
  testTMDbAPI();
}

export { testTMDbAPI };
