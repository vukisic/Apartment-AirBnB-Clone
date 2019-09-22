# Apartment-AirBnB-Clone
AirBnB like application for managing apartments and reservations
# Intro
This application is build for managing apartments and reservations (AirBnB Clone) in more or less simple way. It provides a lot of standard features for this type of application such as adding apartments, creating reservation, commenting, user-managment ect. 

This app suppoorts three types of users:
 * Admins
 * Hosts
 * Guests
 
Main entities are:
 * Users
 * Apartments
 * Reservations
 * Comments
 * Amenities
 
App use Cloudinary service for images, and SQLite for dealing with other data but both of them can be swapped for any service of your prefer.

# Architecture
## Layerd architecture
Layered architecture is the most common architecture pattern.
Each layer of the layered architecture pattern has a specific role and responsibility within the application.
One of the powerful features of the layered architecture pattern is the separation of concerns among components. Components within a specific layer deal only with logic that pertains to that layer...

[[https://github.com/vukisic/Apartment-AirBnB-Clone/blob/master/Diagrap.png|alt=diagram]]
![Diagram](https://raw.githubusercontent.com/vukisic/Apartment-AirBnB-Clone/master/Diagram.png?token=AGFOZAEG6PIQLCAKPE66GKS5Q7DZI)

# Tehnologies
## Frontend
#### Angular
Angular is a TypeScript-based open-source web application framework. (https://angular.io/guide/setup-local)
#### OpenLayers
OpenLayers makes it easy to put a dynamic map in any web page. It can display map tiles, vector data and markers loaded from any source.
(https://openlayers.org/)
#### Ngx-Bootstrap
Ngx-Bootstrap contains all core (and not only) Bootstrap components powered by Angular. (https://valor-software.com/ngx-bootstrap/#/)
#### Bootswatch
Free themes for Bootstrap. (https://bootswatch.com/)
### JWT
JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties.
## Backend
#### .Net Core Web Api (with EFCore)
ASP.NET Core supports creating RESTful services, also known as web APIs, using C#.(http://tiny.cc/p356cz)
#### SQLite
SQLite is a C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine.(https://www.sqlite.org/index.html)
#### Cloudinary
Cloudinary is the market leader in providing a comprehensive cloud-based image and video management platform.(https://cloudinary.com/about)
# How to Run?
## Requirements
  * Visual Studio 2017/2019
  * .Net SDK 2.1/2.2
  * Angular CLI
  * NPM
## Backend
To run this application, just open up a WebApi project in VisualStudio and run it. :smiley:
## Frontend
  * Navigate to "Client" folder and open CMD
  * Run `npm install --save`
  * After that, run `ng serve`
  * Open up browser and navigate to http://localhost:4200/
