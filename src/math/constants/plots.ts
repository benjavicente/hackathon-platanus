export const PLOTS = ["CIRCLE", "SQUARE", "TRIANGLE", "ELLIPSE"] as const;

export type Plot = (typeof PLOTS)[number];

export const PLOT_PROMPT = `Esta herramienta te sirve para generar visualizaciones de figuras geométrica especificas como circulo, elipse, triangulo para educación primaria.

DEBES usar esta tool cuando:
- El alumno necesita visualizar figuras geométricase de formas básicas (círculos, triángulos, cuadrados, elipses)
- Se trabaja con formas ovaladas o circulares

Figuras disponibles:
CÍRCULO     (forma perfectamente redonda)
CUADRADO    (cuatro lados iguales)
TRIÁNGULO   (tres lados)
ELIPSE      (forma ovalada)

El objetivo es ayudar al alumno a:
- Reconocer formas geométricas básicas como circulo, cuadrado triangulo o elipse y sus diferencias
- Entender conceptos geométricos simples
- Visualizar figuras en ejercicios
- Fortalecer la comprensión espacial
- Distinguir entre formas circulares y ovaladas`;
