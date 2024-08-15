/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() {\r\n    const lat = 20.67444163271174;\r\n    const lng = -103.38739216304566;\r\n    const mapa = L.map('mapa-inicio').setView([lat, lng ], 16);\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n\r\n    let propiedades = []\r\n    let markers = new L.FeatureGroup().addTo(mapa)  \r\n    \r\n    const filtros = {\r\n        categoria: '',\r\n        precio: ''\r\n    }\r\n        \r\n    const categoria = document.querySelector('#categorias')\r\n    const precio = document.querySelector('#precios')\r\n\r\n    categoria.addEventListener('change', e => {\r\n        filtros.categoria = e.target.value\r\n        filtrarPropiedades()\r\n    })\r\n    precio.addEventListener('change', e => {\r\n        filtros.precio = e.target.value\r\n        filtrarPropiedades()\r\n    })\r\n\r\n\r\n    //Obteniendo las propiedades por la API creada\r\n    async function obtenerPropiedades() {\r\n        try {\r\n            const url = 'api/propiedades'\r\n            const respuesta = await fetch(url) \r\n            propiedades = await respuesta.json()\r\n            \r\n            mostrarPropiedades(propiedades);\r\n            \r\n        } catch (error) {\r\n            console.log(error);\r\n   \r\n        }\r\n    }\r\n\r\n    function mostrarPropiedades( propiedades ) {\r\n\r\n        markers.clearLayers()\r\n        \r\n        propiedades.forEach( propiedad => {\r\n            //Agregar los pines\r\n            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {\r\n                autoPan: true\r\n            }).addTo(mapa).bindPopup(`\r\n                <h3 class=\"font-bold text-xs text-indigo-500 mb-2\">${propiedad?.categoria?.nombre}</h3>\r\n                <h2 class=\"text-xl font-bold text-center\">${propiedad?.titulo}</h2>\r\n                <img class=\"h-10 w-10 block\" src=\"uploads/${propiedad?.imagen}\" alt=\"imagen de la propiedad ${propiedad?.titulo}\"/>\r\n                <a href=\"propiedad/${propiedad.id}\" class=\"block mt-2 uppercase text-center font-bold bg-indigo-500 hover:bg-indigo-700 rounded-md py-2 \">Ver propiedad</a>\r\n                `)\r\n                markers.addLayer(marker)\r\n            })\r\n    }\r\n\r\n    function filtrarPropiedades() {\r\n         const resultado = propiedades.filter(filtrarCategorias).filter(filtrarPrecios)\r\n         mostrarPropiedades(resultado);\r\n    }\r\n    \r\n    function filtrarCategorias(propiedad) {\r\n        return filtros.categoria ?  propiedad.categoriaId.toString() === filtros.categoria.toString() : propiedad\r\n    }\r\n\r\n    function filtrarPrecios(propiedad) {\r\n        return filtros.precio ?  propiedad.precioId.toString() === filtros.precio.toString() : propiedad\r\n    }\r\n\r\n    obtenerPropiedades()\r\n\r\n})()\n\n//# sourceURL=webpack://bienes-raices/./src/js/mapaInicio.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;