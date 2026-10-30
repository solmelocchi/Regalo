# THE BIRTHDAY EXPERIENCE

Experiencia interactiva en dos partes. HTML, CSS y JavaScript sin frameworks
ni dependencias: se abre con doble clic en `index.html` o desde GitHub Pages.

## Editar el contenido

Todo lo editable vive en **`config.js`**. No hace falta tocar nada más.

| Qué querés cambiar | Dónde |
|---|---|
| Nombre de quien lo recibe | `invitado.nombre` |
| Textos de la pantalla inicial | `intro` |
| Pistas, opciones y respuestas correctas | `sentidos`, `enigma`, `palabra` |
| Bodega, fecha, hora, ubicación y foto | `invitacion` |
| Textos de la caja cerrada | `boveda` |
| Los tres juegos de adivinanza | `adivinanza` |
| El cierre del segundo tramo | `verdad` |
| Pantalla final y nota al pie | `final` |
| Música, efectos, partículas | `ajustes` |

Los campos que queden vacíos (`""`) se muestran como **A confirmar**, con el
mismo estilo. No se rompe nada por dejarlos sin completar.

### La foto de la bodega

Guardá la imagen en `assets/` y escribí el nombre en `invitacion.foto`, por
ejemplo `"assets/bodega.jpg"`. Si no hay foto, se dibuja una ilustración de
viñedo hecha con código. Si la ruta falla, también cae en la ilustración.

## Estructura

```
index.html          una sola página
config.js           todo el contenido editable
css/                tokens, base, animaciones, componentes, pantallas
js/core/            estado, audio, efectos, navegación
js/screens/         una pantalla por archivo
assets/             imágenes propias
```

## Detalles

- **Audio**: la música y los efectos se generan con Web Audio, no hay archivos
  de sonido. Arrancan recién cuando se toca el botón, como exigen los navegadores.
- **Progreso**: se guarda en el navegador. Si recarga la página, sigue donde quedó.
- **Reiniciar**: botón *Vivirla de nuevo* en la última pantalla.
- **Movimiento reducido**: si el sistema lo pide, las animaciones se desactivan.
