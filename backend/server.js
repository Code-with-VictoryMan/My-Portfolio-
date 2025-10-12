// backend/server.js

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000; // The port your backend will run on

// Use CORS to allow communication between frontend and backend
app.use(cors());

// Your project data, now stored in the backend
const projects = [
    {
        title: "Aura Finance Dashboard",
        imageLarge: "images/project-1-large.jpg",
        imageThumb: "images/project-1-thumb.jpg",
        description: "A full-stack personal finance tracker with real-time data visualization, secure user accounts, and budget planning tools.",
        tech: "Vue.js, Chart.js, Node.js, Express",
        liveUrl: "#",
        repoUrl: "#"
    },
    {
        title: "E-Commerce Storefront",
        imageLarge: "images/project-2-large.jpg",
        imageThumb: "images/project-2-thumb.jpg",
        description: "A complete e-commerce solution with product catalogs, shopping cart, and a Stripe-integrated checkout process.",
        tech: "React, Redux, Stripe API, Firebase",
        liveUrl: "#",
        repoUrl: "#"
    }
    // Add more projects here in the future
];

// Create an API endpoint to send the project data
app.get('/api/projects', (req, res) => {
    res.json(projects);
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});