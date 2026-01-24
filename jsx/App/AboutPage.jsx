import React from 'react';
import { ENGLISH, ESPANOL } from './locale/LocaleConstants.jsx';
import { TranslatableText } from './locale/TranslatableText.jsx'

const aboutPageJSX = {
  [ENGLISH]:
    <div>
      <p>Input content here :) </p>
      <p>To customize this welcome text, edit the jsx/App/AboutPage.jsx file, then run webpack for your changes to take effect. </p>
    </div>,
  [ESPANOL]:
    <div>
      <p>Ingrese el contenido aquí :) </p>
      <p>Para personalizar este texto de bienvenida, edite el archivo 'jsx/App/AboutPage.jsx' y luego ejecute el paquete web para que los cambios surtan efecto. </p>
    </div>,
};

export function AboutPage() {
  return <TranslatableText dictionary={aboutPageJSX} />;
}
