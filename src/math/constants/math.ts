export const countNumberPrompt = `Genera ejercicios de conteo y secuencias numéricas para educación básica.

DEBES usar esta tool cuando:
- El ejercicio es de conteo de números
- El alumno quiere aprender a contar
- Se trabaja con secuencias numéricas básicas (1,2,3...)
- Se quiere practicar números del 1 al 100
- El alumno está aprendiendo a contar

Ejemplos de ejercicios:
- Cuenta del 1 al 10: "1, 2, 3, 4, 5, 6, 7, 8, 9, 10"
- De 2 en 2: "2, 4, 6, 8, 10"
- De 5 en 5: "5, 10, 15, 20, 25"
- Cuenta regresiva: "10, 9, 8, 7, 6, 5, 4, 3, 2, 1"
- Números pares: "2, 4, 6, 8, 10"
- Números impares: "1, 3, 5, 7, 9"

El objetivo es ayudar al alumno a:
- Reconocer secuencias numéricas
- Practicar el conteo
- Identificar patrones básicos
- Fortalecer la comprensión numérica


Ejemplos, como ejercicio:
<example>

</example>
`;

export const showLatexPrompt = `Genera expresiones matemáticas en LaTeX para educación básica.

        DEBES usar esta tool cuando:
        - El usuario pide resolver ejercicios básicos
        - Hay operaciones matemáticas simples
        - Se trabaja con fracciones básicas
        - Se necesitan representar multiplicaciones o divisiones

        Formato esperado:
        - LaTeX simple y claro
        - Operaciones paso a paso cuando sea necesario
        - Usar formatos verticales para sumas y restas largas

        Ejemplos:

        SUMAS Y RESTAS:
        - Suma simple: "2 + 3 = 5"
        - Suma vertical:
        "\\begin{array}{r}
           245 \\\\
          +123 \\\\
          \\hline
           368
        \\end{array}"

        - Resta vertical:
        "\\begin{array}{r}
           500 \\\\
          -248 \\\\
          \\hline
           252
        \\end{array}"

        MULTIPLICACIONES:
        - Simple: "4 \\times 3 = 12"
        - Vertical:
        "\\begin{array}{r}
           24 \\\\
          \\times 3 \\\\
          \\hline
           72
        \\end{array}"

        FRACCIONES BÁSICAS:
        - Fracción simple: "\\frac{1}{2}"
        - Suma de fracciones simples: "\\frac{1}{4} + \\frac{1}{4} = \\frac{2}{4}"
        - Comparación de fracciones: "\\frac{1}{2} > \\frac{1}{4}"

        NÚMEROS MIXTOS:
        - Número mixto: "1\\frac{1}{2}"
        - Suma con mixtos: "1\\frac{1}{2} + 2\\frac{1}{2} = 4"

        EJEMPLOS DE EJERCICIOS TÍPICOS:
        - División de pizza: "\\frac{1}{4} \\text{ de pizza}"
        - Reparto en grupos: "15 \\div 3 = 5"
        - Suma de dinero: "$1.500 + $2.500 = $4.000"`;
