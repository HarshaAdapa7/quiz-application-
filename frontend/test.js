import axios from 'axios';

async function run() {
  try {
    console.log("Signing up...");
    await axios.post('http://localhost:8080/api/auth/signup', {
      username: 'apitester2',
      email: 'api2@tester.com',
      password: 'password',
      role: 'STUDENT'
    });
  } catch(e) {}

  try {
    console.log("Signing in...");
    const res = await axios.post('http://localhost:8080/api/auth/signin', {
      username: 'apitester2',
      password: 'password'
    });
    const { token, id } = res.data;
    console.log(`Token acquired, ID: ${id}`);
    
    console.log("Fetching profile...");
    const prof = await axios.get(`http://localhost:8080/api/users/${id}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Profile data:", prof.data);
  } catch (err) {
    if (err.response) {
      console.error("Profile error status:", err.response.status);
      console.error("Profile error data:", err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
}

run();
