"use strict"

import dotenv from 'dotenv';
import swaggerAutogen from 'swagger-autogen';
import { readFileSync } from 'fs';

dotenv.config();

const HOST = process.env?.HOST || '127.0.0.1';
const PORT = process.env?.PORT || 8000;

const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));

const document = {
	info: {
		version: packageJson.version,
		title: packageJson.title,
		description: packageJson.description,
		// termsOfService: "http://www.CourseName.com/#",
		contact: { name: packageJson.author, email: "alidrl26@gmail.com" },
		license: { name: packageJson.license, },
	},
	host: `${HOST}:${PORT}`,
	basePath: '/',
	schemes: ['http', 'https'],
	consumes: ["application/json"],
	produces: ["application/json"],
	securityDefinitions: {
		Bearer: {
			type: 'apiKey',
			in: 'header',
			name: 'Authorization',
			description: 'JWT Authentication * Example: <b>Bearer ...accessToken...</b>'
		},
	},
	security: [{ Bearer: [] }],
	definitions: {
		// Models:
		
	}
}

const routes = ['./src/index.ts']
const outputFile = './src/configs/swagger.json'

// Create JSON file:
swaggerAutogen(outputFile, routes, document)