export default async function handler(req, res) {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

     // Retrieve credentials from environment variables
     const username = process.env.BACKEND_USERNAME;
     const password = process.env.BACKEND_PASSWORD;
   
     // Encode credentials
     const encodedCredentials = Buffer.from(`${username}:${password}`).toString('base64'); 
  
    try {
      const response = await fetch('https://master-wizard-backend.onrender.com/api/save-competencies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${encodedCredentials}`,
        },
        body: JSON.stringify(req.body),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  }