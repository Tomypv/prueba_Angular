# Documentación del Sistema de Testing

Este documento explica cómo se encuentra implementado el sistema de testing en el proyecto **prueba_Angular**, abarcando tanto las pruebas unitarias como las pruebas end-to-end (e2e).

---

## 1. Pruebas Unitarias

Las pruebas unitarias se encargar de verificar el funcionamiento correcto de componentes, servicios y demás unidades de código de la aplicación Angular.

### Herramientas y Configuración

- **Frameworks utilizados:**  
  - [Jasmine](https://jasmine.github.io/) para la definición y ejecución de pruebas.
  - [Karma](https://karma-runner.github.io) como corredor de pruebas.

- **Archivo de Configuración:**  
  - `tsconfig.spec.json`: Configuración de TypeScript específica para las pruebas unitarias.
  
  Ejemplo de configuración parcial:
  ```json
  {
    "extends": "./tsconfig.json",
    "compilerOptions": {
      "outDir": "./out-tsc/spec",
      "types": ["jasmine"]
    },
    "include": [
      "src/**/*.spec.ts",
      "src/**/*.d.ts"
    ]
  }

  ```

  ## Scripts en package.json

	- `"test": "ng test"`  
		Ejecuta las pruebas unitarias a través de Angular CLI y Karma.

	### Ejecución de Pruebas Unitarias

	1. Abrir la terminal integrada de Visual Studio Code (o cualquier terminal en Windows).
	2. Navegar a la raíz del proyecto.
	3. Ejecutar el comando:

		```bash
		npm run test

		```
	4. Karma iniciará una instancia de navegador y ejecutará los tests. El resultado se mostrará en la terminal y en el navegador mediante la interfaz de Karma.

---

## 2. Pruebas End-to-End (E2E)

Las pruebas e2e se encargan de validar la aplicación en su conjunto, simulando el comportamiento del usuario en un entorno real de navegador.

### Herramientas y Configuración

- **Framework utilizado:**  
  Playwright para la automatización de pruebas e2e.

- **Archivo de Configuración:**  
  `playwright.config.ts` configura la ejecución de las pruebas e2e, especificando directorios de pruebas, proyectos para diferentes navegadores y configuración de trazas.

### Ubicación de las Pruebas

Los tests e2e se encuentran en la carpeta `e2e/`, y se incluyen ejemplos de cómo interactuar con la aplicación en archivos como `example.spec.ts`.

- **Scripts en package.json:**  
  El script `"e2e": "ng e2e"` ejecuta las pruebas e2e utilizando Playwright a través de Angular CLI.

### Ejecución de Pruebas End-to-End

1. Abrir la terminal integrada de Visual Studio Code (o cualquier terminal en Windows).
	2. Navegar a la raíz del proyecto.
	3. Ejecutar el comando:

		```bash
		npm run e2e

		```
	4. El framework iniciará el servidor de desarrollo (si no está en ejecución) y ejecutará los tests en los navegadores configurados. Al finalizar, se generará un reporte en formato HTML en la carpeta playwright-report/.

---

## 3. Consideraciones Adicionales

- **Integración Continua:**  
  Se recomienda integrar la ejecución de las pruebas en el flujo de integración continua para garantizar la estabilidad del código en cada commit.

- **Mantenimiento:**  
  Es esencial revisar y mantener actualizadas las configuraciones de los archivos de testing (`tsconfig.spec.json` y `playwright.config.ts`) para adaptarlas a futuras actualizaciones de dependencias y cambios en el proyecto.