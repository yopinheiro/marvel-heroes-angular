# MarvelHeroesAngular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.2.1.

## Project Overview

MarvelHeroesAngular is an Angular application that allows users to explore and manage their favorite Marvel heroes. It integrates with the Marvel API to display hero data, provides a responsive UI, and includes features like favoriting heroes and filtering by saved characters.

## Demo

You can view a live demo of the application [here on Vercel](https://marvel-heroes-angular.vercel.app/).

## Features

- Search for Marvel heroes
- Add/remove heroes to/from your favorites
- View detailed information for each hero
- Responsive design for seamless viewing on different devices
- Error handling with a custom-designed error page

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (version 14 or higher)
- [Angular CLI](https://angular.io/cli) (version 14.2.1 or higher)
- Marvel API key (if needed for development)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/marvel-heroes-angular.git
   cd marvel-heroes-angular
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   ng serve
   ```

4. Navigate to `http://localhost:4200/` in your browser to view the app.

## Development

### Code Scaffolding

Run `ng generate component component-name` to generate a new component. You can also use the following commands to generate other elements like services, directives, pipes, etc.:

```bash
ng generate directive|pipe|service|class|guard|interface|enum|module
```

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running Tests

#### Unit Tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

#### End-to-End Tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. Ensure you have added a package that implements E2E testing capabilities.

## Deployment

This application is hosted on [Vercel](https://vercel.com/). To deploy your own version, follow these steps:

1. Link the project to your Vercel account:

   ```bash
   vercel
   ```

2. Push the changes to your repository, and Vercel will automatically deploy the latest version.

## Contribution

Feel free to fork this project and submit pull requests. For major changes, please open an issue to discuss what you would like to change.

## Further Help

To get more help on the Angular CLI, use `ng help` or visit the [Angular CLI Overview and Command Reference](https://angular.io/cli).