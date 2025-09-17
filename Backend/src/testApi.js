const axios = require('axios');

const testApi = async () => {
  try {
    console.log("Trying to access API at http://localhost:3001/test");
    const testResponse = await axios.get('http://localhost:3001/test');
    console.log("Test API Response Status:", testResponse.status);
    console.log("Test API Response Data:", testResponse.data);
    
    console.log("\nTrying to access API at http://localhost:3001/api/products");
    const productsResponse = await axios.get('http://localhost:3001/api/products');
    console.log("Products API Response Status:", productsResponse.status);
    console.log("Products API Response Data:", productsResponse.data);
  } catch (error) {
    console.error("API Error:", error.message);
    if (error.response) {
      console.error("API Error Status:", error.response.status);
      console.error("API Error Data:", error.response.data);
    }
  }
};

// Run the test
testApi(); 