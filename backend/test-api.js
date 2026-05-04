fetch('http://localhost:5000/api/officer/complaints').then(r=>r.text()).then(console.log).catch(console.error);
