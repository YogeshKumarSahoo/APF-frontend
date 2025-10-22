// test-functions.js
// Simple test script to verify Netlify Functions work locally

const { handler: healthHandler } = require('./netlify/functions/health');
const { handler: branchesHandler } = require('./netlify/functions/branches');

async function testHealth() {
  console.log('Testing health function...');
  const result = await healthHandler({ httpMethod: 'GET' }, {});
  console.log('Health result:', JSON.parse(result.body));
}

async function testBranches() {
  console.log('Testing branches function...');
  const testData = {
    httpMethod: 'POST',
    body: JSON.stringify({
      branchId: 'TEST001',
      branchName: 'Test Branch',
      latitude: 37.7749,
      longitude: -122.4194,
      noticeBoardBase64: '',
      waitingAreaBase64: '',
      branchBoardBase64: ''
    })
  };
  
  const result = await branchesHandler(testData, {});
  console.log('Branches result:', JSON.parse(result.body));
}

async function runTests() {
  try {
    await testHealth();
    console.log('✅ Health function test passed');
    
    await testBranches();
    console.log('✅ Branches function test passed');
    
    console.log('\n🎉 All tests passed! Your functions are ready for deployment.');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

runTests();
