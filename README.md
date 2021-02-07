# Gostack-rocketseat
Application developed during the bootcamp Gostack

# Installation
Download docker and run the following commands in the terminal:
<ul>
  <li><strong>docker run --name gostack_gobarber -e POSTGRES_PASSWORD=docker -d postgres</strong></li>
  <li><strong>docker run --name mongodb -p 27017:27017 -d -t mongo</strong></li>
  <li><strong>docker run --name redis -p 6379:6379 -d -t redis:alpine</strong></li>
</ul>

Download the project files, go to the source directory and run <strong>yarn install</strong> in the terminal.

# Run
To run the application run <strong>yarn dev:server</strong> on terminal. The application should be running on http://localhost:3333/
 
# How to use
Since the application doesn't have a front-end yet you'll need to use Insomnia to send requests to the server.

# Creating new users
Go to http://localhost:3333/users using a post request. Then in the body send a JSON like this:
<div>
{
	"name": "John Doe",
	"email": "email@example.com", 
	"password": "123456"
}
</div>
<br>
If it worked you'll receive as response another JSON with the new user informations.
