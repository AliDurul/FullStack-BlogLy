<h2>🐳 Running BlogLy with Docker</h2>
<p>For a seamless and production-ready setup, BlogLy provides Docker support for both the client (Next.js) and server (Express API) applications, along with MongoDB and Redis services. This allows you to run the entire stack with minimal configuration.</p>

<h3>📦 Project-Specific Docker Requirements</h3>
<ul>
  <li><strong>Node.js Version:</strong> <code>22.14.0</code> (used in both client and server Dockerfiles)</li>
  <li><strong>Yarn Version (server):</strong> <code>4.6.0</code></li>
  <li><strong>MongoDB</strong> and <strong>Redis</strong> are included as services in <code>docker-compose.yml</code></li>
</ul>

<h3>🔑 Required Environment Variables</h3>
<ul>
  <li><code>client/.env.local</code> – for frontend configuration (see <code>client/.env.local</code> for required variables)</li>
  <li><code>server/.env</code> – for backend configuration (see <code>server/.env</code> for required variables)</li>
</ul>
<p>Make sure to provide these files before building the containers. Example templates are available in the respective directories.</p>

<h3>⚙️ How to Build and Run with Docker Compose</h3>
<ol>
  <li>Ensure <code>client/.env.local</code> and <code>server/.env</code> are configured.</li>
  <li>From the project root, run:<br>
    <pre><code>docker compose up --build</code></pre>
  </li>
  <li>Access the app at <code>http://localhost:3000</code> (client) and <code>http://localhost:3001</code> (API server).</li>
</ol>

<h3>🔌 Exposed Ports</h3>
<ul>
  <li><strong>Client (Next.js):</strong> <code>3000</code></li>
  <li><strong>Server (Express API):</strong> <code>3001</code></li>
  <li><strong>MongoDB:</strong> <code>27017</code></li>
  <li><strong>Redis:</strong> <code>6379</code></li>
</ul>

<h3>🛠️ Special Configuration</h3>
<ul>
  <li>Persistent MongoDB data is stored in the <code>mongo-data</code> Docker volume.</li>
  <li>All services are connected via the <code>blogly-net</code> Docker network for secure internal communication.</li>
  <li>Healthchecks are configured for MongoDB and Redis to ensure service readiness.</li>
</ul>

<p>For advanced configuration, review the <code>docker-compose.yml</code> and Dockerfiles in <code>client</code> and <code>server</code> directories.</p>
